import { useBudget } from '../context/BudgetContext';
import MonthFilter from '../components/MonthFilter';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';

const Transactions = () => {
  const {
    transactions, totalIncome, isLoading,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    handleAdd, handleUpdate, handleDelete,
  } = useBudget();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Transactions</h1>
        <p className="page__subtitle">Add and manage your income & expenses</p>
      </div>

      <div className="transactions-bar">
        <AddTransactionForm onAdd={handleAdd} />
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
        <TransactionList
          transactions={transactions}
          totalIncome={totalIncome}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Transactions;
