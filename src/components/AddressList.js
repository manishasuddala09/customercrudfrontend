

import React from 'react';

function AddressList({ addresses, customerId, onDelete }) {
  // Ensure addresses is always an array
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  if (safeAddresses.length === 0) {
    return <div className="no-address">No addresses found for this customer.</div>;
  }

  return (
    <div className="address-list">
      <table className="addresses-table">
        <thead>
          <tr>
            <th>ID</th>
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
          {safeAddresses.map((address, index) => (
            <tr key={address.id || index}>
              <td>{address.id || index + 1}</td>
              <td>{address.address_details || 'N/A'}</td>
              <td>{address.city || 'N/A'}</td>
              <td>{address.state || 'N/A'}</td>
              <td>{address.pin_code || 'N/A'}</td>
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
    </div>
  );
}

export default AddressList;
