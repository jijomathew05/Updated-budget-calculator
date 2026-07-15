import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import TransactionModal from '../components/AddTransactionModal';
import MonthFilter from '../components/MonthFilter';
import TransactionList from '../components/TransactionList';

const Transactions = () => {
  const {
    handleAdd,
    budget,
    totalIncome,
    totalExpense,
    transactions,
    isLoading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    handleUpdate,
    handleDelete,
  } = useBudget();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null); // transaction being edited, or null

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="page">
      <div className="page__header page__header--with-action">
        <div>
          <h1 className="page__title">Transactions</h1>
          <p className="page__subtitle">Manage your income and expenses</p>
        </div>
        <button
          type="button"
          className="add-trigger-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <span aria-hidden="true">＋</span> Add Transaction
        </button>
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

      <div className="transactions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', marginBottom: 20 }}>
        <div className="history-info">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2340' }}>
            Showing {transactions.length} transactions
          </span>
        </div>
        <MonthFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner">⏳ Loading transactions…</div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <TransactionList
            transactions={transactions}
            totalIncome={totalIncome}
            onDelete={handleDelete}
            onEdit={setEditingTx}
          />
        </div>
      )}

      {/* Floating action button — always reachable while scrolling the list */}
      <button
        type="button"
        className="fab"
        onClick={() => setAddModalOpen(true)}
        aria-label="Add transaction"
      >
        ＋
      </button>

      {/* Add */}
      <TransactionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* Edit — keyed by id so switching between items remounts with fresh seed */}
      <TransactionModal
        mode="edit"
        open={!!editingTx}
        transaction={editingTx}
        onClose={() => setEditingTx(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Transactions;
