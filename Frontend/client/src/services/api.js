const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/transactions';

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
  return request(`${BASE_URL}${query}`);
};

export const createTransaction = (data) =>
  request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const updateTransaction = (id, data) =>
  request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const deleteTransaction = (id) =>
  request(`${BASE_URL}/${id}`, { method: 'DELETE' });
