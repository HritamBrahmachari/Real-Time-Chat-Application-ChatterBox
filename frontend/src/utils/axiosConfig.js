import axios from 'axios';

// Define BASE_URL directly in this file instead of importing it
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://backend-real-time-chat-application-chatter-box-te3b.vercel.app'
  : 'http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

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
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // If we get a 401, we might want to redirect to login
      if (window.location.pathname !== '/login') {
        // Could redirect here if needed
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured axios and BASE_URL
export { BASE_URL };
export default axios;
