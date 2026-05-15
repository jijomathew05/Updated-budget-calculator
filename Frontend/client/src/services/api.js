const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ── Shared fetch wrapper ────────────────────────────────────────────────────
const request = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
};

// ── Transactions ────────────────────────────────────────────────────────────

/**
 * Fetch all transactions, optionally filtered by month (1-12) and year.
 */
export const fetchTransactions = ({ month, year } = {}) => {
  const params = new URLSearchParams();
  if (month) params.set('month', month);
  if (year)  params.set('year',  year);
  const query = params.toString() ? `?${params}` : '';
  return request(`${BASE_URL}/transactions${query}`);
};

export const createTransaction = (data) =>
  request(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const updateTransaction = (id, data) =>
  request(`${BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const deleteTransaction = (id) =>
  request(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });

// ── Categories ──────────────────────────────────────────────────────────────

export const fetchCategories = () =>
  request(`${BASE_URL}/categories`);

// ── Summary ─────────────────────────────────────────────────────────────────

/**
 * Fetch income/expense summary for the last N months.
 * @param {number} months - Number of months to look back (default: 6)
 */
export const fetchSummary = (months = 6) =>
  request(`${BASE_URL}/summary?months=${months}`);
