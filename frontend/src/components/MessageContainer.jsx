import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import useUserStore from '../stores/userStore';

const MessageContainer = ({ onBackClick }) => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const authUser = useUserStore((state) => state.authUser);
    const onlineUsers = useUserStore((state) => state.onlineUsers);

    const isOnline = onlineUsers?.includes(selectedUser?._id);
   
    return (
        <div className='w-full flex flex-col h-full'>
            {selectedUser ? (
                <>
                    {/* Header is hidden on mobile as it's handled in HomePage */}
                    <div className='hidden md:flex gap-2 items-center bg-green-950 text-white px-4 py-2 mb-2'>
                        <div className={`avatar ${isOnline && !selectedUser.isSystemUser ? 'online' : ''}`}>
                            <div className='w-12 rounded-full'>
                                <img src={selectedUser?.profilePhoto} alt="user-profile" />
                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='flex justify-between gap-2'>
                                <p>{selectedUser?.fullName}</p>
                            </div>
                            {selectedUser.isSystemUser && (
                                <p className='text-sm text-gray-300'>System Messages</p>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Messages />
                    </div>
                    <SendInput />
                </>
            ) : (!authUser?.hasSeenWelcome ? (
                <div className='flex flex-col h-full'>
                    <div className='hidden md:flex gap-2 items-center bg-green-950 text-white px-4 py-2 mb-2'>
                        <div className='flex flex-col flex-1'>
                            <h2 className='text-xl font-semibold'>Welcome to ChatterBox</h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Messages />
                    </div>
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center h-full'>
                    <h1 className='text-2xl md:text-4xl text-white font-bold'>Hi, {authUser?.fullName}</h1>
                    <h2 className='text-lg md:text-2xl text-white mt-2 text-center px-4'>
                        Search for users to start chatting
                    </h2>
                </div>
            ))}
        </div>
    )
}

export default MessageContainer
