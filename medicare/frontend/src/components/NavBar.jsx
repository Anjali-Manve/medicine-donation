import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm"
      style={{
        background: "rgba(20, 20, 20, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link
          className="navbar-brand fw-bold fs-4 text-gradient"
          to="/"
          style={{
            background: "linear-gradient(90deg, #ff8a00, #e52e71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          💊 MediCare
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              {/*  Fix: Donate → Medicines */}
              <Link className="nav-link nav-hover" to="/medicines">
                Donate
              </Link>
            </li>
          </ul>

          {/* Right Links */}
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                {/* Profile */}
                <li className="nav-item me-3">
                  <Link className="nav-link nav-hover" to="/profile">
                    Profile
                  </Link>
                </li>

                {/* Admin Dashboard (only for admins) */}
                {user.role === "admin" && (
                  <li className="nav-item me-3">
                    <Link className="btn btn-sm btn-gradient" to="/admin-dashboard">
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-link text-white nav-hover"
                    onClick={handleLogout}
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link nav-hover" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Extra CSS for hover effects + page gap */}
      <style>
        {`
          
          .nav-hover {
            position: relative;
            transition: color 0.3s ease;
          }
          .nav-hover::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, #ff8a00, #e52e71);
            transition: width 0.3s ease;
          }
          .nav-hover:hover::after {
            width: 100%;
          }
          .nav-hover:hover {
            color: #ff8a00 !important;
          }

          .btn-gradient {
            background: linear-gradient(90deg, #ff8a00, #e52e71);
            color: white !important;
            border: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(229, 46, 113, 0.4);
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;
