import React from 'react'
import useUserStore from '../stores/userStore';

const OtherUser = ({ user }) => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const onlineUsers = useUserStore((state) => state.onlineUsers);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const isOnline = onlineUsers?.includes(user._id);
    const selectedUserHandler = (user) => {
        setSelectedUser(user);
    }
    return (
        <>
            <div onClick={() => selectedUserHandler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-green-900 text-white' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online' : '' }`}>
                    <div className='w-12 rounded-full'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2 '>
                        <p>{user?.fullName}</p>
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default OtherUser
