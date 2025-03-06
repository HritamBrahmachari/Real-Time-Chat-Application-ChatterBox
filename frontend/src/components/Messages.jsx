import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useMessageStore from '../stores/messageStore';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import useUserStore from '../stores/userStore';

const Messages = () => {
    const messages = useMessageStore((state) => state.messages);
    const selectedUser = useUserStore((state) => state.selectedUser);
    const authUser = useUserStore((state) => state.authUser);
    const messagesEndRef = useRef(null);
    
    useGetMessages(); // Fetch initial messages
    useGetRealTimeMessage(); // Listen for real-time updates

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Check if user is loaded
    if (!authUser) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    // Check if messages are loaded
    if (!messages && (selectedUser || !authUser.hasSeenWelcome)) {
        return <div className="text-center text-gray-500">Loading messages...</div>;
    }

    return (
        <div className='flex flex-col h-full'>
            <div className="p-2 md:p-4 border-b border-green-800">
                <h2 className="text-lg md:text-xl font-semibold text-green-100">
                    {selectedUser ? selectedUser.fullName : 'Welcome Messages'}
                </h2>
            </div>
            <div className='px-2 md:px-4 flex-1 overflow-auto'>
                {messages?.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        {selectedUser ? 'No messages yet' : 'No welcome messages'}
                    </div>
                ) : (
                    <>
                        {messages?.map((message) => (
                            <Message key={message._id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Messages;
