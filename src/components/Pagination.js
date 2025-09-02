import React from 'react';

function Pagination({ pagination, onPageChange }) {
  const { current_page, total_pages, total, per_page } = pagination;

  if (total_pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current_page - delta); 
         i <= Math.min(total_pages - 1, current_page + delta); 
         i++) {
      range.push(i);
    }

    if (current_page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current_page + delta < total_pages - 1) {
      rangeWithDots.push('...', total_pages);
    } else {
      rangeWithDots.push(total_pages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {((current_page - 1) * per_page) + 1} to{' '}
        {Math.min(current_page * per_page, total)} of {total} customers
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="btn btn-secondary"
        >
          Previous
        </button>

        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' && onPageChange(number)}
            disabled={number === '...'}
            className={`btn ${current_page === number ? 'btn-primary' : 'btn-outline'} ${number === '...' ? 'dots' : ''}`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= total_pages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
