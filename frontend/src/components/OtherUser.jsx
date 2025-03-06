import React from 'react'
import useUserStore from '../stores/userStore';

const OtherUser = ({ user }) => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const onlineUsers = useUserStore((state) => state.onlineUsers);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const addedUsers = useUserStore((state) => state.addedUsers);
    const setAddedUsers = useUserStore((state) => state.setAddedUsers);
    
    const isOnline = onlineUsers?.includes(user._id);
    const isAdded = addedUsers?.some(u => u._id === user._id);

    const selectedUserHandler = (user) => {
        if (!isAdded) {
            setAddedUsers([...(addedUsers || []), user]);
        }
        setSelectedUser(user);
    }
    return (
        <>
            <div className={`${selectedUser?._id === user?._id ? 'bg-green-900 text-white' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 ${isAdded ? 'cursor-pointer' : ''}`}>
                <div className={`avatar ${isOnline ? 'online' : '' }`}>
                    <div className='w-12 rounded-full'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2 '>
                        <p className="flex-1">{user?.fullName}</p>
                        {!isAdded && (
                            <button 
                                onClick={() => selectedUserHandler(user)}
                                className="btn btn-xs bg-green-700 text-white hover:bg-green-800"
                            >
                                Chat with
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default OtherUser
