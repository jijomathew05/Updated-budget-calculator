import { useBudget } from '../context/BudgetContext';
import BudgetHeader from '../components/BudgetHeader';
import ExpenseChart from '../components/ExpenseChart';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  </div>
);

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const Dashboard = () => {
  const {
    transactions, totalIncome, totalExpense, budget, percentage, chartData,
    selectedMonth, selectedYear, isLoading
  } = useBudget();

  const monthName = MONTHS[selectedMonth - 1];
  const txCount   = transactions.length;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">{monthName} {selectedYear} overview</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Available Budget" value={fmt(budget)}
          color={budget >= 0 ? '#28B9B5' : '#FF5049'} icon="💰" />
        <StatCard label="Total Income"  value={fmt(totalIncome)}  color="#28B9B5" icon="📈" />
        <StatCard label="Total Expenses" value={fmt(totalExpense)} color="#FF5049" icon="📉" />
        <StatCard label="Transactions"   value={txCount}           color="#6366f1" icon="💳" />
      </div>

      {percentage >= 0 && (
        <div className="spend-bar-wrap">
          <div className="spend-bar-label">
            <span>Spent <strong>{percentage}%</strong> of income</span>
            <span>{fmt(totalExpense)} / {fmt(totalIncome)}</span>
          </div>
          <div className="spend-bar">
            <div
              className="spend-bar__fill"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                background: percentage > 80 ? '#FF5049' : '#28B9B5'
              }}
            />
          </div>
        </div>
      )}

      <div className="dashboard-bottom">
        <div className="dashboard-chart">
          {isLoading
            ? <div className="loading-spinner">⏳ Loading…</div>
            : chartData.length > 0
              ? <ExpenseChart data={chartData} />
              : <div className="empty-chart">No expenses recorded this month.</div>
          }
        </div>

        <div className="dashboard-recent">
          <h3 className="section-title">Recent Transactions</h3>
          {transactions.length === 0
            ? <p className="empty-list">No transactions this month.</p>
            : transactions.slice(0, 6).map(t => (
                <div key={t._id} className={`recent-item recent-item--${t.type}`}>
                  <div>
                    <p className="recent-item__desc">{t.description}</p>
                    <p className="recent-item__cat">{t.category}</p>
                  </div>
                  <span className="recent-item__val">
                    {t.type === 'income' ? '+' : '-'} {fmt(t.value)}
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
