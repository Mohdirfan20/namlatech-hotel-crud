import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  // Generate page numbers array with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-4 rounded-xl shadow-sm gap-4 mt-6">
      {/* Information text */}
      <div className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> hotels
      </div>

      {/* Page Numbers */}
      <nav className="inline-flex items-center -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-md px-2.5 py-1.5 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="relative inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`relative inline-flex items-center px-3.5 py-1.5 text-xs font-semibold focus:z-20 transition ${
                isActive
                  ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ring-1 ring-inset ring-blue-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2.5 py-1.5 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed"
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
