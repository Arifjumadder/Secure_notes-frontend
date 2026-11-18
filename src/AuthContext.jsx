import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const start = (r) => { localStorage.setItem('token', r.token); setUser(r.user); };
  const login = async (email, password) => start(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (body) => start(await api('/auth/register', { method: 'POST', body }));
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
