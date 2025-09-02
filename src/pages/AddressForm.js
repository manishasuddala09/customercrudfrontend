import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi, addressApi } from '../services/api';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';

function AddressForm() {
  const [formData, setFormData] = useState({
    customer_id: '',
    address_details: '',
    city: '',
    state: '',
    pin_code: '',
    is_primary: false
  });
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { customerId, id: addressId } = useParams();
  const isEdit = Boolean(addressId);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
      setFormData(prev => ({ ...prev, customer_id: customerId }));
    }
    
    if (isEdit && addressId) {
      fetchAddress();
    }
  }, [customerId, addressId, isEdit]);

  const fetchCustomer = async () => {
    try {
      const response = await customerApi.getById(customerId);
      setCustomer(response.data.data);
    } catch (err) {
      setSubmitError('Failed to fetch customer details');
    }
  };

  const fetchAddress = async () => {
  try {
    setLoading(true);
    const response = await addressApi.getByCustomerId(customerId);
    const address = response.data.data.find(addr => addr.id === parseInt(addressId));
    
    if (!address) throw new Error('Address not found');

    setFormData({
      customer_id: address.customer_id,
      address_details: address.address_details,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code,
      is_primary: address.is_primary
    });
  } catch (err) {
    setSubmitError(err.message || 'Failed to fetch address details');
  } finally {
    setLoading(false);
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address_details.trim()) {
      newErrors.address_details = 'Address details are required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code = 'PIN code is required';
    } else if (!/^[0-9]{6}$/.test(formData.pin_code)) {
      newErrors.pin_code = 'PIN code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');

      if (isEdit) {
        await addressApi.update(addressId, formData);
      } else {
        await addressApi.create(formData);
      }

      navigate(`/customers/${customerId}`);
    } catch (err) {
      if (err.response?.data?.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError('Failed to save address');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading && isEdit) return <LoadingSpinner />;

  return (
    <div className="address-form">
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Address' : 'Add New Address'}</h1>
          {customer && (
            <p className="customer-info">
              For: {customer.first_name} {customer.last_name} (ID: {customer.id})
            </p>
          )}
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className="alert alert-error">{submitError}</div>
          )}

          <FormField
            label="Address Details"
            name="address_details"
            value={formData.address_details}
            onChange={handleChange}
            error={errors.address_details}
            placeholder="Street address, building name, apartment number..."
            rows={3}
            required
          />

          <div className="form-row">
            <FormField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
            />

            <FormField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              required
            />
          </div>

          <FormField
            label="PIN Code"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            error={errors.pin_code}
            placeholder="6-digit PIN code"
            required
          />

          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Set as primary address
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/customers/${customerId}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Address' : 'Create Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressForm;
