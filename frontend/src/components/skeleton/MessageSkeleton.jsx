const MessageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Received message skeleton */}
      <div className="flex items-start gap-2.5 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="h-10 w-52 bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-none"></div>
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-md ml-1"></div>
          </div>
        </div>
      </div>

      {/* Sent message skeleton */}
      <div className="flex items-start gap-2.5 justify-end animate-pulse">
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col gap-1 items-end">
            <div className="h-10 w-40 bg-primary-200 dark:bg-primary-800 rounded-2xl rounded-tr-none"></div>
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-md mr-1"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
