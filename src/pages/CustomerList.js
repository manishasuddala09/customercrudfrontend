
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../services/api';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    pin_code: '',
    sort_by: 'id',
    sort_order: 'ASC'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [filters, pagination.current_page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.current_page,
        limit: pagination.per_page
      };

      const response = await customerApi.getAll(params);
      setCustomers(response.data.data || []);

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination(prev => ({
          ...prev,
          total: response.data.total || response.data.data.length,
          total_pages: 1
        }));
      }
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      city: '',
      state: '',
      pin_code: '',
      sort_by: 'id',
      sort_order: 'ASC'
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleDelete = async (id, customerName) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      try {
        await customerApi.delete(id);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="customer-list">
      <div className="page-header">
        <h1>Customer Management</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <SearchFilters 
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Addresses</th>
              <th>Cities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.first_name} {customer.last_name}</td>
                  <td>{customer.phone_number}</td>
                  <td>
                    {customer.address_count === 0
                      ? 'No Address'
                      : customer.address_count === 1
                      ? 'Only One Address'
                      : `${customer.address_count} Addresses`}
                  </td>
                  <td>{customer.cities || 'N/A'}</td>
                  <td className="actions">
                    {/* Programmatic navigation ensures View works */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      View
                    </button>

                    <Link 
                      to={`/customers/${customer.id}/edit`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>

                    <button 
                      onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CustomerList;
