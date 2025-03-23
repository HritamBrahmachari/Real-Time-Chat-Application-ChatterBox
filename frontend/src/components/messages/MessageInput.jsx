import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { IoAttach } from "react-icons/io5";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="message-input-container">
        <button 
          type="button" 
          className="btn-icon"
        >
          <BsEmojiSmile />
        </button>
        <button 
          type="button" 
          className="btn-icon"
        >
          <IoAttach />
        </button>
        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="message-send-button"
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <IoSend />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
