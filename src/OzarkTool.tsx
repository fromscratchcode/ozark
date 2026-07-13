import { useEffect, useState } from "react";

import Console from "./Console";
import Inspector from "./Inspector";
import { getCodeFromURL, setCodeInURL } from "./urlState";
import CodeForm from "./CodeForm";
import { DEFAULT_CODE } from "./examples";
import type { Memphis } from "@fromscratchcode/memphis-js";
import styles from "./OzarkTool.module.css";
import ToggleBar from "./ToggleBar";
import type { ViewMode } from "./types";

interface OzarkToolProps {
  darkMode?: boolean;
  memphis: Memphis;
}

interface InspectionResult {
  data?: object;
  error: string;
}

const getInspectionResult = (
  memphis: Memphis,
  code: string,
  viewMode: ViewMode,
): InspectionResult => {
  if (viewMode === "tokens") {
    // Lexing cannot fail, it will always return a token stream.
    return { data: memphis.lex(code) as object, error: "" };
  }

  if (viewMode === "ast") {
    try {
      return { data: memphis.parse(code) as object, error: "" };
    } catch (error) {
      return { error: `Parse error: ${String(error)}` };
    }
  }

  try {
    return { data: memphis.compile(code) as object, error: "" };
  } catch (error) {
    return { error: `Compile error: ${String(error)}` };
  }
};

const OzarkTool = ({ darkMode = false, memphis }: OzarkToolProps) => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [viewMode, setViewMode] = useState<ViewMode>("bytecode");

  useEffect(() => {
    // URL-backed state is browser-only, so hydrate it after mount.
    setCode(getCodeFromURL() || DEFAULT_CODE);
  }, []);

  useEffect(() => {
    setCodeInURL(code);
  }, [code]);

  const result = getInspectionResult(memphis, code, viewMode);

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.codeContainer}>
          <CodeForm code={code} setCode={setCode} darkMode={darkMode} />
        </div>
        <div className={styles.toggleContainer}>
          <ToggleBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            darkMode={darkMode}
          />
        </div>
        <div className={styles.consoleContainer}>
          <Console error={result.error} darkMode={darkMode} />
        </div>
      </div>
      <div
        className={`${styles.rightColumn} ${darkMode ? styles.darkMode : ""}`}
      >
        <Inspector darkMode={darkMode} data={result.data} />
      </div>
    </div>
  );
};

export default OzarkTool;
