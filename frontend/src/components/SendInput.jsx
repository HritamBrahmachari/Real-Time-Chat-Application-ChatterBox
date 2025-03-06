import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const selectedUser = useUserStore((state) => state.selectedUser);
    const messages = useMessageStore((state) => state.messages);
    const setMessages = useMessageStore((state) => state.setMessages);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() || sending) return;

        try {
            setSending(true);
            const res = await axios.post(`/api/v1/message/send/${selectedUser?._id}`, 
                { message: message.trim() },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (res?.data?.newMessage) {
                setMessages([...messages, res.data.newMessage]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setSending(false);
            setMessage("");
        }
    }

    // Don't show input if no user is selected or if it's the system user
    if (!selectedUser || selectedUser.isSystemUser) {
        return null;
    }

    return (
        <form onSubmit={onSubmitHandler} className='px-2 md:px-4 py-2 md:py-3'>
            <div className='w-full relative'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Type your message...'
                    className='border text-sm rounded-lg block w-full p-2.5 border-green-500 bg-green-950 text-white'
                />
                <button 
                    type="submit" 
                    disabled={!message.trim() || sending}
                    className='absolute flex inset-y-0 end-0 items-center pr-4 disabled:opacity-50'
                >
                    <IoSend />
                </button>
            </div>
        </form>
    )
}

export default SendInput
