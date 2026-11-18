import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const link = ({ isActive }) => (isActive ? 'font-semibold underline' : 'hover:underline');

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
        <Link to="/" className="mr-2 text-base font-semibold">Secure Notes</Link>
        {user && (
          <>
            <NavLink to="/" end className={link}>My notes</NavLink>
            <NavLink to="/posts" className={link}>Posts</NavLink>
            <NavLink to="/profile" className={link}>Profile</NavLink>
            {user.role === 'admin' && (
              <>
                <NavLink to="/admin/users" className={link}>Users</NavLink>
                <NavLink to="/admin/notes" className={link}>All notes</NavLink>
                <NavLink to="/admin/interests" className={link}>Interests</NavLink>
              </>
            )}
          </>
        )}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-slate-500">{user.name} ({user.role})</span>
              <button className="btn-light" onClick={() => { logout(); nav('/login'); }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Log in</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
