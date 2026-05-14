import React, { useState } from 'react';

const INCOME_CATEGORIES  = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Healthcare',
  'Utilities', 'Shopping', 'Education', 'Travel', 'Other Expense'];

const AddTransactionForm = ({ onAdd }) => {
  const [type,        setType]        = useState('income');
  const [description, setDescription] = useState('');
  const [value,       setValue]       = useState('');
  const [category,    setCategory]    = useState('Salary');

  // Reset category to a safe default when type changes
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !value || parseFloat(value) <= 0) return;

    onAdd({ type, description: description.trim(), value: parseFloat(value), category });

    setDescription('');
    setValue('');
    setCategory(type === 'income' ? 'Salary' : 'Food');
  };

  return (
    <div className="add">
      <form className="add__container" onSubmit={handleSubmit}>
        <select
          id="add-type"
          className="add__type"
          value={type}
          onChange={handleTypeChange}
        >
          <option value="income">+</option>
          <option value="expense">-</option>
        </select>

        <input
          id="add-description"
          type="text"
          className="add__description"
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          id="add-value"
          type="number"
          className="add__value"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0.01"
          step="0.01"
        />

        <select
          id="add-category"
          className="add__category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button id="add-btn" type="submit" className="add__btn">✓</button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
