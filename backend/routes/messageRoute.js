import express from "express";
import { getMessage, sendMessage, getSystemMessages, getRecentConversations } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import cors from "cors";

const router = express.Router();

// CORS configuration specifically for API endpoints
const FRONTEND_URL = "https://real-time-chat-application-chatter-box.vercel.app";
const messageCors = cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
});

// Custom middleware to handle OPTIONS preflight for message endpoints
const handleMessageOptions = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
};

// Apply specific CORS handlers to each route with explicit OPTIONS handling
router.route("/send/:id").options(messageCors, (req, res) => res.status(200).send());
router.route("/send/:id").post(messageCors, handleMessageOptions, isAuthenticated, sendMessage);

router.route("/system").options(messageCors, (req, res) => res.status(200).send());
router.route("/system").get(messageCors, handleMessageOptions, isAuthenticated, getSystemMessages);

router.route("/:id").options(messageCors, (req, res) => res.status(200).send());
router.route("/:id").get(messageCors, handleMessageOptions, isAuthenticated, getMessage);

router.route("/conversations/recent").options(messageCors, (req, res) => res.status(200).send());
router.route("/conversations/recent").get(messageCors, handleMessageOptions, isAuthenticated, getRecentConversations);

export default router;
