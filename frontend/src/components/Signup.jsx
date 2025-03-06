import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiType, FiMessageCircle } from 'react-icons/fi';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      // Clear any existing data
      localStorage.clear();
      
      const res = await axios.post('/api/v1/user/register', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setIsLoading(false);
      setUser({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
      });
    }
  }
  
  return (
    <div className="w-11/12 max-w-md mx-auto">
      <div className="auth-card p-5 md:p-7">
        {/* More compact header */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-500 p-2.5 rounded-full">
            <FiMessageCircle className="text-white text-xl" />
          </div>
        </div>
        
        <h1 className='text-2xl font-bold text-center auth-text mb-1 font-[Poppins]'>Create Account</h1>
        <p className="auth-text-muted text-center text-xs mb-4">Get started with ChatterBox</p>
        
        <form onSubmit={onSubmitHandler} className="space-y-3">
          {/* Inputs with reduced padding */}
          <div>
            <label className='block text-sm font-medium auth-text mb-1'>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiType className="text-green-300" />
              </div>
              <input
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className='w-full pl-10 px-4 py-2 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                type="text"
                placeholder='Enter your full name'
              />
            </div>
          </div>
          
          {/* Username */}
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
                className='w-full pl-10 px-4 py-2 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                type="text"
                placeholder='Choose a username'
              />
            </div>
          </div>
          
          {/* Password and Confirm Password in flex layout for larger screens */}
          <div className="md:flex gap-3">
            {/* Password */}
            <div className="flex-1 mb-3 md:mb-0">
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
                  className='w-full pl-10 px-4 py-2 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                  type="password"
                  placeholder='Create a password'
                />
              </div>
            </div>
            
            {/* Confirm Password */}
            <div className="flex-1">
              <label className='block text-sm font-medium auth-text mb-1'>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-green-300" />
                </div>
                <input
                  value={user.confirmPassword}
                  onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                  className='w-full pl-10 px-4 py-2 rounded-lg auth-input focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
                  type="password"
                  placeholder='Confirm password'
                />
              </div>
            </div>
          </div>
          
          {/* Gender Selection - more compact */}
          <div>
            <label className='block text-sm font-medium auth-text mb-1.5'>
              Gender
            </label>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center">
                <input
                  id="male"
                  type="radio"
                  checked={user.gender === "male"}
                  onChange={() => handleCheckbox("male")}
                  className="h-4 w-4 text-green-500 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                />
                <label htmlFor="male" className="ml-2 block text-sm auth-text">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="female"
                  type="radio"
                  checked={user.gender === "female"}
                  onChange={() => handleCheckbox("female")}
                  className="h-4 w-4 text-green-500 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                />
                <label htmlFor="female" className="ml-2 block text-sm auth-text">
                  Female
                </label>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 rounded-lg auth-button text-white font-medium text-base shadow-md flex items-center justify-center mt-3
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : "Create Account"}
          </button>
          
          {/* Login Link */}
          <div className="text-center mt-3">
            <p className='auth-text-muted text-sm'>
              Already have an account? 
              <Link to="/login" className="font-medium ml-1 text-green-300 hover:text-green-200 underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
