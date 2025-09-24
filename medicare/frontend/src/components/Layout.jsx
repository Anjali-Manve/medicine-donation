import React from "react";
import { Outlet } from "react-router-dom";

// ✅ Case-sensitive imports
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', 
      minHeight: '100vh' 
    }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
