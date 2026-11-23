import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalItems,
  pageSize,
  total,
  limit,
  onPageChange
}) => {
  // Support both prop naming conventions defensively and enforce strict Number types
  const safeTotalItems = Number(totalItems ?? total ?? 0);
  const safePageSize = Number(pageSize ?? limit ?? 5);
  const safeCurrentPage = Number(currentPage || 1);

  const totalPages = Math.ceil(safeTotalItems / safePageSize);

  if (totalPages <= 1) return null;

  // Generate page numbers array with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const startItem = (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3.5 rounded-xl shadow-xs gap-4 mt-6">
      {/* Information text */}
      <div className="text-xs text-gray-600 font-medium">
        Showing <span className="font-bold text-black">{startItem}</span> to{' '}
        <span className="font-bold text-black">{endItem}</span> of{' '}
        <span className="font-bold text-black">{safeTotalItems}</span> hotels
      </div>

      {/* Page Numbers */}
      <nav className="inline-flex items-center -space-x-px rounded-lg shadow-2xs" aria-label="Pagination">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="relative inline-flex items-center rounded-l-lg px-2.5 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </button>

        {/* Page Buttons */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-3 py-1.5 text-xs font-bold text-gray-400 ring-1 ring-inset ring-gray-300 bg-gray-50"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === safeCurrentPage;
          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`relative inline-flex items-center px-3.5 py-1.5 text-xs font-bold focus:z-20 transition ${
                isActive
                  ? 'z-10 bg-red-600 text-white shadow-xs ring-1 ring-inset ring-red-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-red-50 hover:text-red-700 bg-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="relative inline-flex items-center rounded-r-lg px-2.5 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
