import styles from "./ToggleBar.module.css";

const ToggleBar = ({ viewMode, setViewMode, darkMode = false }) => (
  <div className={`${styles.buttonGroup} ${darkMode ? styles.darkMode : ""}`}>
    <button
      className={`${styles.btn} ${viewMode === "tokens" ? styles.active : ""}`}
      onClick={() => setViewMode("tokens")}
    >
      Tokens
    </button>

    <button
      className={`${styles.btn} ${viewMode === "bytecode" ? styles.active : ""}`}
      onClick={() => setViewMode("bytecode")}
    >
      Bytecode
    </button>
  </div>
);

export default ToggleBar;
