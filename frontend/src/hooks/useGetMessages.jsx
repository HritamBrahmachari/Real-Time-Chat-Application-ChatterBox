import { useEffect } from 'react'
import axios from "axios";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';

const useGetMessages = () => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const setMessages = useMessageStore((state) => state.setMessages);
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/v1/message/${selectedUser?._id}`);
                setMessages(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [selectedUser?._id, setMessages]);
}

export default useGetMessages
