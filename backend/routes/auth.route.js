import express from "express";
import { signup, login, logout, checkAuth, getAllUsers, refreshToken } from "../controllers/auth.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);
router.post("/refresh-token", refreshToken);
router.get("/users", protectRoute, adminRoute, getAllUsers);

export default router;
