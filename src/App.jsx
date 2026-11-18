import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Notes from './pages/Notes.jsx';
import Posts from './pages/Posts.jsx';
import UserPosts from './pages/UserPosts.jsx';
import Profile from './pages/Profile.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminNotes from './pages/AdminNotes.jsx';
import InterestGroups from './pages/InterestGroups.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
          <Route path="/users/:id/posts" element={<ProtectedRoute><UserPosts /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/notes" element={<ProtectedRoute adminOnly><AdminNotes /></ProtectedRoute>} />
          <Route path="/admin/interests" element={<ProtectedRoute adminOnly><InterestGroups /></ProtectedRoute>} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
