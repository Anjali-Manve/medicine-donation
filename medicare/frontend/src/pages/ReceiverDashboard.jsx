import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react"; // Import useContext
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReceiverDashboard() {
  const [medicines, setMedicines] = useState([]);
  const { user } = useContext(AuthContext); // Use AuthContext to get user

  const token = user?.token || localStorage.getItem("token");

  // Fetch all medicines from backend
  const fetchMedicines = async () => {
    try {
      // const token = localStorage.getItem("token"); // Already getting from AuthContext
      const res = await axios.get("http://localhost:5000/api/medicine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load medicines");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [token]); // Add token to dependency array for re-fetching if token changes

  // Request a medicine
  const handleRequest = async (id) => {
    try {
      // const token = localStorage.getItem("token"); // Already getting from AuthContext
      await axios.post(
        `http://localhost:5000/api/medicine/request/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Medicine request sent ");
      fetchMedicines();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send request ");
    }
  };

  // Confirm received medicine
  const handleConfirmReceived = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/medicine/${id}/receive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Medicine received successfully ");
      fetchMedicines();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to confirm receipt ");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Receiver Dashboard</h2>
      <hr />

      <div className="card p-3 shadow-sm">
        <h5>Available Medicines</h5>
        {medicines.length === 0 ? (
          <p className="text-muted">No medicines available.</p>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine Name</th>
                <th>Expiry Date</th>
                <th>Quantity</th>
                <th>Donor</th>
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
                  <td>{med.donor?.user?.name || "N/A"}</td>
                  <td>{med.status}</td>
                  <td>
                    {med.status === 'available' && user?.role === 'receiver' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRequest(med._id)}
                      >
                        Request
                      </button>
                    ) : med.status === 'approved' && user?.role === 'receiver' ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleConfirmReceived(med._id)}
                      >
                        Confirm Received
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        {med.status === 'requested' ? 'Requested' : med.status === 'received' ? 'Received' : 'Not Available'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
