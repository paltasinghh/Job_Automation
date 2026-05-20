import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} JobAutomation • Built with MERN</p>
      </div>
    </footer>
  );
}
