export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-sm">
      <button className="btn-light" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button className="btn-light" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
