const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const { explainMatch, generateIntroMessage, assistantQuery } = require('../services/geminiService');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// POST /api/ai/explain-match
router.post('/explain-match', async (req, res) => {
  try {
    const { customerId, matchId, score, reasons } = req.body;
    const [customer, match] = await Promise.all([
      prisma.customer.findUnique({ where: { id: Number(customerId) } }),
      prisma.customer.findUnique({ where: { id: Number(matchId) } }),
    ]);
    if (!customer || !match) return res.status(404).json({ error: 'Profile not found' });

    const explanation = await explainMatch(customer, match, score, reasons || []);
    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI explanation failed' });
  }
});

// POST /api/ai/generate-intro
router.post('/generate-intro', async (req, res) => {
  try {
    const { customerId, matchId, score } = req.body;
    const [customer, match] = await Promise.all([
      prisma.customer.findUnique({ where: { id: Number(customerId) } }),
      prisma.customer.findUnique({ where: { id: Number(matchId) } }),
    ]);
    if (!customer || !match) return res.status(404).json({ error: 'Profile not found' });

    const message = await generateIntroMessage(customer, match, score);
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI intro generation failed' });
  }
});

// POST /api/ai/assistant
router.post('/assistant', async (req, res) => {
  try {
    const { customerId, question } = req.body;
    if (!customerId || !question) return res.status(400).json({ error: 'customerId and question required' });

    const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const answer = await assistantQuery(customer, question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI assistant failed' });
  }
});

module.exports = router;
