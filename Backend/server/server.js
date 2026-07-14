import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Transaction, { CATEGORIES } from './models/Transaction.js';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── MongoDB Connection ─────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnect…');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ─── Authentication Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── GET /api/transactions?month=5&year=2026 ────────────────────────────────
app.get('/api/transactions', protect, async (req, res) => {
  const { month, year } = req.query;

  try {
    let query = { user: req.user._id };
    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      // Use UTC boundaries to ensure consistency regardless of server timezone
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end   = new Date(Date.UTC(y, m, 1));
      query.date  = { $gte: start, $lt: end };
    }
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/transactions ─────────────────────────────────────────────────
app.post('/api/transactions', protect, async (req, res) => {
  const { type, description, value, category, date } = req.body;

  if (!type || !description || value == null || !category) {
    return res.status(400).json({ error: 'Missing required fields: type, description, value, category' });
  }
  if (value <= 0) {
    return res.status(400).json({ error: 'Value must be greater than 0' });
  }

  try {
    const transaction = new Transaction({ 
      user: req.user._id,
      type, 
      description, 
      value, 
      category,
      date: date || undefined 
    });
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── DELETE /api/transactions/:id ───────────────────────────────────────────
app.delete('/api/transactions/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/transactions/:id ──────────────────────────────────────────────
app.put('/api/transactions/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { description, value, category, date } = req.body;

  if (value !== undefined && value <= 0) {
    return res.status(400).json({ error: 'Value must be greater than 0' });
  }

  try {
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (value       !== undefined) updateData.value       = value;
    if (category    !== undefined) updateData.category    = category;
    if (date        !== undefined) updateData.date        = date;

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id, updateData, { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── GET /api/categories ────────────────────────────────────────────────────
app.get('/api/categories', (_req, res) => {
  res.json(CATEGORIES);
});

// ─── GET /api/summary?months=6 ──────────────────────────────────────────────
// Returns [{year, month, income, expense}] for the last N months
app.get('/api/summary', protect, async (req, res) => {
  const numMonths = Math.min(parseInt(req.query.months || '6', 10), 24);

  // Build list of {year, month} for the range.
  // If we have future transactions, extend the range to include them.
  const periods = [];
  try {
    const now = new Date();
    // Always include at least the next month to show upcoming budget planning
    let endRef = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    
    const latestTx = await Transaction.findOne({ user: req.user._id }).sort({ date: -1 });
    if (latestTx && latestTx.date > endRef) {
      endRef = new Date(latestTx.date);
    }

    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(endRef.getUTCFullYear(), endRef.getUTCMonth() - i, 1));
      periods.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
    }
  } catch (err) {
    // Fallback to current date if DB query fails
    const ref = new Date();
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
      periods.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
    }
  }

  try {
    const earliest = new Date(Date.UTC(periods[0].year, periods[0].month - 1, 1));
    const txs = await Transaction.find({ user: req.user._id, date: { $gte: earliest } });

    const result = periods.map(({ year, month }) => {
      const filtered = txs.filter(t => {
        const d = new Date(t.date);
        return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
      });
      const income  = filtered.filter(t => t.type === 'income') .reduce((a, t) => a + t.value, 0);
      const expense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + t.value, 0);
      return { year, month, income, expense };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Serve Frontend (production) ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../../Frontend/client/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/client/dist/index.html'));
});

// ─── Start Server ───────────────────────────────────────────────────────────
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@demo.com',
        password: 'admin123'
      });
      console.log('✅ Demo Admin seeded: admin@demo.com / admin123');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
};

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down gracefully…');
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
