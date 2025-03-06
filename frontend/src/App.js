import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect } from 'react';
import io from "socket.io-client";
import useUserStore from './stores/userStore';
import useSocketStore from './stores/socketStore';
import { BASE_URL } from '.';

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },

])

function App() { 
  const authUser = useUserStore((state) => state.authUser);
  const setOnlineUsers = useUserStore((state) => state.setOnlineUsers);
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(()=>{
    // These dependencies are intentionally omitted as they would cause unnecessary reconnections
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if(authUser){
      const socketio = io(`${BASE_URL}`, {
          query:{
            userId:authUser._id
          }
      });
      setSocket(socketio);

      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        setOnlineUsers(onlineUsers)
      });
      return () => socketio.close();
    }else{
      if(socket){
        socket.close();
        setSocket(null);
      }
    }

  },[authUser]); // Only depend on authUser since that's what determines socket connection

 
// Example API call

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router}/>
    </div>

  );
}

export default App;
