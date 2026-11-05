const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'bookmart.token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY),
};

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    try { message = (await response.json()).error || message; } catch { /* use default */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined;
  return response.json();
}

export const api = {
  books: (query = '', category = '') => request(`/books?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  updateProfile: (name) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify({ name }) }),
  changePassword: (password) => request('/auth/password', { method: 'PATCH', body: JSON.stringify({ password }) }),
  orders: () => request('/orders'),
  createOrder: (items) => request('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  adminOrders: () => request('/admin/orders'),
  updateOrder: (id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  saveBook: (book) => request('/admin/books', { method: 'POST', body: JSON.stringify(book) }),
  updateBook: (id, book) => request(`/admin/books/${id}`, { method: 'PATCH', body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/admin/books/${id}`, { method: 'DELETE' }),
};
