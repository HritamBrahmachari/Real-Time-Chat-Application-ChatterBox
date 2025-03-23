import { useThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label="Toggle theme"
    >
      <div className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="theme-toggle-track">
          <FiSun className="theme-toggle-icon sun" />
          <FiMoon className="theme-toggle-icon moon" />
        </div>
        <div className="theme-toggle-thumb"></div>
      </div>
    </button>
  );
};

export default ThemeToggle; 