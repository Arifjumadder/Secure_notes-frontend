import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import Pagination from '../components/Pagination.jsx';

// Uses GET /users/:id/posts  ($lookup aggregation on the backend)
export default function UserPosts() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ data: null, pagination: null, error: '', loading: true });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    api(`/users/${id}/posts?page=${page}&limit=5`)
      .then((r) => setState({ data: r.data, pagination: r.pagination, error: '', loading: false }))
      .catch((e) => setState({ data: null, pagination: null, error: e.message, loading: false }));
  }, [id, page]);

  const { data, pagination, error, loading } = state;
  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold">Posts by {data.user.name}</h1>
      {data.user.interests.length > 0 && <p className="text-sm text-slate-500">Interests: {data.user.interests.join(', ')}</p>}
      {data.posts.length === 0 && <p className="mt-4 text-sm text-slate-500">This user has not posted yet.</p>}
      <ul className="mt-4 space-y-3">
        {data.posts.map((p) => (
          <li key={p._id} className="card">
            <h3 className="font-medium">{p.title}</h3>
            <p className="whitespace-pre-wrap text-sm text-slate-600">{p.body}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(p.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={pagination.hasMore ? page + 1 : page} onChange={setPage} />
    </div>
  );
}
