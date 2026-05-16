import { useBudget } from '../context/BudgetContext';
import AddTransactionForm from '../components/AddTransactionForm';

const AddTransaction = () => {
  const { handleAdd, budget, totalIncome, totalExpense } = useBudget();

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Add Transaction</h1>
        <p className="page__subtitle">Record a new income or expense</p>
      </div>

      <div className="stat-grid stat-grid--3" style={{ marginBottom: 40 }}>
        <div className="stat-card" style={{ '--card-color': budget >= 0 ? '#28B9B5' : '#FF5049' }}>
          <div className="stat-card__icon">💰</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Current Budget</p>
            <p className="stat-card__value">{fmt(budget)}</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--card-color': '#28B9B5' }}>
          <div className="stat-card__icon">📈</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Monthly Income</p>
            <p className="stat-card__value">{fmt(totalIncome)}</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--card-color': '#FF5049' }}>
          <div className="stat-card__icon">📉</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Monthly Expenses</p>
            <p className="stat-card__value">{fmt(totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="transactions-bar" style={{ padding: '20px 0' }}>
        <AddTransactionForm onAdd={handleAdd} />
      </div>

      <div className="info-box" style={{ marginTop: 40, padding: 24, background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 className="section-title">💡 Quick Tip</h3>
        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
          Categorizing your transactions helps in generating accurate reports. 
          Use the <strong>History</strong> page to review or edit any previous entries.
        </p>
      </div>
    </div>
  );
};

export default AddTransaction;
