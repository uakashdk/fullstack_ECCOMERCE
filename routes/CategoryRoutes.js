import express from "express";
import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deletCategoryController,
  singleCategoryController,
  UpdateCategoryController,
} from "../controller/categoryController.js";
const router = express.Router();

// routes
// create Category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
// Update Category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  UpdateCategoryController
);
// Get All Category
router.get("/get-category", categoryController);

// Single Category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deletCategoryController
);

export default router;
