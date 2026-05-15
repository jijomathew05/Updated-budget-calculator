import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { fetchSummary } from '../services/api';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label" style={{ marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.fill, margin: '2px 0', fontSize: 13 }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Reports = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        const raw = await fetchSummary(6);
        // Format for chart: { month: 'Jan 2026', income: X, expense: Y }
        const formatted = raw.map(d => ({
          month: `${MONTHS_SHORT[d.month - 1]} ${d.year}`,
          Income:  d.income,
          Expenses: d.expense,
        }));
        setSummaryData(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadSummary();
  }, []);

  const totalIncome  = summaryData.reduce((a, d) => a + d.Income,   0);
  const totalExpense = summaryData.reduce((a, d) => a + d.Expenses, 0);
  const netSavings   = totalIncome - totalExpense;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Reports</h1>
        <p className="page__subtitle">Income vs Expenses — last 6 months</p>
      </div>

      {isLoading && <div className="loading-spinner">⏳ Loading report data…</div>}
      {error    && <div className="error-banner">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="stat-grid stat-grid--3">
            <div className="stat-card" style={{ '--card-color': '#28B9B5' }}>
              <div className="stat-card__icon">📈</div>
              <div className="stat-card__body">
                <p className="stat-card__label">Total Income (6 mo)</p>
                <p className="stat-card__value">{fmt(totalIncome)}</p>
              </div>
            </div>
            <div className="stat-card" style={{ '--card-color': '#FF5049' }}>
              <div className="stat-card__icon">📉</div>
              <div className="stat-card__body">
                <p className="stat-card__label">Total Expenses (6 mo)</p>
                <p className="stat-card__value">{fmt(totalExpense)}</p>
              </div>
            </div>
            <div className="stat-card" style={{ '--card-color': netSavings >= 0 ? '#6366f1' : '#f97316' }}>
              <div className="stat-card__icon">💎</div>
              <div className="stat-card__body">
                <p className="stat-card__label">Net Savings (6 mo)</p>
                <p className="stat-card__value">{fmt(netSavings)}</p>
              </div>
            </div>
          </div>

          <div className="chart-container chart-container--bar">
            <h3 className="chart-title">📊 Monthly Breakdown</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={summaryData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#777' }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12, fill: '#777' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 14 }} />
                <Bar dataKey="Income"   fill="#28B9B5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#FF5049" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
