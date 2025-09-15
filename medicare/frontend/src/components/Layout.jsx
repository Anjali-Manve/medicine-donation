import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar is in the same components directory
import Footer from './Footer'; // Assuming Footer is in the same components directory

const Layout = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', minHeight: '100vh', backgroundAttachment: 'fixed' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
