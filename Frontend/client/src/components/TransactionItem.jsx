import React, { useState } from 'react';

const INCOME_CATEGORIES  = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Healthcare',
  'Utilities', 'Shopping', 'Education', 'Travel', 'Other Expense'];

const formatNumber = (num, tType) => {
  num = Math.abs(num).toFixed(2);
  let [int, dec] = num.split('.');
  if (int.length > 3) {
    int = int.slice(0, int.length - 3) + ',' + int.slice(int.length - 3);
  }
  return (tType === 'income' ? '+ ' : '- ') + int + '.' + dec;
};

const TransactionItem = ({ item, totalIncome, onDelete, onUpdate }) => {
  const [isEditing,   setIsEditing]   = useState(false);
  const [editDesc,    setEditDesc]    = useState(item.description);
  const [editValue,   setEditValue]   = useState(item.value);
  const [editCategory, setEditCategory] = useState(item.category || '');
  const [editDate,     setEditDate]     = useState(new Date(item.date).toISOString().split('T')[0]);
  const [editTime,     setEditTime]     = useState(new Date(item.date).toTimeString().split(' ')[0].slice(0, 5));

  const isExpense  = item.type === 'expense';
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const percentage = isExpense && totalIncome > 0
    ? Math.round((item.value / totalIncome) * 100)
    : -1;

  const handleSave = () => {
    if (!editDesc.trim() || parseFloat(editValue) <= 0) return;
    const localDate = new Date(`${editDate}T${editTime}`);
    if (isNaN(localDate.getTime())) {
      console.error("Invalid edit date or time:", editDate, editTime);
      return;
    }
    onUpdate(item._id, {
      description: editDesc.trim(),
      value: parseFloat(editValue),
      category: editCategory,
      date: localDate.toISOString()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDesc(item.description);
    setEditValue(item.value);
    setEditCategory(item.category || '');
    setEditDate(new Date(item.date).toISOString().split('T')[0]);
    setEditTime(new Date(item.date).toTimeString().split(' ')[0].slice(0, 5));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="item item--editing clearfix">
        <div className="item__edit-form">
          <input
            className="edit__description"
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description"
            autoFocus
          />
          <input
            className="edit__value"
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            min="0.01"
            step="0.01"
          />
          <input
            className="edit__date"
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />
          <input
            className="edit__time"
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
          />
          <select
            className="edit__category"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="item__edit-actions">
            <button className="btn-save"  onClick={handleSave}>✓ Save</button>
            <button className="btn-cancel" onClick={handleCancel}>✕ Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item clearfix" id={`${item.type}-${item._id}`}>
      <div className="item__description">
        {item.description}
        {item.category && (
          <span className="item__category-badge">{item.category}</span>
        )}
        <div className="item__date-label">
          {new Date(item.date).toLocaleDateString(undefined, { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      <div className="right clearfix">
        <div className="item__value">
          {formatNumber(item.value, item.type)}
        </div>
        {isExpense && (
          <div className="item__percentage">
            {percentage > 0 ? `${percentage}%` : '---'}
          </div>
        )}
        <div className="item__actions">
          <button className="item__edit--btn"   onClick={() => setIsEditing(true)}>✎</button>
          <button className="item__delete--btn" onClick={() => onDelete(item._id)}>✕</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
