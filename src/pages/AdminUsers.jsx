import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, usePaged } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Pagination from '../components/Pagination.jsx';

const empty = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { items, pagination, page, setPage, loading, error, reload, afterDelete } = usePaged('/users');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    const body = { ...form, interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean) };
    if (editing && !body.password) delete body.password;
    try {
      if (editing) await api(`/users/${editing}`, { method: 'PUT', body });
      else await api('/users', { method: 'POST', body });
      setForm(empty); setEditing(null);
      reload();
    } catch (err) { setMsg(err.message); }
  };

  const edit = (u) => {
    setEditing(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
    window.scrollTo(0, 0);
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.name} and all their notes and posts?`)) return;
    try { await api(`/users/${u._id}`, { method: 'DELETE' }); afterDelete(); } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">{editing ? 'Edit user' : 'Add user'}</h2>
        {msg && <p className="text-sm text-red-600 sm:col-span-2">{msg}</p>}
        <input className="input" placeholder="Name" required value={form.name} onChange={set('name')} />
        <input className="input" type="email" placeholder="Email" required value={form.email} onChange={set('email')} />
        <input className="input" type="password" minLength={6} placeholder={editing ? 'New password (leave blank to keep)' : 'Password'} required={!editing} value={form.password} onChange={set('password')} />
        <select className="input" value={form.role} onChange={set('role')}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <input className="input sm:col-span-2" placeholder="Interests, comma separated" value={form.interests} onChange={set('interests')} />
        <div className="flex gap-2 sm:col-span-2">
          <button className="btn">{editing ? 'Save user' : 'Add user'}</button>
          {editing && <button type="button" className="btn-light" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <section>
        <h2 className="mb-3 font-semibold">All users {pagination && <span className="font-normal text-slate-500">({pagination.total})</span>}</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-300 text-slate-500">
              <tr><th className="py-2 pr-3">Name</th><th className="pr-3">Email</th><th className="pr-3">Role</th><th className="pr-3">Interests</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id} className="border-b border-slate-200">
                  <td className="py-2 pr-3"><Link className="underline" to={`/users/${u._id}/posts`}>{u.name}</Link></td>
                  <td className="pr-3">{u.email}</td>
                  <td className="pr-3">{u.role}</td>
                  <td className="pr-3">{u.interests.join(', ')}</td>
                  <td className="space-x-2 whitespace-nowrap text-right">
                    <Link className="btn-light inline-block" to={`/admin/notes?owner=${u._id}`}>Notes</Link>
                    <button className="btn-light" onClick={() => edit(u)}>Edit</button>
                    {u._id !== me._id && <button className="btn-danger" onClick={() => remove(u)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
      </section>
    </div>
  );
}
