import Signup from './components/Signup';
import './App.css';
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import useUserStore from './stores/userStore';
import useSocketStore from './stores/socketStore';
import { BASE_URL } from '.';
import toast from "react-hot-toast"; // Add this import

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
    // These dependencies are intentionally omitted as they would cause unnecessary reconnections
    if(authUser){
      const socketio = io(BASE_URL, {
          query:{
            userId: authUser._id
          },
          withCredentials: true,
          path: '/socket.io/' // Make sure path matches server
      });
      setSocket(socketio);

      // Add connection error handling
      socketio.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        toast.error("Connection error. Please refresh the page.");
      });

      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        setOnlineUsers(onlineUsers)
      });

      return () => {
        console.log("Cleaning up socket connection");
        socketio.close();
      };
    } else {
      if(socket){
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]); // Only depend on authUser since that's what determines socket connection

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
