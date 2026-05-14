import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';

const BudgetContext = createContext(null);

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
};

export const BudgetProvider = ({ children }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [transactions,  setTransactions]  = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState(null);

  // ── Load ────────────────────────────────────────────────────────────────
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTransactions({ month: selectedMonth, year: selectedYear });
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  // ── Derived values ───────────────────────────────────────────────────────
  const totalIncome  = transactions.filter(t => t.type === 'income') .reduce((a, c) => a + c.value, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.value, 0);
  const budget       = totalIncome - totalExpense;
  const percentage   = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : -1;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.value;
      return acc;
    }, {});
  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAdd = async (data) => {
    try {
      setError(null);
      const newTx = await createTransaction(data);
      setTransactions(prev => [newTx, ...prev]);
    } catch (err) { setError(err.message || 'Failed to add transaction.'); }
  };

  const handleUpdate = async (id, data) => {
    try {
      setError(null);
      const updated = await updateTransaction(id, data);
      setTransactions(prev => prev.map(t => (t._id === id ? updated : t)));
    } catch (err) { setError(err.message || 'Failed to update transaction.'); }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) { setError(err.message || 'Failed to delete transaction.'); }
  };

  return (
    <BudgetContext.Provider value={{
      transactions, isLoading, error, setError,
      selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
      totalIncome, totalExpense, budget, percentage, chartData,
      handleAdd, handleUpdate, handleDelete,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
