import axios from 'axios';
import toast from 'react-hot-toast';

// Define BASE_URL to support both local and production environments
const PRODUCTION_BACKEND_URL = 'https://messaging-app-1-4gsh.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:5000';

// Choose the backend URL based on environment or override with env variable
const BASE_URL = process.env.REACT_APP_API_URL || 
                (process.env.NODE_ENV === 'production' 
                  ? PRODUCTION_BACKEND_URL 
                  : LOCAL_BACKEND_URL);

console.log('API connecting to:', BASE_URL);

// Track if we're in incognito mode (approximate detection)
const detectIncognito = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return false;
  } catch (e) {
    return true;
  }
};

const isLikelyIncognito = detectIncognito();
console.log(`Browser appears to be in ${isLikelyIncognito ? 'incognito' : 'normal'} mode`);

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000; // 15 second timeout

// Helper to get token from storage (supports both storage types)
const getAuthToken = () => {
  return localStorage.getItem('auth_token') || '';
};

// Add a request interceptor to add token if available
axios.interceptors.request.use(
  config => {
    // Always include the token in the Authorization header if available
    const token = getAuthToken();
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

// Counter to prevent multiple auth warnings
let authWarningShown = 0;

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
      toast.error(`Cannot connect to server at ${BASE_URL}. Please check your network connection.`);
    } else if (error.response.status === 401) {
      console.error('Authentication Error:', error);
      
      // Only redirect if not already on login page and not showing too many warnings
      if (window.location.pathname !== '/login' && authWarningShown < 1) {
        authWarningShown++;
        toast.error('Authentication expired. Please login again.');
        
        // Clear token
        localStorage.removeItem('auth_token');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
          authWarningShown = 0; // Reset after redirect
        }, 1000);
      }
    } else if (error.response.status >= 500) {
      console.error('Server Error:', error);
      toast.error(`Server error: ${errorMsg}`);
    }
    
    return Promise.reject(error);
  }
);

// Function to check if the API is available
export const checkApiHealth = async () => {
  try {
    const response = await axios.get('/api/health', { timeout: 5000 });
    console.log('API health check:', response.data);
    return { available: true, data: response.data };
  } catch (error) {
    console.error('API health check failed:', error);
    return { available: false, error };
  }
};

// Export useful functions and variables
export { BASE_URL, isLikelyIncognito, getAuthToken };
export default axios;
