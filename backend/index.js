import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Middleware for parsing request body and cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Define frontend URLs for both environments
const PRODUCTION_FRONTEND_URL = "https://stunning-longma-a00b96.netlify.app";
const LOCAL_FRONTEND_URL = "http://localhost:3000";

// Determine environment and set appropriate URLs
const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProduction ? PRODUCTION_FRONTEND_URL : LOCAL_FRONTEND_URL;

// Enhanced CORS setup that works for both environments
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [PRODUCTION_FRONTEND_URL, LOCAL_FRONTEND_URL];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // During development, allow all origins
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept", 
    "Origin"
  ]
}));

// Explicit OPTIONS handler for preflight
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin === PRODUCTION_FRONTEND_URL || origin === LOCAL_FRONTEND_URL) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    frontendURL: FRONTEND_URL
  });
});

// Enable trust proxy for secure cookies in production
if (isProduction) {
  app.set("trust proxy", 1);
}

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

export default app;
