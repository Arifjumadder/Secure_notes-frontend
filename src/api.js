import { useCallback, useEffect, useState } from 'react';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Paginated list hook: server returns { data, pagination }.
export function usePaged(path, limit = 10) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, loading: true, error: '' });

  useEffect(() => setPage(1), [path]);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const sep = path.includes('?') ? '&' : '?';
      const r = await api(`${path}${sep}page=${page}&limit=${limit}`);
      setState({ items: r.data, pagination: r.pagination, loading: false, error: '' });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, [path, page, limit]);

  useEffect(() => { load(); }, [load]);

  // after deleting an item: go back a page if it was the last one on this page
  const afterDelete = () => (state.items.length === 1 && page > 1 ? setPage(page - 1) : load());

  return { ...state, page, setPage, reload: load, afterDelete };
}
