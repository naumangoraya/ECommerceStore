import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new review
router.post("/", protectRoute, createReview);

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Update a review
router.put("/:reviewId", protectRoute, updateReview);

// Delete a review
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;
