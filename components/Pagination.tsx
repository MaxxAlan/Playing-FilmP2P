import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return [...new Set(pageNumbers)];
  };
  
  const pageNumbers = getPageNumbers();
  
  const baseButtonClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 border";
  const activeButtonClass = "bg-primary text-primary-foreground border-primary";
  const inactiveButtonClass = "bg-card text-foreground border-border hover:bg-input hover:border-subtle";
  const disabledButtonClass = "bg-input text-muted cursor-not-allowed border-border";

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledButtonClass : inactiveButtonClass}`}
      >
        Trước
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`${baseButtonClass} ${currentPage === page ? activeButtonClass : inactiveButtonClass}`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-sm text-muted">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}`}
      >
        Sau
      </button>
    </nav>
  );
};

export default Pagination;
