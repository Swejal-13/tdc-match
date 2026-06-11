require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const matchRoutes = require('./routes/matches');
const noteRoutes = require('./routes/notes');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://tdc-match.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 TDC Matchmaker Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
