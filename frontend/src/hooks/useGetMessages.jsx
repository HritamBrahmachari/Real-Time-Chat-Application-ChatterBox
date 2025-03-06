import { useEffect } from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import useUserStore from '../stores/userStore';
import useMessageStore from '../stores/messageStore';

const useGetMessages = () => {
    const selectedUser = useUserStore((state) => state.selectedUser);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);
    const setMessages = useMessageStore((state) => state.setMessages);
    const authUser = useUserStore((state) => state.authUser);

    useEffect(() => {
        // Don't fetch messages if user is not authenticated
        if (!authUser) return;

        const fetchMessages = async () => {
            try {
                if (selectedUser?._id) {
                    // Fetch chat messages when a user is selected
                    const res = await axios.get(`/api/v1/message/${selectedUser._id}`);
                    setMessages(res.data || []);
                } else if (!authUser?.hasSeenWelcome) {
                    // Fetch system messages when user hasn't seen welcome message
                    const res = await axios.get('/api/v1/message/system');
                    setMessages(res.data.messages || []);
                    if (res.data.systemUser) {
                        setSelectedUser(res.data.systemUser);
                    }
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
                
                // Only show authentication error if user is still logged in
                if (error.response?.status === 401 && authUser) {
                    toast.error("Please log in again");
                }
            }
        }
        fetchMessages();
    }, [selectedUser?._id, setMessages, authUser, setSelectedUser]);
}

export default useGetMessages
