import React, { useState, useEffect } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import useSocketStore from '../stores/socketStore';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const authUser = useUserStore((state) => state.authUser);
    const otherUsers = useUserStore((state) => state.otherUsers);
    const setAuthUser = useUserStore((state) => state.setAuthUser);
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const setMessages = useMessageStore((state) => state.setMessages);
    const addedUsers = useUserStore((state) => state.addedUsers);
    const setAddedUsers = useUserStore((state) => state.setAddedUsers);
    const socket = useSocketStore((state) => state.socket);
    const setSocket = useSocketStore((state) => state.setSocket);
    const { searchUsers } = useGetOtherUsers();
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);

    const navigate = useNavigate();
    
    // Fetch recent conversations when component mounts or when user changes
    useEffect(() => {
        if (authUser && authUser._id) {
            fetchRecentConversations();
        }
    }, [authUser?._id]);
    
    const fetchRecentConversations = async () => {
        if (!authUser || !authUser._id || isLoadingConversations) {
            return;
        }
        
        try {
            setIsLoadingConversations(true);
            console.log("Fetching recent conversations for user:", authUser._id);
            
            const response = await axios.get(`/api/v1/message/conversations/recent?userId=${authUser._id}`);
            
            if (response.data) {
                const conversations = Array.isArray(response.data) ? response.data : [];
                console.log(`Fetched ${conversations.length} recent conversations`);
                setAddedUsers(conversations);
            }
        } catch (error) {
            console.error("Failed to fetch recent conversations:", error);
            toast.error("Could not load your recent chats");
        } finally {
            setIsLoadingConversations(false);
        }
    };

    const logoutHandler = async () => {
        try {
            // Close socket
            if (socket) {
                socket.close();
                setSocket(null);
            }
            
            // Clear all state
            setAuthUser(null);
            setMessages([]);
            setOtherUsers(null);
            setSelectedUser(null);
            setAddedUsers([]);
            
            try {
                // Simple logout without auth requirements
                await axios.get('/api/v1/user/logout');
            } catch (error) {
                // Ignore errors during logout
            }
            
            toast.success("Logged out successfully");
            navigate("/login");
            
            // Clear localStorage for good measure
            localStorage.clear();
        } catch (error) {
            toast.error("Error logging out.");
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        searchUsers(search);
    }

    return (
        <div className='w-full border-r border-slate-500 p-3 md:p-4 flex flex-col h-full'>
            {authUser && (
                <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
                    <input
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className='input input-bordered rounded-md bg-green-950 placeholder:text-white text-sm w-full' 
                        type="text"
                        placeholder='Search users...'
                    />
                    <button type='submit' className='btn btn-sm md:btn-md bg-green-950 text-white'>
                        <BiSearchAlt2 className='w-5 h-5 outline-none'/>
                    </button>
                </form>
            )}
            
            <div className="divider px-3 my-1"></div> 
            
            {/* Make this div scrollable with flex-1 */}
            <div className="flex-1 overflow-auto">
                {isLoadingConversations ? (
                    <div className="text-center py-4 text-gray-400">Loading chats...</div>
                ) : (
                    <OtherUsers />
                )}
            </div>
            
            {/* Keep logout button at bottom */}
            {authUser && (
                <div className='mt-auto pt-2'>
                    <button onClick={logoutHandler} className='btn btn-sm bg-green-950 text-green-100 w-full'>
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default Sidebar
