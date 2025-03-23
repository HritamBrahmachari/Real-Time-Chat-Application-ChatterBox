import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <button 
      onClick={logout}
      disabled={loading}
      className="logout-button"
    >
      {loading ? (
        <div className="w-5 h-5 border-t-2 border-r-2 border-primary-500 rounded-full animate-spin"></div>
      ) : (
        <>
          <BiLogOut className="text-xl" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;
