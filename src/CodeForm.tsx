import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
  faChevronDown,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

import CodeEditor from "./CodeEditor";
import { EXAMPLES } from "./examples";
import { encodeCode } from "./urlState";
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
  const [examplesOpen, setExamplesOpen] = useState(false);
  const examplesMenuRef = useRef<HTMLDivElement | null>(null);
  const runURL = `https://memphis.fromscratchcode.com?code=${encodeCode(code)}`;

  useEffect(() => {
    if (copyState !== "copied") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  useEffect(() => {
    if (!examplesOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!examplesMenuRef.current?.contains(event.target as Node)) {
        setExamplesOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [examplesOpen]);

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
          <div className={styles.examplesMenu} ref={examplesMenuRef}>
            <button
              type="button"
              className={styles.examplesButton}
              onClick={() => setExamplesOpen((open) => !open)}
              aria-expanded={examplesOpen}
              aria-haspopup="menu"
            >
              Examples
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.buttonIcon}
                aria-hidden="true"
              />
            </button>
            {examplesOpen && (
              <div className={styles.examplesDropdown} role="menu">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    role="menuitem"
                    className={`${styles.exampleOption} ${
                      code === example.code ? styles.exampleOptionActive : ""
                    }`}
                    onClick={() => {
                      setCode(example.code);
                      setExamplesOpen(false);
                    }}
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={styles.utilityButton}
            onClick={handleCopyLink}
            aria-label={copyState === "copied" ? "Link copied" : "Copy link"}
            title={copyState === "copied" ? "Link copied" : "Copy link"}
          >
            <FontAwesomeIcon
              icon={copyState === "copied" ? faCheck : faLink}
              className={styles.buttonIcon}
              aria-hidden="true"
            />
          </button>
          <a className={styles.runButton} href={runURL}>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className={styles.buttonIcon}
              aria-hidden="true"
            />
            Run in Memphis
          </a>
        </div>
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
