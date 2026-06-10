const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// POST /api/matches/send
router.post('/send', async (req, res) => {
  try {
    const { customerId, matchId, score, compatibilityLevel, reasons, introMessage } = req.body;

    const record = await prisma.matchHistory.create({
      data: {
        customerId: Number(customerId),
        matchId: Number(matchId),
        score: Number(score),
        compatibility: compatibilityLevel,
        reasons: JSON.stringify(reasons || []),
        introMessage: introMessage || '',
        status: 'Sent',
      },
    });

    // Update customer status to "Match Sent" if still in earlier stage
    const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } });
    if (customer && ['New', 'Active Search'].includes(customer.status)) {
      await prisma.customer.update({
        where: { id: Number(customerId) },
        data: { status: 'Match Sent', journeyStep: 3 },
      });
    }

    res.status(201).json({ message: 'Match sent successfully', record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send match' });
  }
});

// GET /api/matches/history/:customerId
router.get('/history/:customerId', async (req, res) => {
  try {
    const history = await prisma.matchHistory.findMany({
      where: { customerId: Number(req.params.customerId) },
      orderBy: { sentAt: 'desc' },
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
});

// GET /api/matches/all — all active matches overview
router.get('/all', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { profilePool: false, status: { not: 'New' } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

module.exports = router;
