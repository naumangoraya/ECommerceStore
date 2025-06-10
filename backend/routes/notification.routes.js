import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearReadNotifications,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user notifications
router.get("/", protectRoute, getUserNotifications);

// Mark notification as read
router.patch("/:id/read", protectRoute, markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", protectRoute, markAllNotificationsAsRead);

// Clear read notifications
router.delete("/clear-read", protectRoute, clearReadNotifications);

export default router;
