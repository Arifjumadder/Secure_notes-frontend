import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(form.email, form.password); nav('/'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto mt-10 max-w-sm space-y-3">
      <h1 className="text-lg font-semibold">Log in</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input className="input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn w-full" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      <p className="text-sm text-slate-500">No account? <Link to="/register" className="underline">Register</Link></p>
    </form>
  );
}
