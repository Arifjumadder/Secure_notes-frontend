import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [interests, setInterests] = useState(user.interests.join(', '));
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      const r = await api('/auth/me', { method: 'PUT', body: { name, interests: interests.split(',').map((s) => s.trim()).filter(Boolean) } });
      setUser(r.data);
      setMsg('Profile saved');
    } catch (err) { setMsg(err.message); }
  };

  return (
    <form onSubmit={save} className="card mx-auto max-w-md space-y-3">
      <h1 className="text-lg font-semibold">My profile</h1>
      <p className="text-sm text-slate-500">{user.email} · {user.role}</p>
      {msg && <p className="text-sm text-slate-700">{msg}</p>}
      <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="Interests, comma separated" value={interests} onChange={(e) => setInterests(e.target.value)} />
      <button className="btn">Save profile</button>
    </form>
  );
}
