import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import useUserStore from '../stores/userStore';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const setAuthUser = useUserStore((state) => state.setAuthUser);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/user/login', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response?.data) {
        // Backend sends user data directly in response
        setAuthUser(response.data);
        navigate("/");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.log('Login error:', error);
      // Check if error has response and message
      const errorMessage = error?.response?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
    }
    setUser({
      username: "",
      password: ""
    })
  }
  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-green-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-green-900'>
        <h1 className='text-3xl font-bold text-center text-green-800'>ChatterBox</h1>
        <form onSubmit={onSubmitHandler} action="">

          <div>
            <label className='label p-2'>
              <span className='text-base label-text  text-green-900'>Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10 bg-transparent placeholder:text-green-950  text-green-950'
              type="text"
              placeholder='Enter Username' />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text  text-green-900'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10 bg-transparent placeholder:text-green-950  text-green-950'
              type="password"
              placeholder='Password' />
          </div>
          <p className='text-center my-2  text-green-950'>Don't have an account? <Link to="/signup"> signup </Link></p>
          <div>
            <button type="submit" className='btn btn-block btn-sm mt-2 border border-green-900 bg-green-950 text-white'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
