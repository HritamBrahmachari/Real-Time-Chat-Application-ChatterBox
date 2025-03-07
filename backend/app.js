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
      'https://stunning-longma-a00b96.netlify.app'
    ]
  : 'http://localhost:3000';

console.log('CORS allowed origins:', allowedOrigins);

// Simplified CORS configuration
const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 10000
  });
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Connect to MongoDB
connection();

// Set port and host for binding
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0'; // Bind to all network interfaces

// Export for Vercel
export default app;

// Only listen on the server if not imported by another file
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}
