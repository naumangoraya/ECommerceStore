import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute } from "../middleware/auth.middleware.js";
import { 
    getCoupon, 
    validateCoupon, 
    createCoupon, 
    getAllCoupons,
    deleteCoupon 
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Customer routes
router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

// Admin routes
router.get("/all", protectRoute, adminRoute, getAllCoupons);
router.post("/create", protectRoute, adminRoute, createCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

export default router;
