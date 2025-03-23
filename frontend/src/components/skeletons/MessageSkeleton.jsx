const MessageSkeleton = () => {
  return (
    <div className="py-2">
      {/* Received message skeleton */}
      <div className="message-wrapper justify-start mb-4 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="h-10 w-52 bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-none"></div>
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-md ml-1"></div>
        </div>
      </div>

      {/* Sent message skeleton */}
      <div className="message-wrapper justify-end animate-pulse">
        <div className="flex flex-col items-end gap-1">
          <div className="h-10 w-40 bg-primary-200 dark:bg-primary-800 rounded-2xl rounded-tr-none"></div>
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-md mr-1"></div>
        </div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton; 