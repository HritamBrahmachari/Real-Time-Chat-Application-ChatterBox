import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SerachInput";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { authUser } = useAuthContext();
  
  return (
    <div className="sidebar-container flex flex-col">
      <div className="p-4">
        <SearchInput />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Conversations />
      </div>
      <div className="p-2 border-t border-gray-700">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
