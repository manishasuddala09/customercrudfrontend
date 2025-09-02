import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi, addressApi } from '../services/api';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';

function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    addresses: [
      {
        address_details: '',
        city: '',
        state: '',
        pin_code: '',
        country: 'India',
        is_primary: true,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Fetch customer and addresses if editing
  useEffect(() => {
    if (isEdit) fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setSubmitError('');

      // 1️⃣ Fetch customer details
      const customerRes = await customerApi.getById(id);
      const customer = customerRes.data.data;

      // 2️⃣ Fetch customer addresses
      const addressesRes = await addressApi.getByCustomerId(id);

      setFormData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        email: customer.email || '',
        addresses:
          addressesRes.data.data.length > 0
            ? addressesRes.data.data
            : [
                {
                  address_details: '',
                  city: '',
                  state: '',
                  pin_code: '',
                  country: 'India',
                  is_primary: true,
                },
              ],
      });
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to fetch customer details'
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone_number))
      newErrors.phone_number = 'Phone number must be 10 digits';

    formData.addresses.forEach((addr, idx) => {
      if (!addr.address_details.trim()) newErrors[`address_details_${idx}`] = 'Address is required';
      if (!addr.city.trim()) newErrors[`city_${idx}`] = 'City is required';
      if (!addr.state.trim()) newErrors[`state_${idx}`] = 'State is required';
      if (!addr.pin_code.trim()) newErrors[`pin_code_${idx}`] = 'Pin code is required';
      else if (!/^[0-9]{6}$/.test(addr.pin_code)) newErrors[`pin_code_${idx}`] = 'Pin code must be 6 digits';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][field] = value;
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));

    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: '' }));
  };

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { address_details: '', city: '', state: '', pin_code: '', country: 'India', is_primary: false },
      ],
    }));
  };

  const removeAddress = (index) => {
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
    // Ensure at least one primary
    if (!updatedAddresses.some((a) => a.is_primary) && updatedAddresses.length > 0) {
      updatedAddresses[0].is_primary = true;
    }
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setSubmitError('');

      let customerId = id;

      // 1️⃣ Create or update customer
      let customerResponse;
      if (isEdit) {
        customerResponse = await customerApi.update(id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email: formData.email,
        });
      } else {
        customerResponse = await customerApi.create({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email: formData.email,
        });
        customerId = customerResponse.data.data.id;
      }

      // 2️⃣ Create or update addresses
      for (const addr of formData.addresses) {
        const payload = {
          customer_id: customerId,
          address_details: addr.address_details,
          city: addr.city,
          state: addr.state,
          pin_code: addr.pin_code,
          country: addr.country,
          is_primary: addr.is_primary,
        };

        if (addr.id) {
          await addressApi.update(addr.id, payload);
        } else {
          await addressApi.create(payload);
        }
      }

      navigate('/customers');
    } catch (err) {
      console.error('Save error:', err);
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save customer';
      setSubmitError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <LoadingSpinner />;

  return (
    <div className="customer-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {submitError && <div className="alert alert-error">{submitError}</div>}

          <FormField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            required
          />
          <FormField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            required
          />
          <FormField
            label="Phone Number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            placeholder="10-digit phone number"
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <h3>Addresses</h3>
          {formData.addresses.map((addr, idx) => (
            <div key={idx} className="address-block">
              <FormField
                label="Address"
                value={addr.address_details}
                onChange={(e) => handleAddressChange(idx, 'address_details', e.target.value)}
                error={errors[`address_details_${idx}`]}
                required
              />
              <FormField
                label="City"
                value={addr.city}
                onChange={(e) => handleAddressChange(idx, 'city', e.target.value)}
                error={errors[`city_${idx}`]}
                required
              />
              <FormField
                label="State"
                value={addr.state}
                onChange={(e) => handleAddressChange(idx, 'state', e.target.value)}
                error={errors[`state_${idx}`]}
                required
              />
              <FormField
                label="Pin Code"
                value={addr.pin_code}
                onChange={(e) => handleAddressChange(idx, 'pin_code', e.target.value)}
                error={errors[`pin_code_${idx}`]}
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={addr.is_primary}
                  onChange={() => {
                    const updatedAddresses = formData.addresses.map((a, i) => ({
                      ...a,
                      is_primary: i === idx,
                    }));
                    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
                  }}
                />
                Primary
              </label>
              {formData.addresses.length > 1 && (
                <button type="button" onClick={() => removeAddress(idx)}>
                  Remove
                </button>
              )}
              <hr />
            </div>
          ))}

          <button type="button" onClick={addAddress}>
            Add Address
          </button>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/customers')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
