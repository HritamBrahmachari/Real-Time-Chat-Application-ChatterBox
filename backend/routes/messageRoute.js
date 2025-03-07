import express from "express";
import { getMessage, sendMessage, getSystemMessages, getRecentConversations } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Simplified routes without complex CORS and auth handling
router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/system", isAuthenticated, getSystemMessages);
router.get("/:id", isAuthenticated, getMessage);
router.get("/conversations/recent", isAuthenticated, getRecentConversations);

export default router;
