import { useEffect } from "react";
import useSocketStore from "../stores/socketStore";
import useMessageStore from "../stores/messageStore";
import useUserStore from "../stores/userStore";
import axios from "axios";

const useGetRealTimeMessage = () => {
    const socket = useSocketStore((state) => state.socket);
    const setMessages = useMessageStore((state) => state.setMessages);
    const messages = useMessageStore((state) => state.messages);
    const authUser = useUserStore((state) => state.authUser);
    const addedUsers = useUserStore((state) => state.addedUsers);
    const setAddedUsers = useUserStore((state) => state.setAddedUsers);
    const selectedUser = useUserStore((state) => state.selectedUser);
    const setSelectedUser = useUserStore((state) => state.setSelectedUser);

    useEffect(() => {
        if (!socket || !authUser) return;

        const handleNewMessage = async (newMessage) => {
            // Ensure addedUsers is always an array
            const safeAddedUsers = Array.isArray(addedUsers) ? addedUsers : [];
            
            // Determine if message is from a new user
            const isNewSender = newMessage.senderId !== authUser._id && 
                               !safeAddedUsers.some(u => u._id === newMessage.senderId);
            
            // If it's a new sender, fetch their user information first
            if (isNewSender) {
                try {
                    const res = await axios.get(`/api/v1/user/${newMessage.senderId}`);
                    if (res.data) {
                        const newUser = res.data;
                        // Add user to the addedUsers list (ensuring it's an array)
                        setAddedUsers([...safeAddedUsers, newUser]);
                        
                        // If no user is currently selected, select this new user
                        if (!selectedUser) {
                            setSelectedUser(newUser);
                        }
                        
                        // Fetch the conversation with this user to get all messages
                        const msgRes = await axios.get(`/api/v1/message/${newUser._id}`);
                        if (msgRes.data) {
                            setMessages(msgRes.data);
                            return; // Skip the regular message adding since we've loaded the full conversation
                        }
                    }
                } catch (error) {
                    console.error("Error fetching new user data:", error);
                }
            }
            
            // Update messages (only if we didn't load the full conversation above)
            if ((!isNewSender || !selectedUser) && 
                (selectedUser?._id === newMessage.senderId || selectedUser?._id === newMessage.receiverId)) {
                if (!Array.isArray(messages)) {
                    setMessages([newMessage]);
                } else {
                    const isDuplicate = messages.some(msg => msg._id === newMessage._id);
                    if (!isDuplicate) {
                        setMessages([...messages, newMessage]);
                    }
                }
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, setMessages, messages, authUser, addedUsers, setAddedUsers, selectedUser, setSelectedUser]);
};

export default useGetRealTimeMessage;
