import React from 'react'
import OtherUser from './OtherUser';
import useUserStore from '../stores/userStore';


const OtherUsers = () => {
    const otherUsers = useUserStore((state) => state.otherUsers);
    const addedUsers = useUserStore((state) => state.addedUsers);

    // Ensure both are arrays to prevent map errors
    const safeOtherUsers = Array.isArray(otherUsers) ? otherUsers : [];
    const safeAddedUsers = Array.isArray(addedUsers) ? addedUsers : [];

    // Use the safe arrays
    const hasSearchResults = safeOtherUsers.length > 0;
    const usersToShow = hasSearchResults ? safeOtherUsers : safeAddedUsers;

    if (!usersToShow.length) return null;

    return (
        <div className='overflow-auto flex-1'>
            {hasSearchResults ? (
                <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2 px-2">Search Results</p>
                    {safeOtherUsers.map((user) => (
                        <OtherUser key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-400 mb-2 px-2">Your Chats</p>
                    {safeAddedUsers.map((user) => (
                        <OtherUser key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OtherUsers
