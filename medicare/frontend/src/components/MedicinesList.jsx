import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MedicinesList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/medicine', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setMedicines(res.data);
      } catch (err) {
        console.error('Error fetching medicines:', err.message);
        setError('Failed to load medicines.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [token]);

  if (loading) {
    return <p className="text-center">Loading medicines...</p>;
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <section className="container py-5 bg-light rounded shadow-sm mb-5">
      {medicines.length === 0 ? (
        <p className="text-center">No medicines available right now.</p>
      ) : (
        <div className="row">
          {medicines.map((med) => (
            <div key={med._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card shadow-lg border-0 h-100 rounded-3 p-3">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary fs-4">{med.name}</h5>
                  <p className="card-text mb-2 text-muted">DiseaseHelp: {med.description || 'N/A'}</p>
                  <p className="card-text mb-1">
                    <strong className="text-dark">Quantity:</strong> {med.quantity}
                  </p>
                  <p className="card-text mb-0">
                    <strong className="text-dark">Expiry:</strong> {new Date(med.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MedicinesList;
