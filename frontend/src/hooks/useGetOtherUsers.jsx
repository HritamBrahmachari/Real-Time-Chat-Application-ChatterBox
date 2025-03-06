import { useEffect } from 'react';
import axios from "axios";
import useUserStore from '../stores/userStore';
import { BASE_URL } from '..';

const useGetOtherUsers = () => {
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/user`);
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
