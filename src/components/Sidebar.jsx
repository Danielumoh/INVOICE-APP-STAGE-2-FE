import { useTheme } from "../context/ThemeContext";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoShape}>
          <span className={styles.logoIcon}>⚡</span>
        </div>
      </div>

      {/* Bottom section: theme toggle + avatar */}
      <div className={styles.bottom}>
        {/* Theme Toggle Button */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Avatar */}
        <div className={styles.avatar}>
          <img
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            className={styles.avatarImg}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
