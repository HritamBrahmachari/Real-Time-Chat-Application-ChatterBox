import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { 
  getUsersForSidebar, 
  getUserConversations, 
  searchUsers 
} from "../controllers/user.controller.js";

const router = express.Router();

// Get all users (original route)
router.get("/", protectRoute, getUsersForSidebar);

// Get only users the current user has conversed with
router.get("/conversations", protectRoute, getUserConversations);

// Search users by name
router.get("/search", protectRoute, searchUsers);

export default router;
