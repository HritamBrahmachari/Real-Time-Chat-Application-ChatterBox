import express from "express";
import { getOtherUsers, getUserById, login, logout, register, searchUsers } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import cors from "cors";

const router = express.Router();

// CORS configuration specifically for login endpoint
const FRONTEND_URL = "https://real-time-chat-application-chatter-box.vercel.app";
const loginCors = cors({
  origin: FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
});

// Custom middleware to handle OPTIONS preflight for login specifically
const handleLoginOptions = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).send();
  }
  next();
};

// Apply login-specific CORS and preflight handling
router.route("/login").options(loginCors, (req, res) => res.status(200).send());
router.route("/login").post(loginCors, handleLoginOptions, login);

// Regular routes
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/search").get(isAuthenticated, searchUsers);
router.route("/:id").get(isAuthenticated, getUserById);
router.route("/").get(isAuthenticated, getOtherUsers);

export default router;
