import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";   // ✅ make sure file name exactly matches
import Footer from "./Footer";   // ✅ check same for Footer

const Layout = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
