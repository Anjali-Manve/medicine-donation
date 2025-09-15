import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "donor",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // optional loading state
  const [errors, setErrors] = useState({}); // State for validation errors

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateRegisterForm = () => {
    let newErrors = {};
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\d{10}$/;

    if (!form.name) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Register and send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) {
      return;
    }
    setLoading(true);
    try {
      // Ensure backend is receiving JSON
      const response = await axios.post(
        "https://medicine-donation-g74n.onrender.com/api/auth/register",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data); // log backend response
      toast.success("OTP sent to email!");
      setStep(2);
    } catch (err) {
      console.error("Register error:", err.response || err);
      toast.error(err.response?.data?.message || "Register failed ");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Verifying OTP for email:", form.email);
    console.log("OTP provided:", otp);
    try {
      const response = await axios.post(
        "https://medicine-donation-g74n.onrender.com/api/auth/verify-otp",
        JSON.stringify({
          email: form.email,
          otp,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      // console.log(form.data)

      toast.success("Registration successful! Please login.");
      if (form.role === "donor") {
          console.log("donor done")
      navigate("/donor");
    } else if (form.role === "receiver") {
      console.log("receiver done")  
      navig1111ate("/receiver");
    } else {
      console.log("admin done")
      navigate("/login"); 
    }

      // navigate('/u'); // Redirect to login page
    } catch (err) {
      console.error("OTP verification error:", err.response || err);
      toast.error(err.response?.data?.message || "OTP verification failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)' }}>
      {step === 1 && (
        <div className="card shadow-lg p-4 bg-white rounded" style={{ maxWidth: '500px', width: '100%' }}>
          <Link to="/" className="text-decoration-none text-muted mb-3 d-block">
            <i className="bi bi-arrow-left me-2"></i> Back to Home
          </Link>
          <h2 className="text-center mb-4" style={{ color: '#1a2a6c' }}>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Name</label>
              <input
                type="text"
                name="name"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                name="email"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                onChange={handleChange}
                required
              />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Password</label>
              <input
                type="password"
                name="password"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Role</label>
              <select
                name="role"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                onChange={handleChange}
              >
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
              </select>
            </div>
            <button className="btn w-100 text-white fw-bold" style={{ background: 'linear-gradient(to right, #4a00e0, #8e2de2)', border: 'none' }} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account?</span> <Link to="/login" style={{ color: '#8e2de2', fontWeight: 'bold' }}>Login</Link>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="card shadow-lg p-4 bg-white rounded" style={{ maxWidth: '500px', width: '100%' }}>
          <Link to="/" className="text-decoration-none text-muted mb-3 d-block">
            <i className="bi bi-arrow-left me-2"></i> Back to Home
          </Link>
          <h2 className="text-center mb-4" style={{ color: '#1a2a6c' }}>Verify OTP</h2>
          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label style={{ color: '#1a2a6c', fontWeight: 'bold' }}>Enter OTP</label>
              <input
                type="text"
                className="form-control" style={{ backgroundColor: '#e6e6fa', border: 'none' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button className="btn w-100 text-white fw-bold" style={{ background: 'linear-gradient(to right, #4a00e0, #8e2de2)', border: 'none' }} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account?</span> <Link to="/login" style={{ color: '#8e2de2', fontWeight: 'bold' }}>Login</Link>
            </div>
          </form>
        </div>
      )}
      <footer className="text-white-50 text-center mt-auto" style={{ position: 'absolute', bottom: '20px' }}>
        Copyright © 2020
      </footer>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
