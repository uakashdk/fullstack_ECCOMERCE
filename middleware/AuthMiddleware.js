import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware for token-based protected routes
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access, please sign in",
      });
    }

    const user = await userModel.findById(req.user._id).select("role");
    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access, admin privileges required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization failed:", error);
    return res.status(500).send({
      success: false,
      message: "Server error during admin authorization",
      error: error.message,
    });
  }
};
