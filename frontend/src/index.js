import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from "react-hot-toast";
import axios from 'axios';

export const BASE_URL="https://backend-real-time-chat-application-chatter-box-te3b.vercel.app/";

// Global axios configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
