import { useState } from 'react';
import { api, usePaged } from '../api.js';
import Pagination from '../components/Pagination.jsx';

const empty = { title: '', content: '' };

export default function Notes() {
  const { items, pagination, page, setPage, loading, error, reload, afterDelete } = usePaged('/notes');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      if (editing) await api(`/notes/${editing}`, { method: 'PUT', body: form });
      else await api('/notes', { method: 'POST', body: form });
      setForm(empty); setEditing(null);
      page === 1 ? reload() : setPage(1);
    } catch (err) { setMsg(err.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this note?')) return;
    try { await api(`/notes/${id}`, { method: 'DELETE' }); afterDelete(); } catch (err) { setMsg(err.message); }
  };

  const edit = (n) => { setEditing(n._id); setForm({ title: n.title, content: n.content }); window.scrollTo(0, 0); };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card space-y-3">
        <h2 className="font-semibold">{editing ? 'Edit note' : 'New note'}</h2>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <input className="input" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input" rows={3} placeholder="Write something..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn">{editing ? 'Save changes' : 'Add note'}</button>
          {editing && <button type="button" className="btn-light" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <section>
        <h2 className="mb-3 font-semibold">My notes {pagination && <span className="font-normal text-slate-500">({pagination.total})</span>}</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-500">No notes yet. Add your first note above.</p>}
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{n.title}</h3>
                  <p className="whitespace-pre-wrap text-sm text-slate-600">{n.content}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(n.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-light" onClick={() => edit(n)}>Edit</button>
                  <button className="btn-danger" onClick={() => remove(n._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
      </section>
    </div>
  );
}
