import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import { BiArrowBack, BiMenu } from 'react-icons/bi'

const HomePage = () => {
  const authUser = useUserStore((state) => state.authUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const navigate = useNavigate();
  
  // State to control sidebar visibility on mobile
  const [showSidebar, setShowSidebar] = useState(true);

  // Automatically show message container when a user is selected on mobile
  useEffect(() => {
    if (selectedUser && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, [selectedUser]);
  
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);
  
  // Handle back button on mobile
  const handleBackToContacts = () => {
    setShowSidebar(true);
    if (window.innerWidth < 768) {
      setSelectedUser(null);
    }
  };
  
  return (
    <div className='flex flex-col md:flex-row sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-full max-w-6xl'>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center bg-green-950 text-white px-4 py-3">
        {!showSidebar && selectedUser ? (
          <button onClick={handleBackToContacts} className="mr-3">
            <BiArrowBack size={24} />
          </button>
        ) : (
          <BiMenu size={24} className="mr-3" />
        )}
        <h1 className="font-bold text-xl">
          {!showSidebar && selectedUser ? selectedUser.fullName : 'ChatterBox'}
        </h1>
      </div>
      
      {/* Responsive Layout */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-1/3 lg:w-1/4 h-full`}>
        <Sidebar />
      </div>
      
      <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 h-full`}>
        <MessageContainer onBackClick={handleBackToContacts} />
      </div>
    </div>
  )
}

export default HomePage
