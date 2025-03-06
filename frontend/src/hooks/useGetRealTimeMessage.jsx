import { useEffect } from "react";
import useSocketStore from "../stores/socketStore";
import useMessageStore from "../stores/messageStore";

const useGetRealTimeMessage = () => {
    const socket = useSocketStore((state) => state.socket);
    const messages = useMessageStore((state) => state.messages);
    const setMessages = useMessageStore((state) => state.setMessages);
    useEffect(()=>{
        socket?.on("newMessage", (newMessage)=>{
            setMessages([...messages, newMessage]);
        });
        return () => socket?.off("newMessage");
    },[socket, messages, setMessages]);
};
export default useGetRealTimeMessage;
