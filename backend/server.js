import app from './index.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define frontend URLs for both environments
const PRODUCTION_FRONTEND_URL = "https://stunning-longma-a00b96.netlify.app";
const LOCAL_FRONTEND_URL = "http://localhost:3000";

// Create HTTP server
const server = http.createServer(app);

// Track user socket connections
const userSocketMap = {};

// Configure socket.io for the server
const io = new Server(server, {
  cors: {
    origin: [PRODUCTION_FRONTEND_URL, LOCAL_FRONTEND_URL],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Setup socket connection handler
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  // Get user ID from query params - simplified approach
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Store user's socket id mapping
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
    
    // Send online users list to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  }
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    
    // Remove from user mapping
    for (const [user, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[user];
        console.log(`User ${user} disconnected`);
        break;
      }
    }
    
    // Update online users list
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Function to get a receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Get port from environment or use default (10000 for Render)
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0'; // Bind to all network interfaces

// Start the server with proper binding
server.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Production frontend: ${PRODUCTION_FRONTEND_URL}`);
  console.log(`Local frontend: ${LOCAL_FRONTEND_URL}`);
});

// Export server, io and userSocketMap for use in other files
export { server, io, userSocketMap };
export default server;