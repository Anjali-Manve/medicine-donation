import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {sent ? (
        <p>Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-50">
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Send reset link</button>
        </form>
      )}
    </div>
  );
}


