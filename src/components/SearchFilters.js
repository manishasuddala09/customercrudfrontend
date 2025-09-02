import React, { useState } from 'react';

function SearchFilters({ filters, onSearch, onClear }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      city: '',
      state: '',
      pin_code: '',
      sort_by: 'id',
      sort_order: 'ASC'
    };
    setLocalFilters(clearedFilters);
    onClear();
  };

  const handleSortChange = (field) => {
    const newOrder = localFilters.sort_by === field && localFilters.sort_order === 'ASC' ? 'DESC' : 'ASC';
    const newFilters = {
      ...localFilters,
      sort_by: field,
      sort_order: newOrder
    };
    setLocalFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search Customers:</label>
            <input
              type="text"
              id="search"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Name or phone number..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={localFilters.city}
              onChange={handleChange}
              placeholder="Filter by city..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={localFilters.state}
              onChange={handleChange}
              placeholder="Filter by state..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="pin_code">PIN Code:</label>
            <input
              type="text"
              id="pin_code"
              name="pin_code"
              value={localFilters.pin_code}
              onChange={handleChange}
              placeholder="Filter by PIN..."
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={handleClear} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </form>

      <div className="sort-options">
        <span>Sort by:</span>
        <button
          type="button"
          onClick={() => handleSortChange('id')}
          className={`sort-btn ${localFilters.sort_by === 'id' ? 'active' : ''}`}
        >
          ID {localFilters.sort_by === 'id' && (localFilters.sort_order === 'ASC' ? '↑' : '↓')}
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('first_name')}
          className={`sort-btn ${localFilters.sort_by === 'first_name' ? 'active' : ''}`}
        >
          Name {localFilters.sort_by === 'first_name' && (localFilters.sort_order === 'ASC' ? '↑' : '↓')}
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('phone_number')}
          className={`sort-btn ${localFilters.sort_by === 'phone_number' ? 'active' : ''}`}
        >
          Phone {localFilters.sort_by === 'phone_number' && (localFilters.sort_order === 'ASC' ? '↑' : '↓')}
        </button>
      </div>
    </div>
  );
}

export default SearchFilters;
