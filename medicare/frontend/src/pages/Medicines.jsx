
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Medicines() {
  const [form, setForm] = useState({ name: "", expiryDate: "", quantity: 1 });
  const [medicines, setMedicines] = useState([]);
  const { user } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/medicine/my-medicines",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMedicines(data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load medicines ");
    }
  };

  useEffect(() => {
    if (token && user?.role === "donor") {
      fetchMedicines();
    }
  }, [token]);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!form.name || !form.expiryDate || !form.quantity) {
      return toast.error("All fields are required!");
    }

    try {
      await axios.post("http://localhost:5000/api/medicine", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Medicine added ");
      setForm({ name: "", expiryDate: "", quantity: 1 });
      if (user?.role === "donor") fetchMedicines();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add medicine ");
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/medicine/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Medicine request approved ");
      fetchMedicines();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve request ");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/medicine/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Medicine request rejected ❌");
      fetchMedicines();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject request ❌");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/*  Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ background: "linear-gradient(90deg,#ff512f,#dd2476)" }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            MediCare
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/donate">
                  Donate
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="/logout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/*  Page Content */}
      <main className="flex-grow-1">
        <div className="container py-5 mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              {/* Bootstrap Card Form */}
              <div className="card shadow-lg border-0 rounded-4">
                <div
                  className="card-header text-white text-center rounded-top-4"
                  style={{
                    background: "linear-gradient(90deg,#ff512f,#dd2476)",
                  }}
                >
                  <h4 className="mb-0">Add Medicine</h4>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleAddMedicine}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter medicine name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="expiryDate"
                        value={form.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="quantity"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-lg text-white"
                        style={{
                          background: "linear-gradient(90deg,#00b09b,#96c93d)",
                        }}
                      >
                        ➕ Add Medicine
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*  Footer (Sticky Bottom) */}
      <footer
        className="text-center text-white py-3 mt-auto"
        style={{ background: "linear-gradient(90deg,#ff512f,#dd2476)" }}
      >
        © 2025 MediCare. All rights reserved.
      </footer>

      {/*  Donor Medicines List */}
      {user?.role === "donor" && (
        <div className="container py-4">
          <div className="card p-3 shadow-sm">
            <h5>Your Medicines</h5>
            {medicines.length === 0 ? (
              <p className="text-muted">No medicines available.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med, index) => (
                    <tr key={med._id}>
                      <td>{index + 1}</td>
                      <td>{med.name}</td>
                      <td>
                        {med.expiry && !isNaN(new Date(med.expiry))
                          ? new Date(med.expiry).toLocaleDateString()
                          : "Not provided"}
                      </td>
                      <td>{med.quantity}</td>
                      <td>{med.status}</td>
                      <td>
                        {med.status === "requested" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleApprove(med._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(med._id)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-secondary btn-sm" disabled>
                            {med.status === "approved"
                              ? "Approved"
                              : med.status === "received"
                              ? "Received"
                              : med.status === "available"
                              ? "Available"
                              : "Requested"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored" />
    </div>
  );
}
