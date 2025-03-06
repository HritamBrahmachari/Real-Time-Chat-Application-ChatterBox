import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from "react-hot-toast";
import './utils/axiosConfig'; // Import axios config

// Define API base URL for other imports
export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://backend-real-time-chat-application-chatter-box-te3b.vercel.app'
  : 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
