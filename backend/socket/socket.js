import {Server} from "socket.io";
import http from "http";
import express from "express";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);

// Define frontend URLs for simpler CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Configure socket.io with simplified settings
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ['GET', 'POST'],
        credentials: true
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}

io.on('connection', (socket) => {
    console.log("New socket connection:", socket.id);
    
    const userId = socket.handshake.query.userId;
    
    // Only add valid MongoDB ObjectIds to the userSocketMap
    if(userId && mongoose.Types.ObjectId.isValid(userId)) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
    } else {
        console.log(`Socket ${socket.id} connected without valid userId`);
    }

    // Notify all clients about updated online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            delete userSocketMap[userId];
            console.log(`User ${userId} is now offline`);
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
});

export {app, io, server};
