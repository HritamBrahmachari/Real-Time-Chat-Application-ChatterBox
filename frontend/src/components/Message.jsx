import React, { useEffect, useRef } from 'react';
import useUserStore from '../stores/userStore';

const Message = ({ message }) => {
    const scroll = useRef();
    const authUser = useUserStore((state) => state.authUser);
    const selectedUser = useUserStore((state) => state.selectedUser);
    const addedUsers = useUserStore((state) => state.addedUsers);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // Determine if message is from the auth user
    const isFromAuthUser = message?.senderId === authUser?._id;
    
    // Find the correct avatar to display
    let avatarUrl = null;
    if (isFromAuthUser) {
        avatarUrl = authUser?.profilePhoto;
    } else if (selectedUser?.isSystemUser) {
        avatarUrl = "https://avatar.iran.liara.run/public/boy?username=system";
    } else if (selectedUser) {
        avatarUrl = selectedUser?.profilePhoto;
    } else if (message.senderInfo?.profilePhoto) {
        // Use sender info if available (for new conversations)
        avatarUrl = message.senderInfo.profilePhoto;
    }

    // Assuming message.createdAt is already coming from the backend (database)
    const timestamp = message?.createdAt ? new Date(message?.createdAt) : new Date();

    return (
        <div ref={scroll} className={`chat ${isFromAuthUser ? 'chat-end' : 'chat-start'} py-1`}>
            <div className="chat-image avatar">
                <div className="w-8 md:w-10 rounded-full">
                    <img 
                        alt="User Avatar" 
                        src={avatarUrl || "https://via.placeholder.com/40"} 
                    />
                </div>
            </div>
            <div className="chat-header">
                {/* Display timestamp only for this message */}
                <time className="text-xs opacity-50 text-white">
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble text-sm md:text-base ${isFromAuthUser ? '' : 'bg-green-900 text-white'}`}>
                {/* Display text message */}
                {message?.message && <p>{message?.message}</p>}
            </div>
        </div>
    );
};

export default Message;
