import React from 'react'
import OtherUser from './OtherUser';
import useUserStore from '../stores/userStore';


const OtherUsers = () => {
    const otherUsers = useUserStore((state) => state.otherUsers);
    const addedUsers = useUserStore((state) => state.addedUsers);

    const usersToShow = otherUsers?.length ? otherUsers : addedUsers;
    if (!usersToShow?.length) return null;

    return (
        <div className='overflow-auto flex-1'>
            {otherUsers?.length ? (
                <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2 px-2">Search Results</p>
                    {otherUsers.map((user) => (
                        <OtherUser key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-400 mb-2 px-2">Your Chats</p>
                    {addedUsers.map((user) => (
                        <OtherUser key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OtherUsers
