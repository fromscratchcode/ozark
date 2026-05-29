import styles from "./ToggleBar.module.css";
import type { Dispatch, SetStateAction } from "react";
import type { ViewMode } from "./types";

interface ToggleBarProps {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  darkMode?: boolean;
}

const VIEW_MODE_OPTIONS: ReadonlyArray<{ id: ViewMode; label: string }> = [
  { id: "tokens", label: "Tokens" },
  { id: "ast", label: "AST" },
  { id: "bytecode", label: "Bytecode" },
];

const ToggleBar = ({
  viewMode,
  setViewMode,
  darkMode = false,
}: ToggleBarProps) => (
  <div className={`${styles.buttonGroup} ${darkMode ? styles.darkMode : ""}`}>
    {VIEW_MODE_OPTIONS.map((option) => (
      <button
        key={option.id}
        className={`${styles.btn} ${viewMode === option.id ? styles.active : ""}`}
        onClick={() => setViewMode(option.id)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default ToggleBar;
