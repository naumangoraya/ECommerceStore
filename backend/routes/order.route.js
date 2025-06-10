import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

// Admin routes
router.get("/", protectRoute, adminRoute, getAllOrders);
router.put("/:id/status", protectRoute, adminRoute, updateOrderStatus);

export default router; 