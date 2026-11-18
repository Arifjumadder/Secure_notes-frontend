import { useState } from 'react';
import { usePaged } from '../api.js';
import Pagination from '../components/Pagination.jsx';

// Uses GET /users/interests/grouped  (single aggregate() call
export default function InterestGroups() {
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const path = interest ? `/users/interests/grouped?interest=${encodeURIComponent(interest)}` : '/users/interests/grouped';
  const { items, pagination, page, setPage, loading, error } = usePaged(path, 5);

  return (
    <section>
      <h1 className="mb-3 text-lg font-semibold">Users grouped by interest</h1>
      <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); setInterest(input.trim()); }}>
        <input className="input max-w-xs" placeholder="Filter by one interest (e.g. chess)" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn">Filter</button>
        {interest && <button type="button" className="btn-light" onClick={() => { setInput(''); setInterest(''); }}>Clear</button>}
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">No interests found. Users can add interests in their profile.</p>}
      <ul className="space-y-3">
        {items.map((g) => (
          <li key={g.interest} className="card">
            <h3 className="font-medium">{g.interest} <span className="font-normal text-slate-500">({g.count})</span></h3>
            <p className="text-sm text-slate-600">{g.users.map((u) => u.name).join(', ')}</p>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={pagination?.totalPages} onChange={setPage} />
    </section>
  );
}
