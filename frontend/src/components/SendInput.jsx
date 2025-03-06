import React, {useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const selectedUser = useUserStore((state) => state.selectedUser);
    const messages = useMessageStore((state) => state.messages);
    const setMessages = useMessageStore((state) => state.setMessages);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, {message}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            setMessages([...messages, res?.data?.newMessage])
        } catch (error) {
            console.log(error);
        } 
        setMessage("");
    }
    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='border text-sm rounded-lg block w-full p-3 border-green-500 bg-green-950 text-white'
                />
                <button type="submit" className='absolute flex inset-y-0 end-0 items-center pr-4'>
                    <IoSend />
                </button>
            </div>
        </form>
    )
}

export default SendInput
