// src/services/api.js
const API_BASE = ('http://localhost:5000') + '/api';

async function API(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include', // crucial for cookie auth
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// Use the backend paths under /api/users
export const registerUser = (payload) =>
  API('/users/signup', { method: 'POST', body: JSON.stringify(payload) });

export const loginUser = (payload) =>
  API('/users/login', { method: 'POST', body: JSON.stringify(payload) });

export const getMe = () => API('/users/me');

export const logoutUser = () => API('/users/logout', { method: 'POST' });

export const updateUser = (payload) =>
  API('/users/update', { method: 'PUT', body: JSON.stringify(payload) });
export const deleteUser = () =>
  API('/users/delete', { method: 'DELETE' });