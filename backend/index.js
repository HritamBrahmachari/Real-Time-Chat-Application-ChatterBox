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
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      frontendURL,
      'http://localhost:3000',
      'https://real-time-chat-application-chatter-box.vercel.app',
      'https://chatterbox-frontend.vercel.app'
    ]
  : 'http://localhost:3000';

console.log('CORS allowed origins:', allowedOrigins);

app.use(
  cors({
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
      return callback(null, true); // Temporarily allow all origins during debugging
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ['Access-Control-Allow-Origin']
  })
);

// Add CORS preflight options to handle preflight requests properly
app.options('*', cors());

// Add a health check route for vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    frontendURL: process.env.FRONTEND_URL,
    allowedOrigins: allowedOrigins
  });
});

// Trust proxy in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

export default app; // ✅ Vercel needs this instead of server.listen()
