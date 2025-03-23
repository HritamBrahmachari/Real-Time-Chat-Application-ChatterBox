import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserConversations } from "../controllers/user.controller.js";

const router = express.Router();

// Get conversations for the current user
router.get("/", protectRoute, getUserConversations);

export default router; 