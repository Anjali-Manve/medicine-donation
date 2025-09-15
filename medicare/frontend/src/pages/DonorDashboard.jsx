import { useEffect, useState } from "react";
import axios from "axios";

export default function DonorDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    name: "",
    expiryDate: "", // Keep as expiryDate for frontend state handling
    quantity: 1,
  });
  const [errors, setErrors] = useState({}); // New state for validation errors

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

  // Get medicines from backend
  const fetchMedicines = async () => {
    if (!token) return; // Ensure token exists
    try {
      const res = await axios.get("https://medicine-donation-g74n.onrender.com/api/medicine/my-medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Error fetching donor medicines:", err);
      alert("Failed to load medicines");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle form change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Client-side validation
  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Medicine Name is required";
    }
    if (!form.expiryDate) {
      newErrors.expiryDate = "Expiry Date is required";
    } else if (new Date(form.expiryDate) < new Date()) {
      newErrors.expiryDate = "Expiry Date must be in the future";
    }
    if (form.quantity <= 0) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Add new medicine
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop if form is not valid
    }

    try {
      await axios.post("https://medicine-donation-g74n.onrender.com/api/medicine", { // Send form data with correct field names
        name: form.name,
        expiry: form.expiryDate, // Use 'expiry' to match backend schema
        quantity: form.quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Medicine added successfully ");
      setForm({ name: "", expiryDate: "", quantity: 1 }); // Clear form
      setErrors({}); // Clear errors
      fetchMedicines(); // Refresh list
    } catch (err) {
      console.error("Error adding medicine:", err);
      alert(err.response?.data?.message || "Failed to add medicine");
    }
  };

  // Placeholder for delete functionality
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`https://medicine-donation-g74n.onrender.com/api/medicine/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Medicine deleted successfully!');
        fetchMedicines();
      } catch (err) {
        console.error('Error deleting medicine:', err);
        alert(err.response?.data?.message || 'Failed to delete medicine');
      }
    }
  };

  // Approve a pending request
  const handleApprove = async (id) => {
    try {
      await axios.post(`https://medicine-donation-g74n.onrender.com/api/medicine/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Request approved');
      fetchMedicines();
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  // Reject a pending request
  const handleReject = async (id) => {
    try {
      await axios.post(`https://medicine-donation-g74n.onrender.com/api/medicine/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Request rejected');
      fetchMedicines();
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="container mt-5 py-4">
      <h2 className="mb-4 text-center fw-bold text-success">Welcome, {user?.name || 'Donor'}!</h2>
      <p className="text-center text-muted mb-5">Manage your donated medicines and help those in need.</p>
      <hr className="mb-5" />

      {/* Medicine Add Form */}
      <div className="card p-4 mb-5 shadow-lg border-0 rounded-3">
        <h4 className="card-title mb-4 text-primary">Add New Medicine Donation</h4>
        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-md-5">
            <label htmlFor="medicineName" className="form-label visually-hidden">Medicine Name</label>
            <input
              type="text"
              name="name"
              id="medicineName"
              placeholder="Medicine Name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-md-4">
            <label htmlFor="expiryDate" className="form-label visually-hidden">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              id="expiryDate"
              className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
            {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
          </div>
          <div className="col-md-2">
            <label htmlFor="quantity" className="form-label visually-hidden">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="Quantity"
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>
          <div className="col-md-1">
            <button className="btn btn-success w-100" type="submit">Add</button>
          </div>
        </form>
      </div>

      {/* Medicines List */}
      <div className="card p-4 shadow-lg border-0 rounded-3">
        <h4 className="card-title mb-4 text-primary">Your Donated Medicines</h4>
        {medicines.length === 0 ? (
          <p className="text-muted">No medicines donated yet. Add one above!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-light">
                <tr><th>#</th><th>Medicine Name</th><th>Expiry Date</th><th>Quantity</th><th>Status</th><th>Requested By</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {medicines.map((med, index) => (
                  <tr key={med._id}><th>{index + 1}</th><td>{med.name}</td><td>{new Date(med.expiry).toLocaleDateString()}</td><td>{med.quantity}</td><td>
                      <span className={`badge bg-${med.status === 'available' ? 'warning' : med.status === 'pending' ? 'info' : 'success'}`}>
                        {med.status}
                      </span>
                    </td><td>{med.requestedBy?.user?.name || '-'}</td><td>
                      {med.status === 'pending' ? (
                        <div className="btn-group btn-group-sm" role="group">
                          <button className="btn btn-success" onClick={() => handleApprove(med._id)}>Approve</button>
                          <button className="btn btn-outline-danger" onClick={() => handleReject(med._id)}>Reject</button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(med._id)}
                          disabled={med.status !== 'available'}
                        >
                          Delete
                        </button>
                      )}
                    </td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
