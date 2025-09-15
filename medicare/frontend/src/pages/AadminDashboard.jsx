import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    donors: 0,
    receivers: 0,
    medicines: 0,
    reviews: 0,
    users: 0
  });

  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if user is admin
  useEffect(() => {
    if (user.role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    fetchStats();
  }, []);

  // Fetch stats and tables
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [statsRes, donorsRes, receiversRes, medicinesRes] = await Promise.all([
        axios.get("https://medicine-donation-g74n.onrender.com/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://medicine-donation-g74n.onrender.com/api/admin/donors", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://medicine-donation-g74n.onrender.com/api/admin/receivers", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://medicine-donation-g74n.onrender.com/api/admin/medicines", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setDonors(donorsRes.data);
      setReceivers(receiversRes.data);
      setMedicines(medicinesRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load admin data. Please check your connection and try again.'
      );
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4 className="alert-heading">Error loading dashboard</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2 className="mb-0">{stats.users}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Donors</h5>
              <h2 className="mb-0">{stats.donors}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Receivers</h5>
              <h2 className="mb-0">{stats.receivers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Total Medicines</h5>
              <h2 className="mb-0">{stats.medicines}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Donors */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Manage Donors</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={fetchStats}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
          
          {donors.length === 0 ? (
            <div className="alert alert-info">No donors found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Medicines Donated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor, index) => (
                    <tr key={donor._id}>
                      <td>{index + 1}</td>
                      <td>{donor.name || 'N/A'}</td>
                      <td>{donor.email || 'N/A'}</td>
                      <td>{donor.phone || 'N/A'}</td>
                      <td>{donor.medicines?.length || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-info me-2"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Remove Donor"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manage Receivers */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Manage Receivers</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={fetchStats}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
          
          {receivers.length === 0 ? (
            <div className="alert alert-info">No receivers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Medicines Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receivers.map((receiver, index) => (
                    <tr key={receiver._id}>
                      <td>{index + 1}</td>
                      <td>{receiver.name || 'N/A'}</td>
                      <td>{receiver.email || 'N/A'}</td>
                      <td>{receiver.phone || 'N/A'}</td>
                      <td>{receiver.medicines?.length || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-info me-2"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Remove Receiver"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manage Medicines */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Manage Medicines</h5>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={fetchStats}>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
              <button className="btn btn-sm btn-success">
                <i className="bi bi-plus-lg"></i> Add Medicine
              </button>
            </div>
          </div>
          
          {medicines.length === 0 ? (
            <div className="alert alert-info">No medicines found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Donor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr key={medicine._id}>
                      <td>{index + 1}</td>
                      <td>{medicine.name || 'N/A'}</td>
                      <td>{medicine.type || 'N/A'}</td>
                      <td>{medicine.expiry ? new Date(medicine.expiry).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`badge ${medicine.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                          {medicine.status || 'N/A'}
                        </span>
                      </td>
                      <td>{medicine.donor?.name || 'N/A'}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-info me-1"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning me-1"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
