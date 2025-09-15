import { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews({ donorId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  // Fetch reviews for the specified donor
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!donorId) {
        alert("Missing donor ID. Cannot fetch reviews.");
        return;
      }

      const res = await axios.get(`https://medicine-donation-g74n.onrender.com/api/review/${donorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load reviews ");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [donorId]);

  // Submit a new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Review cannot be empty!");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://medicine-donation-g74n.onrender.com/api/review",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted (waiting for approval)");
      setText("");
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review ");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reviews</h2>
      <hr />

      {/* Add Review Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Write your review..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="3"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/*  Reviews List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5>Recent Reviews</h5>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            <ul className="list-group">
              {reviews.map((rev) => (
                <li key={rev._id} className="list-group-item">
                  <strong>{rev.user?.name || "Anonymous"}:</strong> {rev.text}
                  <span className="badge bg-secondary float-end">
                    {rev.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
