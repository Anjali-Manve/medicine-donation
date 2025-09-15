import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../api';
import UserManagementModal from '../components/UserManagementModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getStats()
      ]);
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUserSuccess = () => {
    loadDashboardData(); // Refresh data
    toast.success(editingUser ? 'User updated successfully' : 'User added successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ padding: '20px', color: 'white', minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div>
          <span className="me-3">Welcome, {user?.name}</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h3>{stats.users || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Donors</h5>
              <h3>{stats.donors || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Receivers</h5>
              <h3>{stats.receivers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Medicines</h5>
              <h3>{stats.medicines || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            style={{ backgroundColor: activeTab === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white' }}
          >
            Users Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
            style={{ backgroundColor: activeTab === 'donors' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white' }}
          >
            Donors
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'receivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('receivers')}
            style={{ backgroundColor: activeTab === 'receivers' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white' }}
          >
            Receivers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'medicines' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicines')}
            style={{ backgroundColor: activeTab === 'medicines' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white' }}
          >
            Medicines
          </button>
        </li>
      </ul>

      {/* Content based on active tab */}
      {activeTab === 'users' && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 'bold' }}>
            <span>Users Management</span>
            <button className="btn btn-primary btn-sm" onClick={handleAddUser}>
              <i className="bi bi-plus-circle me-2"></i>Add New User
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id.slice(-6)}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'donor' ? 'bg-success' : 'bg-warning'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.isVerified ? (
                          <i className="bi bi-check-circle text-success"></i>
                        ) : (
                          <i className="bi bi-x-circle text-danger"></i>
                        )}
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleEditUser(user)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center text-muted py-4">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
          <div className="card-header" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 'bold' }}>
            Donors
          </div>
          <div className="card-body">
            <div className="text-center text-muted py-4">
              Donors management coming soon...
            </div>
          </div>
        </div>
      )}

      {activeTab === 'receivers' && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
          <div className="card-header" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 'bold' }}>
            Receivers
          </div>
          <div className="card-body">
            <div className="text-center text-muted py-4">
              Receivers management coming soon...
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medicines' && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
          <div className="card-header" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 'bold' }}>
            Medicines
          </div>
          <div className="card-body">
            <div className="text-center text-muted py-4">
              Medicines management coming soon...
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      <UserManagementModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={editingUser}
        onSuccess={handleUserSuccess}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AdminDashboard;

