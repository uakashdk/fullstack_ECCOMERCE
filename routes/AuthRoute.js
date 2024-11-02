import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfilecontroller,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/AuthController.js";
import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";

// Router object
const router = express.Router();

// Register Route (POST)
router.post("/register", registerController);

// Login Route (POST)
router.post("/login", loginController);

// Forgot Password Route (POST)
router.post("/forgot-password", forgotPasswordController);

// Test Route (Protected + Admin Check)
router.get("/test", requireSignIn, isAdmin, testController);

// Protected User Auth Route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Admin Auth Route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update Profile Route (PUT)
router.put("/profile", requireSignIn, updateProfilecontroller);

// Orders Routes

router.get("/orders", requireSignIn, getOrdersController);

// all Orders Routes

router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
