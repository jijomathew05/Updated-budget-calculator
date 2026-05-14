import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy mode if no MONGO_URI is provided
let isMockDB = false;
let mockTransactions = [];
let mockIdCounter = 1;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB, using mock DB:', err);
    isMockDB = true;
  });
} else {
  console.log('No MONGO_URI provided, using mock DB. Set MONGO_URI to connect to MongoDB.');
  isMockDB = true;
}

// Routes
app.get('/api/transactions', async (req, res) => {
  if (isMockDB) {
    return res.json(mockTransactions);
  }
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { type, description, value } = req.body;
  if (!type || !description || value == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (isMockDB) {
    const newTx = { _id: String(mockIdCounter++), type, description, value, date: new Date() };
    mockTransactions.push(newTx);
    return res.status(201).json(newTx);
  }

  try {
    const transaction = new Transaction({ type, description, value });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  
  if (isMockDB) {
    mockTransactions = mockTransactions.filter(t => t._id !== id);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
