import React from 'react';

const Footer = () => {
  return (
    <footer className="text-white-50 text-center py-3 mt-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} MediCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
