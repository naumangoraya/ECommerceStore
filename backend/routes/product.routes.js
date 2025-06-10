import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
  searchProducts,
  getProductById,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Get featured products
router.get("/featured", getFeaturedProducts);

// Search products
router.get("/search", searchProducts);

// Get products by category
router.get("/category/:category", getProductsByCategory);

// Get recommended products (must be before /:id route)
router.get("/recommended", getRecommendedProducts);
router.get("/recommended/:id", getRecommendedProducts);

// Create product (admin only)
router.post("/", protectRoute, adminRoute, createProduct);

// Toggle featured product (admin only)
router.put(
  "/:id/toggle-featured",
  protectRoute,
  adminRoute,
  toggleFeaturedProduct
);

// Delete product (admin only)
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// Get product by ID (must be last)
router.get("/:id", getProductById);

export default router;
