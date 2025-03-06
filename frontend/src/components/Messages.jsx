import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import useMessageStore from '../stores/messageStore';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages(); // Fetch initial messages
    useGetRealTimeMessage(); // Listen for real-time updates
    const messages = useMessageStore((state) => state.messages);

    // Check if messages are loaded
    if (!messages) {
        return <div className="text-center text-gray-500">Loading messages...</div>;
    }

    // Empty state if no messages exist
    if (messages.length === 0) {
        return <div className="text-center text-gray-500">No messages yet</div>;
    }

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {messages.map((message) => (
                <Message key={message._id} message={message} />
            ))}
        </div>
    );
}

export default Messages;
