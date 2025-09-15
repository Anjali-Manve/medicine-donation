import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

21
// Middleware to verify JWT
export const protect = async (req, res, next) => {
try {
let token;

if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
token = req.headers.authorization.split(" ")[1];
}

if (!token) {
throw new ApiError(401, "Not authorized, no token");
}

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Attach base user to request, and populate donor/receiver profiles
const user = await User.findById(decoded.id)
  .select("-password")
  .populate("donorProfile")
  .populate("receiverProfile");

if (!user) throw new ApiError(401, "User not found");

// Keep base user for role checks; expose profile id for profile-specific operations
req.user = user;
if (user.role === "donor" && user.donorProfile) {
  req.profileId = user.donorProfile._id;
}
if (user.role === "receiver" && user.receiverProfile) {
  req.profileId = user.receiverProfile._id;
}

next();
} catch (err) {
next(new ApiError(401, "Not authorized, token failed"));
}
};


// Role-based access
export const authorizeRoles = (...roles) => {
return (req, res, next) => {
if (!roles.includes(req.user.role)) {
return next(new ApiError(403, "You do not have permission to perform this action"));
}
next();
};
};