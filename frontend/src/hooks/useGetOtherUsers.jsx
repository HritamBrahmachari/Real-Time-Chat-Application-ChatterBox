import { useEffect } from 'react';
import axios from "axios";
import useUserStore from '../stores/userStore';

const useGetOtherUsers = () => {
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);

    const searchUsers = async (query) => {
        try {
            if (!query.trim()) {
                setOtherUsers([]);
                return;
            }
            const res = await axios.get(`/api/v1/user/search?query=${query}`);
            setOtherUsers(res.data);
        } catch (error) {
            console.log(error);
            setOtherUsers([]);
        }
    };

    return { searchUsers };
}

export default useGetOtherUsers
