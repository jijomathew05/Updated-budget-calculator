import { useState } from 'react';

const DEFAULT_INCOME_CATS  = ['Salary','Freelance','Investment','Gift','Other Income'];
const DEFAULT_EXPENSE_CATS = ['Food','Rent','Transport','Entertainment','Healthcare',
  'Utilities','Shopping','Education','Travel','Other Expense'];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

const Settings = () => {
  const [currency, setCurrency]   = useState(() => localStorage.getItem('currency') || 'USD');
  const [incomeCats,  setIncomeCats]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('incomeCats'))  || DEFAULT_INCOME_CATS;  } catch { return DEFAULT_INCOME_CATS; }
  });
  const [expenseCats, setExpenseCats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('expenseCats')) || DEFAULT_EXPENSE_CATS; } catch { return DEFAULT_EXPENSE_CATS; }
  });
  const [newIncomeCat,  setNewIncomeCat]  = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState('');
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem('currency',    currency);
    localStorage.setItem('incomeCats',  JSON.stringify(incomeCats));
    localStorage.setItem('expenseCats', JSON.stringify(expenseCats));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCat = (type) => {
    if (type === 'income' && newIncomeCat.trim()) {
      setIncomeCats(prev => [...prev, newIncomeCat.trim()]);
      setNewIncomeCat('');
    } else if (type === 'expense' && newExpenseCat.trim()) {
      setExpenseCats(prev => [...prev, newExpenseCat.trim()]);
      setNewExpenseCat('');
    }
  };

  const removeCat = (type, cat) => {
    if (type === 'income')  setIncomeCats(prev  => prev.filter(c => c !== cat));
    if (type === 'expense') setExpenseCats(prev => prev.filter(c => c !== cat));
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__subtitle">Customize your experience</p>
      </div>

      {/* Currency */}
      <div className="settings-card">
        <h2 className="settings-card__title">💱 Currency</h2>
        <div className="settings-row">
          <label htmlFor="currency-select" className="settings-label">Display currency</label>
          <select
            id="currency-select"
            className="settings-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} — {c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Income Categories */}
      <div className="settings-card">
        <h2 className="settings-card__title">📈 Income Categories</h2>
        <div className="cat-tags">
          {incomeCats.map(cat => (
            <span key={cat} className="cat-tag cat-tag--income">
              {cat}
              <button className="cat-tag__remove" onClick={() => removeCat('income', cat)}>✕</button>
            </span>
          ))}
        </div>
        <div className="settings-add-row">
          <input
            className="settings-input"
            placeholder="New income category…"
            value={newIncomeCat}
            onChange={(e) => setNewIncomeCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCat('income')}
          />
          <button className="settings-add-btn settings-add-btn--income" onClick={() => addCat('income')}>+ Add</button>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="settings-card">
        <h2 className="settings-card__title">📉 Expense Categories</h2>
        <div className="cat-tags">
          {expenseCats.map(cat => (
            <span key={cat} className="cat-tag cat-tag--expense">
              {cat}
              <button className="cat-tag__remove" onClick={() => removeCat('expense', cat)}>✕</button>
            </span>
          ))}
        </div>
        <div className="settings-add-row">
          <input
            className="settings-input"
            placeholder="New expense category…"
            value={newExpenseCat}
            onChange={(e) => setNewExpenseCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCat('expense')}
          />
          <button className="settings-add-btn settings-add-btn--expense" onClick={() => addCat('expense')}>+ Add</button>
        </div>
      </div>

      <button className="save-btn" onClick={saveSettings}>
        {saved ? '✅ Saved!' : '💾 Save Settings'}
      </button>
    </div>
  );
};

export default Settings;
