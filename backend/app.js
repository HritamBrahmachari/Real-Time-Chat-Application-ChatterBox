import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js";
import connection from "./database/conn.js";
dotenv.config();

// Get the frontend URL from environment variables
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS configuration with multiple allowed origins
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      frontendURL,
      'http://localhost:3000',
      'https://real-time-chat-application-chatter-box.vercel.app',
      'https://chatterbox-frontend.vercel.app',
      'https://stunning-longma-a00b96.netlify.app' // Add your Netlify domain
    ]
  : 'http://localhost:3000';

console.log('CORS allowed origins:', allowedOrigins);

// Configure CORS with improved settings for cross-domain cookies
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (typeof allowedOrigins === 'string') {
      if (origin === allowedOrigins) {
        return callback(null, true);
      }
    } else if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    console.log('Origin blocked by CORS:', origin);
    // During development, allow all origins
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // Critical for cookies
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin']
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add CORS preflight options to handle preflight requests properly
app.options('*', cors(corsOptions));

// Add a health check route for vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    frontendURL: process.env.FRONTEND_URL,
    allowedOrigins: allowedOrigins
  });
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Trust proxy in production (required for secure cookies through a proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Connect to MongoDB
connection();

// Set port
const PORT = process.env.PORT || 5000;

// Export for Vercel
export default app;

// Only listen on the server if not imported by another file
// (prevents double-binding when imported by Vercel)
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Frontend URL: ${frontendURL}`);
  });
}
