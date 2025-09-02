import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Customer Management System
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/customers" className={`nav-link ${isActive('/customers')}`}>
              All Customers
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/customers/new" className={`nav-link ${isActive('/customers/new')}`}>
              Add Customer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
