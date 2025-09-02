import React from 'react';

function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
