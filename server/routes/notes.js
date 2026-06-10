const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/notes?customerId=
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    const notes = await prisma.note.findMany({
      where: customerId ? { customerId: Number(customerId) } : {},
      include: {
        user: { select: { name: true } },
        customer: { select: { firstName: true, lastName: true, colorIdx: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { customerId, text, type } = req.body;
    if (!customerId || !text) return res.status(400).json({ error: 'customerId and text are required' });

    const note = await prisma.note.create({
      data: { customerId: Number(customerId), userId: req.user.id, text, type: type || 'Note' },
      include: { user: { select: { name: true } }, customer: { select: { firstName: true, lastName: true } } },
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const { text, type } = req.body;
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: { text, ...(type && { type }) },
      include: { user: { select: { name: true } } },
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
