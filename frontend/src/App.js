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
import { BASE_URL, checkApiHealth, getAuthToken } from './utils/axiosConfig';

// Create AppWrapper to use hooks that require router context
const AppWrapper = () => {
  const location = useLocation();
  const authUser = useUserStore((state) => state.authUser);
  const setOnlineUsers = useUserStore((state) => state.setOnlineUsers);
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const [apiStatus, setApiStatus] = useState({ checked: false, available: false });
  
  // Check API health when app loads
  useEffect(() => {
    const checkBackendHealth = async () => {
      const status = await checkApiHealth();
      setApiStatus({ checked: true, available: status.available });
      
      if (status.available) {
        toast.success("Connected to server successfully!");
      } else {
        toast.error(
          `Cannot connect to server at ${BASE_URL}. Please check your connection.`,
          { duration: 5000, id: "server-error" }
        );
      }
    };
    
    checkBackendHealth();
  }, []);
  
  // Determine if current route is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    if(authUser && apiStatus.available){
      try {
        console.log("Attempting to connect to socket at:", BASE_URL);
        
        // Even simpler socket connection - only essential options
        const socketio = io(BASE_URL, {
          query: {
            userId: authUser._id
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket', 'polling']
        });
        
        socketio.on('connect', () => {
          console.log("Socket connected successfully with ID:", socketio.id);
        });
        
        socketio.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });
        
        socketio.on('getOnlineUsers', (onlineUsers) => {
          console.log("Received online users:", onlineUsers);
          setOnlineUsers(onlineUsers);
        });
        
        setSocket(socketio);
        
        return () => {
          console.log("Cleaning up socket connection");
          socketio.disconnect();
          setSocket(null);
        };
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    } else {
      if(socket){
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser, apiStatus.available]);

  return (
    <div className={`p-4 h-screen flex items-center justify-center ${isAuthPage ? 'auth-page' : 'app-page'}`}>
      {/* Show server status message if backend is not available */}
      {apiStatus.checked && !apiStatus.available && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center">
          Backend server is not available. Please check connection.
        </div>
      )}
      
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
