import {Server} from "socket.io";
import http from "http";
import express from "express";
import { User } from "../models/userModel.js";

const app = express();

const server = http.createServer(app);

// Get the frontend URL from environment variables
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

const io = new Server(server, {
    cors:{
        origin: process.env.NODE_ENV === 'production' 
          ? [frontendURL, 'http://localhost:3000']  // Allow both production URL and localhost for testing
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    path: "/socket.io/" // Ensure path is correct
});

console.log('Socket.io CORS origin:', process.env.NODE_ENV === 'production' 
  ? [frontendURL, 'http://localhost:3000'] 
  : 'http://localhost:3000');

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}

io.on('connection', (socket)=>{
    console.log("New socket connection:", socket.id);
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
        
        // Inform the user about their online status
        socket.emit('connectionStatus', { connected: true });
    } 

    // Notify all clients about updated online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle disconnect
    socket.on('disconnect', ()=>{
        console.log("Socket disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, io, server};
