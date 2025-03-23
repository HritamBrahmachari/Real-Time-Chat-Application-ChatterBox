import { useState } from "react";
import toast from "react-hot-toast";

const useSearchUsers = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?name=${searchTerm}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSearchResults(data);
    } catch (error) {
      toast.error(error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchResults, searchUsers };
};

export default useSearchUsers; 