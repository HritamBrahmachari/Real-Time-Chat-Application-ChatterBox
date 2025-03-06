import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
connectDB(); // Call this ONCE at startup

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Get the frontend URL from environment variables
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS configuration with multiple allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://real-time-chat-application-chatter-box.vercel.app',
  'https://chatterbox-frontend.vercel.app'
];

console.log('CORS allowed origins:', allowedOrigins);

// Add pre-flight OPTIONS handler for CORS for all routes
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // Check if the origin is in our allowed list
  if (allowedOrigins.includes(origin)) {
    // Respond with appropriate CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Respond with 200 OK for OPTIONS requests
  res.statusCode = 200;
  res.end();
});

// Configure standard CORS for all other requests
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, origin);
      } else {
        console.log('Origin blocked by CORS:', origin);
        // During development/debugging, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error('CORS not allowed'), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Add a health check route for vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    frontendURL: process.env.FRONTEND_URL,
    allowedOrigins: allowedOrigins
  });
});

// Trust proxy in production (important for cookies and HTTPS)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

export default app; // ✅ Vercel needs this instead of server.listen()
