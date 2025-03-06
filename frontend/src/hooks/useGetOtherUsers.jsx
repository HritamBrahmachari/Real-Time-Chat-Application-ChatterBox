import { useEffect } from 'react';
import axios from "axios";
import useUserStore from '../stores/userStore';

const useGetOtherUsers = () => {
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get('/api/v1/user');
                // store
                console.log("other users -> ",res);
                setOtherUsers(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
    }, [setOtherUsers])

}

export default useGetOtherUsers
