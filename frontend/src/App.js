import Signup from './components/Signup';
import './App.css';
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import useUserStore from './stores/userStore';
import useSocketStore from './stores/socketStore';
import toast from "react-hot-toast";
import { BASE_URL } from './utils/axiosConfig';

// Create AppWrapper to use hooks that require router context
const AppWrapper = () => {
  const location = useLocation();
  const authUser = useUserStore((state) => state.authUser);
  const setOnlineUsers = useUserStore((state) => state.setOnlineUsers);
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  
  // Determine if current route is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    if(authUser){
      // Use try/catch to handle connection issues
      try {
        console.log("Attempting to connect to socket at:", BASE_URL);
        
        const socketio = io(BASE_URL, {
          query: {
            userId: authUser._id
          },
          withCredentials: true,
          path: "/socket.io/",
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          transports: ['websocket', 'polling'],
          autoConnect: false, // Don't connect automatically
          forceNew: true, // Force a new connection
          closeOnBeforeunload: true // Close connection when page is closed
        });

        // Set up event handlers
        socketio.on('connect', () => {
          console.log("Socket connected successfully with ID:", socketio.id);
          toast.success("Connected to chat server!");
        });

        socketio.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
          toast.error(`Connection error: ${err.message}. Retrying...`);
        });

        socketio.on('connect_timeout', () => {
          console.error('Socket connection timeout');
          toast.error('Connection timeout. Please check your network.');
        });

        socketio.on('error', (error) => {
          console.error('Socket error:', error);
          toast.error('Socket error occurred');
        });

        socketio.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            toast.error('Disconnected from server. Reconnecting...');
            socketio.connect();
          }
        });

        socketio.on('getOnlineUsers', (onlineUsers) => {
          console.log("Received online users:", onlineUsers);
          setOnlineUsers(onlineUsers);
        });

        // Now connect
        socketio.connect();
        
        setSocket(socketio);
        
        return () => {
          console.log("Cleaning up socket connection");
          socketio.disconnect();
          setSocket(null);
        };
      } catch (error) {
        console.error("Socket initialization error:", error);
        toast.error("Failed to connect to chat server");
      }
    } else {
      if(socket){
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <div className={`p-4 h-screen flex items-center justify-center ${isAuthPage ? 'auth-page' : 'app-page'}`}>
      {location.pathname === '/' && <HomePage />}
      {location.pathname === '/signup' && <Signup />}
      {location.pathname === '/login' && <Login />}
    </div>
  );
};

// Set up router
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
  },
  {
    path: "/signup",
    element: <AppWrapper />,
  },
  {
    path: "/login",
    element: <AppWrapper />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
