import axios from "axios";

const API = axios.create({ baseURL: "https://medicine-donation-g74n.onrender.com/api" });

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Admin API functions
export const adminAPI = {
  // Admin authentication
  adminLogin: (credentials) => API.post("/auth/admin-login", credentials),

  // User management
  getAllUsers: () => API.get("/admin/users"),
  addUser: (userData) => API.post("/admin/users", userData),
  editUser: (id, userData) => API.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),

  // Dashboard stats
  getStats: () => API.get("/admin/stats"),

  // Other admin functions
  getDonors: () => API.get("/admin/donors"),
  getReceivers: () => API.get("/admin/receivers"),
  getMedicines: () => API.get("/admin/medicines"),
  getReviews: () => API.get("/admin/reviews"),
};

export default API;
