import {Server} from "socket.io";
import http from "http";
import express from "express";
import { User } from "../models/userModel.js";

const app = express();
const server = http.createServer(app);

// Get the frontend URL from environment variables with proper verification
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      frontendURL,
      'http://localhost:3000',
      'https://real-time-chat-application-chatter-box.vercel.app',
      // Add any other domains that might connect
      'https://chatterbox-frontend.vercel.app'
    ]
  : 'http://localhost:3000';

console.log('Socket.io allowed origins:', allowedOrigins);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    path: '/socket.io/', // Keep this simple and consistent
    serveClient: false, // Don't serve the client, as we use our own
    pingTimeout: 30000,
    pingInterval: 25000,
    connectTimeout: 20000,
    transports: ['websocket', 'polling'] // Support both WebSocket and polling
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}

io.on('connection', (socket) => {
    console.log("New socket connection:", socket.id, "transport:", socket.conn.transport.name);
    
    const userId = socket.handshake.query.userId;
    if(userId !== undefined) {
        userSocketMap[userId] = socket.id;
        
        // Inform the user about their online status
        socket.emit('connectionStatus', { connected: true });
        
        // Log user connection
        console.log(`User ${userId} connected with socket ${socket.id}`);
    } else {
        console.log("Connection without userId");
    }

    // Notify all clients about updated online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle disconnect
    socket.on('disconnect', (reason) => {
        console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} is now offline`);
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
    
    // Handle errors
    socket.on('error', (error) => {
        console.error(`Socket ${socket.id} error:`, error);
    });
});

export {app, io, server};
