import React from 'react';

export default function Pagination({ page, setPage, hasNext, hasPrevious }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="px-3 py-1 border rounded"
        disabled={!hasPrevious}
      >
        Prev
      </button>
      <span className="px-3 py-1">Page {page}</span>
      <button
        onClick={() => setPage((p) => p + 1)}
        className="px-3 py-1 border rounded"
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
}
