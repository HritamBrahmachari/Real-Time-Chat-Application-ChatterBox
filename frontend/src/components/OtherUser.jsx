import React from 'react'
import useUserStore from '../stores/userStore';

const OtherUser = ({ user }) => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const onlineUsers = useUserStore((state) => state.onlineUsers);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const addedUsers = useUserStore((state) => state.addedUsers);
    const setAddedUsers = useUserStore((state) => state.setAddedUsers);
    
    // Make sure addedUsers is an array before checking
    const safeAddedUsers = Array.isArray(addedUsers) ? addedUsers : [];
    
    const isOnline = Array.isArray(onlineUsers) && onlineUsers?.includes(user._id);
    const isAdded = safeAddedUsers.some(u => u._id === user._id);

    const selectedUserHandler = (user) => {
        if (!isAdded) {
            setAddedUsers([...safeAddedUsers, user]);
        }
        setSelectedUser(user);
    }
    
    return (
        <>
            <div 
                onClick={() => isAdded ? selectedUserHandler(user) : null}
                className={`${selectedUser?._id === user?._id ? 'bg-green-900 text-white' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-1.5 md:p-2 ${isAdded ? 'cursor-pointer' : ''}`}
            >
                <div className={`avatar ${isOnline ? 'online' : '' }`}>
                    <div className='w-10 md:w-12 rounded-full'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1 overflow-hidden'>
                    <div className='flex justify-between gap-1 md:gap-2'>
                        <p className="flex-1 truncate text-sm md:text-base">{user?.fullName}</p>
                        {!isAdded && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectedUserHandler(user);
                                }}
                                className="btn btn-xs bg-green-700 text-white hover:bg-green-800"
                            >
                                Add
                            </button>
                        )}
                    </div>
                    {isAdded && (
                        <p className="text-xs text-gray-400 truncate">Click to chat</p>
                    )}
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default OtherUser
