import axios from 'axios';
import toast from 'react-hot-toast';

// Define BASE_URL directly in this file instead of importing it
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://backend-real-time-chat-application-chatter-box-te3b.vercel.app'
  : 'http://localhost:5000';

console.log('API connecting to:', BASE_URL);

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 second timeout

// Add a request interceptor to add token if available
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Extract error message
    const errorMsg = error?.response?.data?.message || 
                    error?.message || 
                    'Network error occurred';
    
    // Network errors and server errors handling
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error(`Network error: ${errorMsg}`);
    } else if (error.response.status === 401) {
      console.error('Authentication Error:', error);
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        toast.error('Authentication expired. Please login again.');
        
        // Clear local storage on auth error
        localStorage.removeItem('auth_token');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else if (error.response.status >= 500) {
      console.error('Server Error:', error);
      toast.error(`Server error: ${errorMsg}`);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios and BASE_URL
export { BASE_URL };
export default axios;
