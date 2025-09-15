import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); //  for image preview
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = user?.token || localStorage.getItem("token");

  // Helper: build a robust image URL
  const buildProfileImageUrl = (val) => {
    if (!val) return null;
    if (val.startsWith("http")) return val;
    if (val.startsWith("/uploads/")) return `https://medicine-donation-g74n.onrender.com${val}`;
    return `https://medicine-donation-g74n.onrender.com/uploads/${val}`;
  };

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("https://medicine-donation-g74n.onrender.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
      setEditForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "", //  ensure address is updated
      });
    } catch (err) {
      toast.error("Failed to fetch profile");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("https://medicine-donation-g74n.onrender.com/api/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated ");
      setIsEditing(false);
      // update profile state immediately so "address" shows right away
      setProfile((prev) => ({ ...prev, ...editForm, address: editForm.address }));
      fetchProfile(); // Re-fetch profile to ensure latest data is displayed
    } catch (err) {
      toast.error("Update failed ");
    }
  };

  // Image Upload
  const handleImageUpload = async () => {
    if (!imageFile) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    try {
      const { data } = await axios.post(
        "https://medicine-donation-g74n.onrender.com/api/profile/upload-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Photo uploaded ");
      setProfile((prev) => ({
        ...prev,
        profilePicture: data.profilePicture, // update immediately
      }));
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Photo upload failed ");
    }
  };

  if (loading) return <h3 className="text-white text-center mt-5">Loading...</h3>;

  const imgSrc = previewUrl || buildProfileImageUrl(profile?.profilePicture);

  return (
    <div className="container py-4 mt-5">
      {/* PROFILE HEADER */}
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "700px", backgroundColor: "#212529", color: "white" }}
      >
        <div className="d-flex flex-column align-items-center text-center">
          {/* Profile Picture */}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="Profile"
              className="rounded-circle shadow mb-2"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid #0d6efd",
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-2"
              style={{ width: "120px", height: "120px" }}
            >
              <i className="bi bi-person fs-1 text-white"></i>
            </div>
          )}

          {/* Change Photo Button */}
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              className="form-control d-none"
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                if (file) setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            <label htmlFor="fileInput" className="btn btn-outline-light btn-sm me-2">
              Change Photo
            </label>
            {imageFile && (
              <button className="btn btn-success btn-sm" onClick={handleImageUpload}>
                Save Photo
              </button>
            )}
          </div>

          {/* Basic Info */}
          <h4 className="mt-3 mb-1">{profile?.name || "Not provided"}</h4>
          <p className="text-muted mb-1">{profile?.email || "Not provided"}</p>
          <span className="badge bg-primary">
            {(profile?.role || "donor").toUpperCase()}
          </span>

          {/* Edit Button */}
          <div className="mt-3">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      {!isEditing && (
        <div
          className="card shadow-lg p-4 mx-auto mt-4"
          style={{ maxWidth: "700px", backgroundColor: "#212529", color: "white" }}
        >
          <h5 className="mb-3">Personal Information</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 rounded" style={{ background: "#2a2f34" }}>
                <small className="text-muted d-block">Name</small>
                <strong>{profile?.name || "Not provided"}</strong>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded" style={{ background: "#2a2f34" }}>
                <small className="text-muted d-block">Email</small>
                <strong>{profile?.email || "Not provided"}</strong>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded" style={{ background: "#2a2f34" }}>
                <small className="text-muted d-block">Phone</small>
                <strong>{profile?.phone || "Not provided"}</strong>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="p-3 rounded" style={{ background: "#2a2f34" }}>
                <small className="text-muted d-block">Address</small>
                <strong>{profile?.address || "Not provided"}</strong>
              </div> */}
            </div>
          </div>
        
      )}

      {/* EDIT FORM */}
      {isEditing && (
        <div
          className="card shadow-lg p-4 mx-auto mt-4"
          style={{ maxWidth: "600px", backgroundColor: "#1c1f23", color: "white" }}
        >
          <h5 className="mb-3 text-center">Edit Profile</h5>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary w-50 me-2">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-light w-50"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DONATION STATS
      <div
        className="card shadow-lg p-4 mx-auto mt-4"
        style={{ maxWidth: "700px", backgroundColor: "#212529", color: "white" }}
      >
        <h5 className="mb-3">Donation Stats</h5>
        <div className="d-flex justify-content-between">
          <span>Total Medicines Donated:</span>
          <span className="badge bg-primary">{profile?.medicines?.length || 0}</span>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span>Reviews Received:</span>
          <span className="badge bg-success">{profile?.reviews?.length || 0}</span>
        </div>
      </div> */}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
