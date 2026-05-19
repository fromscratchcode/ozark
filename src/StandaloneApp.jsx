import { useEffect, useState } from "react";

import App from "./App.jsx";

const getInitialDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const StandaloneApp = () => {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setDarkMode(event.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className={`standaloneShell ${darkMode ? "standaloneShellDark" : ""}`}>
      <div className="standaloneToolbar">
        <button
          type="button"
          className="themeToggle"
          onClick={() => setDarkMode((current) => !current)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <div className="standaloneAppFrame">
        <App darkMode={darkMode} />
      </div>
    </div>
  );
};

export default StandaloneApp;
