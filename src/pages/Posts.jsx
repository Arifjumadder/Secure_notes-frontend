import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, usePaged } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Posts() {
  const { user } = useAuth();
  const { items, pagination, page, setPage, loading, error, reload, afterDelete } = usePaged('/posts');
  const [form, setForm] = useState({ title: '', body: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await api('/posts', { method: 'POST', body: form });
      setForm({ title: '', body: '' });
      page === 1 ? reload() : setPage(1);
    } catch (err) { setMsg(err.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await api(`/posts/${id}`, { method: 'DELETE' }); afterDelete(); } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card space-y-3">
        <h2 className="font-semibold">Write a post (visible to everyone)</h2>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <input className="input" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input" rows={3} placeholder="What's on your mind?" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button className="btn">Publish</button>
      </form>

      <section>
        <h2 className="mb-3 font-semibold">All posts</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-500">No posts yet. Be the first to publish one.</p>}
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="whitespace-pre-wrap text-sm text-slate-600">{p.body}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    by {p.author ? <Link className="underline" to={`/users/${p.author._id}/posts`}>{p.author.name}</Link> : 'deleted user'} · {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                {p.author && (p.author._id === user._id || user.role === 'admin') && (
                  <button className="btn-danger" onClick={() => remove(p._id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
      </section>
    </div>
  );
}
