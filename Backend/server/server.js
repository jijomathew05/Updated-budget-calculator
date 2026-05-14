import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Transaction, { CATEGORIES } from './models/Transaction.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use local file as DB instead of MongoDB
let isMockDB = true;
let mockTransactions = [];
let mockIdCounter = 1;

const dataFile = path.join(__dirname, 'data.json');

// Load existing data from file if it exists
if (fs.existsSync(dataFile)) {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    mockTransactions = JSON.parse(data);
    if (mockTransactions.length > 0) {
      const maxId = Math.max(...mockTransactions.map(t => parseInt(t._id, 10) || 0));
      mockIdCounter = maxId + 1;
    }
  } catch (err) {
    console.error('❌ Error reading local data file:', err);
  }
}

// Helper to save data to file
const saveMockData = () => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(mockTransactions, null, 2));
  } catch (err) {
    console.error('❌ Error writing to local data file:', err);
  }
};

console.log('⚠️ Using local file DB (data.json) as requested.');

// ─── Helper: filter by month/year ──────────────────────────────────────────
const filterByDate = (transactions, month, year) => {
  if (!month || !year) return transactions;
  const m = parseInt(month, 10); // 1-12
  const y = parseInt(year, 10);
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === m && d.getFullYear() === y;
  });
};

// ─── GET /api/transactions?month=5&year=2026 ────────────────────────────────
app.get('/api/transactions', async (req, res) => {
  const { month, year } = req.query;

  if (isMockDB) {
    return res.json(filterByDate(mockTransactions, month, year));
  }

  try {
    let query = {};
    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const start = new Date(y, m - 1, 1);         // first day of month
      const end   = new Date(y, m, 1);              // first day of next month
      query.date  = { $gte: start, $lt: end };
    }
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/transactions ─────────────────────────────────────────────────
app.post('/api/transactions', async (req, res) => {
  const { type, description, value, category } = req.body;

  if (!type || !description || value == null || !category) {
    return res.status(400).json({ error: 'Missing required fields: type, description, value, category' });
  }
  if (value <= 0) {
    return res.status(400).json({ error: 'Value must be greater than 0' });
  }

  if (isMockDB) {
    const newTx = { _id: String(mockIdCounter++), type, description, value, category, date: new Date().toISOString() };
    mockTransactions.push(newTx);
    saveMockData();
    return res.status(201).json(newTx);
  }

  try {
    const transaction = new Transaction({ type, description, value, category });
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── DELETE /api/transactions/:id ───────────────────────────────────────────
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;

  if (isMockDB) {
    mockTransactions = mockTransactions.filter(t => t._id !== id);
    saveMockData();
    return res.json({ success: true });
  }

  try {
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/transactions/:id ──────────────────────────────────────────────
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { description, value, category } = req.body;

  if (value !== undefined && value <= 0) {
    return res.status(400).json({ error: 'Value must be greater than 0' });
  }

  if (isMockDB) {
    const index = mockTransactions.findIndex(t => t._id === id);
    if (index === -1) return res.status(404).json({ error: 'Transaction not found' });

    if (description !== undefined) mockTransactions[index].description = description;
    if (value       !== undefined) mockTransactions[index].value       = value;
    if (category    !== undefined) mockTransactions[index].category    = category;
    
    saveMockData();
    return res.json(mockTransactions[index]);
  }

  try {
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (value       !== undefined) updateData.value       = value;
    if (category    !== undefined) updateData.category    = category;

    const updated = await Transaction.findByIdAndUpdate(
      id, updateData, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
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
app.get('/api/summary', async (req, res) => {
  const numMonths = Math.min(parseInt(req.query.months || '6', 10), 24);

  // Build list of {year, month} for the last N months
  const periods = [];
  const ref = new Date();
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    periods.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  if (isMockDB) {
    const result = periods.map(({ year, month }) => {
      const filtered = filterByDate(mockTransactions, month, year);
      const income  = filtered.filter(t => t.type === 'income') .reduce((a, t) => a + t.value, 0);
      const expense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + t.value, 0);
      return { year, month, income, expense };
    });
    return res.json(result);
  }

  try {
    const earliest = new Date(periods[0].year, periods[0].month - 1, 1);
    const txs = await Transaction.find({ date: { $gte: earliest } });

    const result = periods.map(({ year, month }) => {
      const filtered = txs.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
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

app.use(express.static(path.join(__dirname, '../../Frontend/client/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/client/dist/index.html'));
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
