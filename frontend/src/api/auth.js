const BASE = 'http://localhost:3001/api/auth';

const req = (path, options = {}) =>
  fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  });

export const login = (email, password) =>
  req('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const signup = (username, email, password) =>
  req('/signup', { method: 'POST', body: JSON.stringify({ username, email, password }) });

export const logout = () =>
  req('/logout', { method: 'POST' });

export const getMe = () =>
  req('/me');