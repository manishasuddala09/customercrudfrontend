import React from 'react';
import PropTypes from 'prop-types';

function AddressList({ addresses, customerId, onDelete }) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return <div className="no-address">No addresses found for this customer.</div>;
  }

  return (
    <table className="addresses-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Address Details</th>
          <th>City</th>
          <th>State</th>
          <th>PIN Code</th>
          <th>Country</th>
          <th>Primary</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {addresses.map((address, index) => (
          <tr key={address.id}>
            <td>{index + 1}</td>
            <td>{address.address_details}</td>
            <td>{address.city}</td>
            <td>{address.state}</td>
            <td>{address.pin_code}</td>
            <td>{address.country || 'India'}</td>
            <td>{address.is_primary ? 'Yes' : 'No'}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(address.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => window.location.href = `/customers/${customerId}/addresses/${address.id}/edit`}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

AddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AddressList;
