let BASE_URL = import.meta.env.VITE_API_URL || '/api';
if (BASE_URL.endsWith('/transactions')) {
  BASE_URL = BASE_URL.slice(0, -13);
}

// ── Shared fetch wrapper ────────────────────────────────────────────────────
const request = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!options.headers) {
    options.headers = {};
  }
  
  if (user && user.token) {
    options.headers['Authorization'] = `Bearer ${user.token}`;
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { response: { data: body }, message: body.error || `Request failed: ${res.status}` };
  }
  return res.json();
};

const api = {
  post: async (path, data) => {
    const res = await request(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: res };
  }
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

export default api;
