import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await register({ ...form, interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean) });
      nav('/');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto mt-10 max-w-sm space-y-3">
      <h1 className="text-lg font-semibold">Create account</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input className="input" placeholder="Name" required value={form.name} onChange={set('name')} />
      <input className="input" type="email" placeholder="Email" required value={form.email} onChange={set('email')} />
      <input className="input" type="password" placeholder="Password (min 6 characters)" minLength={6} required value={form.password} onChange={set('password')} />
      <input className="input" placeholder="Interests, comma separated (chess, reading)" value={form.interests} onChange={set('interests')} />
      <button className="btn w-full" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
      <p className="text-sm text-slate-500">Already registered? <Link to="/login" className="underline">Log in</Link></p>
    </form>
  );
}
