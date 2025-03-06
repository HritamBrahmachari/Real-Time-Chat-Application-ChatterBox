import React, { useEffect, useRef } from 'react';
import useUserStore from '../stores/userStore';

const Message = ({ message }) => {
    const scroll = useRef();
    const authUser = useUserStore((state) => state.authUser);
    const selectedUser = useUserStore((state) => state.selectedUser);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // Assuming message.createdAt is already coming from the backend (database)
    const timestamp = message?.createdAt ? new Date(message?.createdAt) : new Date();

    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img 
                        alt="User Avatar" 
                        src={message?.senderId === authUser?._id 
                            ? authUser?.profilePhoto 
                            : selectedUser?.profilePhoto} 
                    />
                </div>
            </div>
            <div className="chat-header">
                {/* Display timestamp only for this message */}
                <time className="text-xs opacity-50 text-white">
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-green-900 text-white' : ''}`}>
                {/* Display text message */}
                {message?.message && <p>{message?.message}</p>}

            
            </div>
        </div>
    );
};

export default Message;
