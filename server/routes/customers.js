const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const { calculateCompatibility } = require('../services/matchingEngine');

const router = express.Router();
const prisma = new PrismaClient();

// All routes are protected
router.use(authenticate);

// GET /api/customers — list with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, status, city, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    const where = {
      profilePool: false,
      ...(search && {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { profession: { contains: search } },
          { city: { contains: search } },
          { email: { contains: search } },
        ],
      }),
      ...(status && status !== 'All' && { status }),
      ...(city && city !== 'All' && { city }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sort]: order },
      }),
      prisma.customer.count({ where }),
    ]);

    // Compute profile completion
    const result = customers.map(c => ({
      ...c,
      completion: computeCompletion(c),
    }));

    res.json({ customers: result, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
      include: { notes: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ ...customer, completion: computeCompletion(customer) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const customer = await prisma.customer.create({ data: req.body });
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// GET /api/customers/:id/matches — top 10 AI matches
router.get('/:id/matches', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: Number(req.params.id) } });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';
    const pool = await prisma.customer.findMany({
      where: { profilePool: true, gender: oppositeGender },
    });

    const scored = pool
      .map(match => {
        const { score, compatibilityLevel, reasons } = calculateCompatibility(customer, match);
        return { ...match, score, compatibilityLevel, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(scored);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate matches' });
  }
});

// GET /api/customers/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const [total, active, sent, meeting, engaged] = await Promise.all([
      prisma.customer.count({ where: { profilePool: false } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Active Search' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Match Sent' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Meeting Scheduled' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Engaged' } }),
    ]);
    res.json({ total, active, sent, meeting, engaged, conversionRate: total > 0 ? Math.round((engaged / total) * 100) : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

function computeCompletion(c) {
  const fields = [
    c.firstName, c.lastName, c.gender, c.dateOfBirth, c.age, c.height,
    c.city, c.email, c.phone, c.college, c.degree, c.company,
    c.designation, c.profession, c.income, c.maritalStatus, c.religion,
    c.caste, c.familyValues, c.diet, c.lifestyle, c.personality,
    c.hobbies, c.prefAgeMin, c.prefAgeMax, c.prefCity, c.prefReligion,
    c.motherTongue, c.manglik, c.horoscope,
  ];
  const filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
  return Math.round((filled / fields.length) * 100);
}

module.exports = router;
