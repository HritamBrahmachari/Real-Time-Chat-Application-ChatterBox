import Message from "./Message";
import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { TiMessages } from "react-icons/ti";

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

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  useListenMessages();
  const lastMessageRef = useRef();
  const messagesContainerRef = useRef();

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messages.length && messagesContainerRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  return (
    <div className="messages-container" ref={messagesContainerRef}>
      {loading ? (
        [...Array(3)].map((_, idx) => (
          <MessageSkeleton key={idx} />
        ))
      ) : selectedConversation?.isSystem ? (
        // ChatterBox System Welcome Message
        <div className="flex flex-col items-center justify-center h-full">
          <div className="welcome-message glass-card-dark p-6 rounded-lg text-center max-w-lg">
            <div className="flex justify-center mb-4">
              <div className="user-avatar-initials bg-gradient-to-r from-primary-600 to-primary-400 w-16 h-16 text-2xl">
                CB
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Welcome to ChatterBox!
            </h2>
            <p className="text-gray-300 mb-4">
              Hi {authUser.fullName}, we're excited to have you here! ChatterBox is a 
              modern messaging platform where you can connect with friends and colleagues.
            </p>
            <div className="space-y-2 text-left text-gray-300 mb-4">
              <p className="flex items-center">
                <span className="bg-primary-600 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">1</span>
                Search for users in the search bar above
              </p>
              <p className="flex items-center">
                <span className="bg-primary-600 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">2</span>
                Click on a user to start a conversation
              </p>
              <p className="flex items-center">
                <span className="bg-primary-600 rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">3</span>
                Your conversation will appear in the sidebar for easy access
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Your messages are secure and end-to-end encrypted
            </p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="welcome-message glass-card-dark p-4 rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <div className="user-avatar-initials">
                {getInitials(selectedConversation?.fullName)}
              </div>
            </div>
            <p className="text-gray-300 mb-2">
              This is the beginning of your conversation with{" "}
              <span className="font-medium text-white">{selectedConversation?.fullName}</span>
            </p>
            <p className="text-sm text-gray-400">Say hello to start the conversation!</p>
          </div>
        </div>
      ) : (
        <>
          {/* System Welcome Message */}
          <div className="message-wrapper justify-center mb-6">
            <div className="system-message p-3 rounded-lg bg-gray-800 bg-opacity-60 text-center">
              <div className="flex justify-center mb-2">
                <TiMessages className="text-xl text-primary-400" />
              </div>
              <p className="text-xs text-gray-300">
                Welcome to your conversation with {selectedConversation?.fullName}
              </p>
            </div>
          </div>

          {/* Regular Messages */}
          {messages.map((message, idx) => {
            const isSender = message.senderId === authUser._id;
            return (
              <div
                key={message._id}
                ref={idx === messages.length - 1 ? lastMessageRef : null}
                className={`message-wrapper ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <div className="user-avatar-initials flex-shrink-0 self-start mt-1">
                    {getInitials(selectedConversation?.fullName)}
                  </div>
                )}
                
                <Message message={message} />
                
                {isSender && (
                  <div className="user-avatar-initials bg-primary-600 flex-shrink-0 self-start mt-1">
                    {getInitials(authUser.fullName)}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

// Placeholder for MessageSkeleton since we can't access it right now
const MessageSkeleton = () => (
  <div className="message-wrapper justify-start mb-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
    <div className="flex flex-col gap-1">
      <div className="h-10 w-52 bg-gray-700 rounded-2xl rounded-tl-none"></div>
      <div className="w-20 h-3 bg-gray-700 rounded-md ml-1"></div>
    </div>
  </div>
);

export default Messages;
