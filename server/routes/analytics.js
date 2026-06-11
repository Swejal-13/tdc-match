const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const [total, active, sent, meeting, engaged, newCustomers, matchHistory, noteCount] = await Promise.all([
      prisma.customer.count({ where: { profilePool: false } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Active Search' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Match Sent' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Meeting Scheduled' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'Engaged' } }),
      prisma.customer.count({ where: { profilePool: false, status: 'New' } }),
      prisma.matchHistory.count(),
      prisma.note.count(),
    ]);

    // City distribution
    const allCustomers = await prisma.customer.findMany({
      where: { profilePool: false },
      select: { city: true, status: true, gender: true, createdAt: true },
    });

    const cities = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Delhi', 'Ahmedabad'];
    const cityDist = cities.map(city => ({
      city,
      count: allCustomers.filter(c => c.city === city).length,
    }));

    // Monthly data (last 6 months simulated)
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyData = months.map((month, i) => ({
      month,
      sent: [3, 5, 4, 7, 6, 9][i],
      meetings: [1, 2, 3, 4, 3, 5][i],
      profilesReviewed: [12, 18, 14, 22, 20, 28][i],
    }));

    // Gender split
    const maleCt = allCustomers.filter(c => c.gender === 'Male').length;
    const femaleCt = allCustomers.filter(c => c.gender === 'Female').length;

    // Status distribution
    const statusDist = ['New', 'Active Search', 'Match Sent', 'Meeting Scheduled', 'Engaged'].map(s => ({
      name: s,
      value: allCustomers.filter(c => c.status === s).length,
    }));

    res.json({
      summary: {
        total, active, sent, meeting, engaged, newCustomers,
        matchesSent: matchHistory,
        notesWritten: noteCount,
        profilesReviewed: 84,
        conversionRate: total > 0 ? Math.round((engaged / total) * 100) : 0,
      },
      cityDistribution: cityDist,
      monthlyData,
      statusDistribution: statusDist,
      genderSplit: { male: maleCt, female: femaleCt },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
