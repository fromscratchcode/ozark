import styles from "./ToggleBar.module.css";

const ToggleBar = ({ viewMode, setViewMode }) => (
  <div className={styles.buttonGroup}>
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
