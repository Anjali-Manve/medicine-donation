import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const payload = {
        email: (form.email || "").trim().toLowerCase(),
        password: form.password || "",
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      // Update global auth state immediately
      login(data);

      console.log("Logged in user data:", data.user); // Log user data from backend
      toast.success("Login successful!");
      const userRole = data.user.role; // Get user role from response
      console.log("User role for redirection:", userRole); // Log determined role
      // Redirect based on role, with special handling for admin-dashboard
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(`/${userRole}`);
      }
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;
      const message =
        apiMessage ||
        (status === 401
          ? "Please verify OTP before login"
          : status === 400
          ? "Invalid email or password"
          : "Login failed");
      // Show friendly toast and set field error for clarity
      toast.error(message);
      if (status === 400) {
        setErrors((prev) => ({ ...prev, password: "Invalid email or password" }));
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)' }}>
      <div className="card shadow-lg p-4 bg-white rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <Link to="/" className="text-decoration-none text-muted mb-3 d-block">
          <i className="bi bi-arrow-left me-2"></i> Back to Home
        </Link>
        <h2 className="text-center mb-4" style={{ color: '#1a2a6c' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              name="email"
              className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
            <div className="text-end mt-2">
              <a href="/forgot-password" style={{ color: '#4a00e0' }}>Forgot password?</a>
            </div>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">accept</label>
          </div>
          <button className="btn w-100 text-white fw-bold" style={{ background: 'linear-gradient(to right, #4a00e0, #8e2de2)', border: 'none' }}>Login</button>
          <div className="text-center mt-3">
            <span className="text-muted">Don't have account?</span> <a href="/register" style={{ color: '#8e2de2', fontWeight: 'bold' }}>Create Now</a>
          </div>
        </form>
      </div>
      <footer className="text-white-50 text-center mt-auto" style={{ position: 'absolute', bottom: '20px' }}>
        Copyright © 2020
      </footer>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
