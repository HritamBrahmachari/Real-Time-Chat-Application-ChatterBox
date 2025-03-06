import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';
import useGetOtherUsers from '../hooks/useGetOtherUsers';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const otherUsers = useUserStore((state) => state.otherUsers);
    const setAuthUser = useUserStore((state) => state.setAuthUser);
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const setMessages = useMessageStore((state) => state.setMessages);
    const { searchUsers } = useGetOtherUsers();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('/api/v1/user/logout');
            navigate("/login");
            toast.success(res.data.message);
            setAuthUser(null);
            setMessages(null);
            setOtherUsers(null);
            setSelectedUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        searchUsers(search);
    }

    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className='input input-bordered rounded-md bg-green-950 placeholder:text-white' type="text"
                    placeholder='Search users...'
                />
                <button type='submit' className='btn bg-green-950 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>
            <div className="divider px-3"></div> 
            <OtherUsers/> 
            <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sm bg-green-950 text-green-100'>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar
