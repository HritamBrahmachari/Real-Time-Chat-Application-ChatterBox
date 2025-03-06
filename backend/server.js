import app from './index.js';
import { server as socketServer } from './socket/socket.js';

// Get the port from environment or use default
const PORT = process.env.PORT || 5000;

// Start the server if not being imported as a module by Vercel
if (process.env.NODE_ENV === 'production') {
  // In production, just export the app for Vercel serverless functions
  console.log('Running in production mode - Vercel will handle the server');
} else {
  // In development, start the server locally
  socketServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;