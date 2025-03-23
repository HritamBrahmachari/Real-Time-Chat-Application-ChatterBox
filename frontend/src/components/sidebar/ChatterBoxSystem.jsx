import React from "react";
import useConversation from "../../zustand/useConversation";
import { BsChatDotsFill } from "react-icons/bs";

const ChatterBoxSystem = () => {
  // Create a mock system user object
  const systemUser = {
    _id: "system",
    fullName: "ChatterBox System",
    username: "system",
    profilePic: "",
    isSystem: true
  };

  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === systemUser._id;

  return (
    <div
      className={`conversation-item ${isSelected ? "conversation-item-active" : ""}`}
      onClick={() => setSelectedConversation(systemUser)}
    >
      <div className="relative">
        <div className="user-avatar-initials bg-gradient-to-r from-primary-600 to-primary-400">
          <BsChatDotsFill className="text-white text-sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-medium text-white truncate">
            {systemUser.fullName}
          </h3>
        </div>
        <p className="text-xs text-primary-400 truncate">
          Always Online
        </p>
      </div>
    </div>
  );
};

export default ChatterBoxSystem; 