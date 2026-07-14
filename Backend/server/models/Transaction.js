import mongoose from 'mongoose';

const CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Other Income',
  'Food', 'Rent', 'Transport', 'Entertainment', 'Healthcare',
  'Utilities', 'Shopping', 'Education', 'Travel', 'Other Expense'
];

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true,
    min: [0.01, 'Value must be greater than 0']
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES,
    default: 'Other Expense'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export { CATEGORIES };
export default mongoose.model('Transaction', transactionSchema);
