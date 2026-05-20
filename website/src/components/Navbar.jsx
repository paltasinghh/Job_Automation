import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">JobAutomation</Link>
        <div className="links">
          <Link to="/jobs">Jobs</Link>
          <a href="/admin" target="_blank" rel="noreferrer">Admin</a>
        </div>
      </div>
    </nav>
  );
}
