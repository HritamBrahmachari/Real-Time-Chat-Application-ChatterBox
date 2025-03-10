import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import useUserStore from '../stores/userStore';
import { FiUser, FiLock, FiMessageCircle } from 'react-icons/fi';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const setAuthUser = useUserStore((state) => state.setAuthUser);
  const setAddedUsers = useUserStore((state) => state.setAddedUsers);
  const navigate = useNavigate();

  const fetchRecentConversations = async (userId) => {
    if (!userId) return;
    
    try {
      console.log("Fetching recent conversations during login for user:", userId);
      const response = await axios.get(`/api/v1/message/conversations/recent?userId=${userId}`);
      
      if (response.data) {
        const conversations = Array.isArray(response.data) ? response.data : [];
        console.log(`Fetched ${conversations.length} recent conversations during login`);
        setAddedUsers(conversations);
      }
    } catch (error) {
      console.error("Failed to fetch recent conversations during login:", error);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Simple login request - no authentication handling
      const response = await axios.post('/api/v1/user/login', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response?.data && response.data._id) {
        // Store user in zustand state
        setAuthUser(response.data);
        
        // Fetch recent conversations after login with the user ID
        await fetchRecentConversations(response.data._id);
        
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.log('Login error:', error);
      // Check if error has response and message
      const errorMessage = error?.response?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setUser({
        username: "",
        password: ""
      });
    }
  }
  
  return (
    <div className="w-11/12 max-w-md mx-auto">
      <div className="auth-card p-6 md:p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-500 p-3 rounded-full">
            <FiMessageCircle className="text-white text-2xl" />
          </div>
        </div>
        
        <h1 className='text-3xl font-bold text-center auth-text mb-1 font-[Poppins]'>Welcome Back</h1>
        <p className="auth-text-muted text-center text-sm mb-6">Sign in to continue to ChatterBox</p>
        
        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className='block text-sm font-medium auth-text mb-1'>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-green-300" />
              </div>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className='w-full pl-10 px-4 py-2.5 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                type="text"
                placeholder='Enter your username'
              />
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-medium auth-text mb-1'>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-green-300" />
              </div>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className='w-full pl-10 px-4 py-2.5 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                type="password"
                placeholder='Enter your password'
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg auth-button text-white font-medium text-base shadow-md flex items-center justify-center 
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : "Sign In"}
          </button>
          
          <div className="text-center">
            <p className='auth-text-muted text-sm'>
              Don't have an account? 
              <Link to="/signup" className="font-medium ml-1 text-green-300 hover:text-green-200 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
