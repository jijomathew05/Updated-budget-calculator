import { useBudget } from '../context/BudgetContext';
import MonthFilter from '../components/MonthFilter';
import TransactionList from '../components/TransactionList';

const History = () => {
  const {
    transactions, totalIncome, isLoading,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    handleUpdate, handleDelete,
  } = useBudget();

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthName = MONTHS[selectedMonth - 1];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Transaction History</h1>
        <p className="page__subtitle">Review and manage entries for {monthName} {selectedYear}</p>
      </div>

      <div className="transactions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
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
        <div className="loading-spinner">⏳ Loading history…</div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <TransactionList
            transactions={transactions}
            totalIncome={totalIncome}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default History;
