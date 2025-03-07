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

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 15000; // 15 second timeout

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Extract error message
    const errorMsg = error?.response?.data?.message || 
                    error?.message || 
                    'Network error occurred';
    
    // Network errors handling
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error(`Cannot connect to server at ${BASE_URL}. Please check your network connection.`);
    } 
    // Server errors
    else if (error.response.status >= 500) {
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
export { BASE_URL };
export default axios;
