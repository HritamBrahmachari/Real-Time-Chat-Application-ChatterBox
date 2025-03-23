import React from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/socketContext";

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);
  
  return (
    <div 
      className={`conversation-item ${isSelected ? "conversation-item-active" : ""}`}
      onClick={() => setSelectedConversation(conversation)}
    >
      <div className="relative">
        <div className="user-avatar-initials">
          {getInitials(conversation.fullName)}
        </div>
        {isOnline && (
          <span className="online-indicator"></span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-medium text-white truncate">
            {conversation.fullName}
          </h3>
        </div>
        <p className="text-xs text-gray-400 truncate">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
      
      <div>
        <span className="text-xs text-gray-400">{emoji}</span>
      </div>
    </div>
  );
};

export default Conversation;
