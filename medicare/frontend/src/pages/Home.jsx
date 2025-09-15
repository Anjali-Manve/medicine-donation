
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FeaturesSection from "../components/FeaturesSection";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [recentReviews, setRecentReviews] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]); // New state for all available medicines
  const [approvedForMe, setApprovedForMe] = useState([]); // Medicines approved for this receiver
  const [reviewError, setReviewError] = useState(null);
  const [medicineError, setMedicineError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const token = localStorage.getItem("token");
  // const user = JSON.parse(localStorage.getItem("user")); // User is now from context

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login'); // Redirect to login page after logout
  };

  // Fetch recent reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/review", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Get last 3 approved reviews only
      const approved = res.data.filter((r) => r.status === "approved");
      setRecentReviews(approved.slice(0, 3));
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      setReviewError("Failed to load reviews.");
    }
  };

  // Fetch all available medicines
  const fetchAvailableMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // Filter for 'available' status
      setAvailableMedicines(res.data.filter(med => med.status === 'available'));
      // If receiver is logged in, compute approved-for-me list
      if (user && user._id && user.role === 'receiver') {
        const mine = res.data.filter(
          (m) => m.status === 'approved' && m.receiver?.user?._id === user._id
        );
        setApprovedForMe(mine);
      } else {
        setApprovedForMe([]);
      }
    } catch (err) {
      console.error("Error fetching available medicines:", err.message);
      setMedicineError("Failed to load available medicines.");
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAvailableMedicines(); // Fetch all available medicines
  }, []);

  const handleTakeMedicine = async (medicineId) => {
    if (!user || user.role !== 'receiver') {
      alert('You must be a logged-in receiver to request medicines.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/medicine/request/${medicineId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Medicine request sent ");
      fetchAvailableMedicines(); // Refresh the list
    } catch (err) {
      console.error("Error requesting medicine:", err);
      alert(err.response?.data?.message || "Failed to send request ");
    }
  };

  const handleAcceptApproved = async (medicineId) => {
    if (!user || user.role !== 'receiver') return;
    try {
      await axios.post(
        `http://localhost:5000/api/medicine/${medicineId}/receive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Medicine accepted ");
      fetchAvailableMedicines();
    } catch (err) {
      console.error("Error confirming receipt:", err);
      alert(err.response?.data?.message || "Failed to accept medicine ");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="text-white text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">Empowering Health</h1>
          <p className="lead mb-4">
            Connect with donors and receivers. Donate unused medicines, request help, and make a difference.
          </p>
          <div className="mt-4">
            <Link to="/donor" className="btn btn-outline-light btn-lg mx-2 shadow-sm">
              Become a Donor
            </Link>
          </div>
        </div>
      </header>

      {/* Available Medicines Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: 'white' }}>Available Medicines</h2>
          {medicineError && <p className="text-danger text-center">{medicineError}</p>}
          {
            availableMedicines.length === 0 ? (
              <p className="text-center" style={{ color: 'white' }}>No medicines currently available for donation.</p>
            ) : (
              <div className="row">
                {availableMedicines.map((med) => (
                  <div key={med._id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{med.name}</h5>
                        <p className="card-text">Quantity: {med.quantity}</p>
                        <p className="card-text">Expires: {new Date(med.expiry).toLocaleDateString()}</p>
                        {user && user.role === 'receiver' && (
                          <button
                            className="btn btn-info w-100 mt-3"
                            onClick={() => handleTakeMedicine(med._id)}
                            disabled={med.status !== 'available'}
                          >
                            {med.status === 'available' ? 'Take Medicine' : 'Not Available'}
                          </button>
                        )}
                         {(!user || user.role !== 'receiver') && (
                          <p className="text-muted mt-3">Login as receiver to request this medicine.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* Approved For You (Receiver) */}
      {user && user.role === 'receiver' && approvedForMe.length > 0 && (
        <section className="py-3">
          <div className="container">
            <h2 className="text-center mb-4" style={{ color: 'white' }}>Approved For You</h2>
            <div className="row">
              {approvedForMe.map((med) => (
                <div key={med._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-success">{med.name}</h5>
                      <p className="card-text">Quantity: {med.quantity}</p>
                      <p className="card-text">Expires: {new Date(med.expiry).toLocaleDateString()}</p>
                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => handleAcceptApproved(med._id)}
                      >
                        Accept Medicine
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Call to Action */}
      <section className="text-white py-5 text-center mt-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Be the reason someone smiles today!</h2>
          <p className="lead mb-4">
            Join MediCare and help us connect medicines with those who need them.
          </p>
          <Link to="/register" className="btn btn-light btn-lg shadow-sm">
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
}
