import { useState, useEffect, useMemo } from 'react';
import { fetchTransactions, fetchSummary } from '../services/api';
import MonthFilter from '../components/MonthFilter';
import CategoryDonut from '../components/CategoryDonut';
import TrendBar from '../components/TrendBar';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Shared palette — keep in sync with CategoryDonut for the legend color dots
const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#84cc16',
  '#06b6d4', '#a78bfa', '#fb7185', '#fbbf24', '#34d399'
];

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtCompact = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const Reports = () => {
  // Independent month/year — Reports does NOT share state with the rest of the app.
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-month detail: refetch whenever the selected month/year changes.
  // Per-month detail: refetch whenever the selected month/year changes.
  // All setState calls happen after await (async continuation), so the effect
  // body itself doesn't synchronously trigger a cascading render.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTransactions({ month: selectedMonth, year: selectedYear });
        if (!cancelled) {
          setTransactions(data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Failed to load transactions. Is the backend running?');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedMonth, selectedYear]);

  // 6-month trend: fetched once on mount (anchored to today, independent of selector).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await fetchSummary(6);
        const formatted = raw.map(d => ({
          month: `${MONTHS_SHORT[d.month - 1]} ${String(d.year).slice(2)}`,
          income: d.income,
          expense: d.expense,
        }));
        if (!cancelled) setSummary(formatted);
      } catch {
        // Trend is secondary — don't block the page on it.
        if (!cancelled) setSummary([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Derived values for the selected month.
  const { totalIncome, totalExpense, netSavings, categoryData } = useMemo(() => {
    const income  = transactions.filter(t => t.type === 'income') .reduce((a, t) => a + t.value, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.value, 0);

    const byCat = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.value;
        return acc;
      }, {});

    // Sorted desc so the legend mirrors the donut (largest first).
    const data = Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      totalIncome: income,
      totalExpense: expense,
      netSavings: income - expense,
      categoryData: data,
    };
  }, [transactions]);

  const monthName = MONTHS_LONG[selectedMonth - 1];

  return (
    <div className="page">
      <div className="page__header page__header--with-action">
        <div>
          <h1 className="page__title">Reports</h1>
          <p className="page__subtitle">
            {isLoading ? 'Loading…' : `${monthName} ${selectedYear} breakdown`}
          </p>
        </div>
        <MonthFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {error && <div className="error-banner" onClick={() => setError(null)}>⚠ {error}</div>}

      {/* Summary stat cards for the selected month */}
      <div className="stat-grid stat-grid--3">
        <div className="stat-card" style={{ '--card-color': '#28B9B5' }}>
          <div className="stat-card__icon">📈</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Income ({monthName})</p>
            <p className="stat-card__value">{fmt(totalIncome)}</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--card-color': '#FF5049' }}>
          <div className="stat-card__icon">📉</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Expenses ({monthName})</p>
            <p className="stat-card__value">{fmt(totalExpense)}</p>
          </div>
        </div>
        <div className="stat-card" style={{ '--card-color': netSavings >= 0 ? '#6366f1' : '#f97316' }}>
          <div className="stat-card__icon">💎</div>
          <div className="stat-card__body">
            <p className="stat-card__label">Net ({monthName})</p>
            <p className="stat-card__value">{netSavings >= 0 ? '+' : ''}{fmt(netSavings)}</p>
          </div>
        </div>
      </div>

      {/* Category breakdown: donut + ranked legend */}
      <div className="chart-card reports-breakdown">
        <div className="reports-breakdown__chart">
          <h3 className="reports-section-title">💸 Expenses by Category</h3>
          <CategoryDonut data={categoryData} total={totalExpense} />
        </div>
        <div className="reports-breakdown__legend">
          <h3 className="reports-section-title">Top Categories</h3>
          {categoryData.length === 0 ? (
            <p className="empty-list">No expenses recorded this month.</p>
          ) : (
            <ul className="reports-legend">
              {categoryData.map((cat, i) => {
                const pct = totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0;
                return (
                  <li key={cat.name} className="reports-legend__row">
                    <span className="reports-legend__dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="reports-legend__name">{cat.name}</span>
                    <div className="reports-legend__bar" title={`${pct.toFixed(1)}%`}>
                      <div
                        className="reports-legend__bar-fill"
                        style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className="reports-legend__pct">{pct.toFixed(0)}%</span>
                    <span className="reports-legend__amt">{fmtCompact(cat.value)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 6-month trend (context) */}
      <div className="chart-card reports-trend">
        <h3 className="reports-section-title">📊 6-Month Trend</h3>
        {summary.length === 0 ? (
          <p className="empty-list">No trend data available.</p>
        ) : (
          <TrendBar data={summary} />
        )}
      </div>
    </div>
  );
};

export default Reports;
