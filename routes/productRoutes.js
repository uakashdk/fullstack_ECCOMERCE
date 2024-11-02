import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productfilterController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controller/productController.js";
import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// Routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  createProductController
);

// Update product
router.put(
  "/update-product/:pid", // Changed to lowercase
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get products
router.get("/get-product", getProductController);

// Get single product
router.get("/get-single-product/:slug", getSingleProductController); // Also updated for consistency

// Get photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete("/product/:pid", deleteProductController);

// filter product
router.post("/product-filters", productfilterController);

// product count
router.get("/product-count", productCountController);

// product per page

router.get("/product-list/:page", productListController);

// Search product router

router.get("/search/:keyword", searchProductController);

// similar products

router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product

router.get("/product-category/:slug", productCategoryController);

// Payment Routes
// Token
router.get("/braintree/token", braintreeTokenController);

// payments

router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
