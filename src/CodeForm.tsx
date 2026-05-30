import { useEffect, useState } from "react";

import CodeEditor from "./CodeEditor";
import { EXAMPLES } from "./examples";
import styles from "./CodeForm.module.css";

interface CodeFormProps {
  code: string;
  setCode: (code: string) => void;
  darkMode: boolean;
}

type CopyState = "idle" | "copied" | "error";

const copyText = async (text: string): Promise<void> => {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API unavailable");
  }

  await navigator.clipboard.writeText(text);
};

const CodeForm = ({ code, setCode, darkMode }: CodeFormProps) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState !== "copied") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const handleCopyLink = async () => {
    const shareURL = window.location.href;

    try {
      await copyText(shareURL);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div className={`${styles.editorPanel} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.toolbar}>
        <div className={styles.examplesRow}>
          <span className={styles.examplesLabel}>Try:</span>
          <div className={styles.exampleList}>
            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                className={`${styles.exampleChip} ${
                  code === example.code ? styles.exampleChipActive : ""
                }`}
                onClick={() => setCode(example.code)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={styles.shareButton}
          onClick={handleCopyLink}
        >
          {copyState === "copied" ? "Link Copied!" : "Share Example"}
        </button>
      </div>
      {copyState === "error" && (
        <div className={styles.copyError}>Unable to copy the share link.</div>
      )}
      <div className={styles.editorSurface}>
        <CodeEditor code={code} setCode={setCode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default CodeForm;
