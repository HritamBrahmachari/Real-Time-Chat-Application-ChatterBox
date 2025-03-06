import express from "express";
import { getMessage, sendMessage, getSystemMessages, getRecentConversations } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/system").get(isAuthenticated, getSystemMessages);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/conversations/recent").get(isAuthenticated, getRecentConversations);

export default router;
