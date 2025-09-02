

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { customerApi, addressApi } from '../services/api';
import AddressList from '../components/AddressList';
import LoadingSpinner from '../components/LoadingSpinner';

function CustomerDetail() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch customer with addresses
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const response = await customerApi.getById(`/${id}`);
      const data = response.data.data;

      setCustomer({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        addresses: Array.isArray(data.addresses) ? data.addresses : [],
        address_count: data.address_count || 0,
        created_at: data.created_at,
      });
    } catch (err) {
      setError('Failed to fetch customer details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const handleDeleteCustomer = async () => {
    const customerName = `${customer.first_name} ${customer.last_name}`;
    if (window.confirm(`Are you sure you want to delete ${customerName}? This will also delete all associated addresses.`)) {
      try {
        await customerApi.delete(id);
        navigate('/customers');
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await addressApi.delete(addressId);
      fetchCustomerData(); // refresh after deletion
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="customer-detail">
      <div className="page-header">
        <div>
          <h1>{customer.first_name} {customer.last_name}</h1>
          <p className="customer-id">Customer ID: {customer.id}</p>
        </div>
        <div className="header-actions">
          <Link to={`/customers/${id}/edit`} className="btn btn-warning">Edit Customer</Link>
          <button onClick={handleDeleteCustomer} className="btn btn-danger">Delete Customer</button>
        </div>
      </div>

      <div className="customer-info">
        <div className="info-card">
          <h3>Contact Information</h3>
          <div className="info-row">
            <span className="label">Phone Number:</span>
            <span className="value">{customer.phone_number}</span>
          </div>
          <div className="info-row">
            <span className="label">Total Addresses:</span>
            <span className={`value ${customer.address_count === 1 ? 'single-address' : 'multiple-addresses'}`}>
              {customer.address_count === 0 ? 'No Address' :
               customer.address_count === 1 ? 'Only One Address' :
               `${customer.address_count} Addresses`}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Created:</span>
            <span className="value">{new Date(customer.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="addresses-section">
        <div className="section-header">
          <h3>Addresses</h3>
          <Link to={`/customers/${id}/addresses/new`} className="btn btn-primary">Add New Address</Link>
        </div>

        <AddressList
          addresses={customer.addresses}
          customerId={id}
          onDelete={handleDeleteAddress}
        />
      </div>
    </div>
  );
}

export default CustomerDetail;
