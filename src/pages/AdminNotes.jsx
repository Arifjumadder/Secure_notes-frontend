import { Link, useSearchParams } from 'react-router-dom';
import { usePaged } from '../api.js';
import Pagination from '../components/Pagination.jsx';

export default function AdminNotes() {
  const [params] = useSearchParams();
  const owner = params.get('owner');
  const { items, pagination, page, setPage, loading, error } = usePaged(owner ? `/notes/all?owner=${owner}` : '/notes/all');

  return (
    <section>
      <h1 className="mb-3 text-lg font-semibold">
        {owner ? 'Notes of one user' : 'Everyone\u2019s notes'} {pagination && <span className="font-normal text-slate-500">({pagination.total})</span>}
        {owner && <Link to="/admin/notes" className="ml-3 text-sm font-normal underline">Show all</Link>}
      </h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">No notes found.</p>}
      <ul className="space-y-3">
        {items.map((n) => (
          <li key={n._id} className="card">
            <h3 className="font-medium">{n.title}</h3>
            <p className="whitespace-pre-wrap text-sm text-slate-600">{n.content}</p>
            <p className="mt-1 text-xs text-slate-400">
              {n.owner ? `${n.owner.name} (${n.owner.email})` : 'deleted user'} · {new Date(n.updatedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
    </section>
  );
}
