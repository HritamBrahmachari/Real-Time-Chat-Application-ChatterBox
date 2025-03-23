import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import useConversation from "../../zustand/useConversation";
import { formatTime } from "../../utils/helpers";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const isSender = message.senderId === authUser._id;
  const shakeClass = message.shouldShake ? "shake" : "";
  
  // Get message content, handling both formats
  const messageContent = message.text || message.message || "";
  
  // Format time
  const formattedTime = formatTime(message.createdAt);
  
  return (
    <div className={`message ${isSender ? "message-sent" : "message-received"} ${shakeClass}`}>
      <div className="message-text">{messageContent}</div>
      <div className="message-time">{formattedTime}</div>
    </div>
  );
};

export default Message;
