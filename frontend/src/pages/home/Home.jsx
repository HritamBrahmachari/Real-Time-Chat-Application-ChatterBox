import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import ThemeToggle from "../../components/ThemeToggle";
import { useThemeContext } from "../../context/ThemeContext";

const Home = () => {
  const { isDarkMode } = useThemeContext();
  
  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4">
      <div className="chat-container w-full flex h-[90vh]">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
