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

// CORS configuration with dynamic frontend URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [frontendURL, 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('CORS origin:', corsOptions.origin);

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add a health check route for vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    frontendURL: process.env.FRONTEND_URL 
  });
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Connect to MongoDB
connection();

// Set port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${frontendURL}`);
});
