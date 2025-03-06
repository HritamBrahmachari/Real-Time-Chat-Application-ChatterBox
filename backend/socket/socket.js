import {Server} from "socket.io";
import http from "http";
import express from "express";
import { User } from "../models/userModel.js";

const app = express();
const server = http.createServer(app);

// Match this with the frontend URL - keep it simple and direct
const FRONTEND_URL = "https://real-time-chat-application-chatter-box.vercel.app";

console.log('Socket.io allowing origin:', FRONTEND_URL);

// Configure socket.io with explicit CORS settings
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    },
    path: '/socket.io/',
    serveClient: false,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
    transports: ['websocket', 'polling']
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
