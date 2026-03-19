import { useEffect, useState } from "react";
import init, { compile, lex } from "../pkg/memphis.js";

import Console from "./Console";
import Inspector from "./Inspector";
import { getCodeFromURL, setCodeInURL } from "./urlState";
import styles from "./App.module.css";
import CodeForm from "./CodeForm.jsx";
import ToggleBar from "./ToggleBar.jsx";

const INITIAL_CODE = `y = 42

def foo(x, z):
    return x + y + z

foo(11,12)`;

const App = ({ darkMode = false }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("bytecode");
  const [codeObject, setCodeObject] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => {
    init().then(() => {
      setWasmLoaded(true);
      const initial = getCodeFromURL() || INITIAL_CODE;
      setCode(initial);
    });
  }, []);

  useEffect(() => {
    if (!wasmLoaded) return;

    setCodeInURL(code);
    // Lexing cannot fail, it will always return a token stream, so we do not need to consider the
    // console here.
    setTokens(lex(code));

    try {
      setCodeObject(compile(code));
      setError("");
    } catch (e) {
      setCodeObject(null);
      setError(e.toString());
    }
  }, [code, wasmLoaded]);

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.codeContainer}>
          <CodeForm code={code} setCode={setCode} darkMode={darkMode} />
        </div>
        <div className={styles.toggleContainer}>
          <ToggleBar viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <div className={styles.consoleContainer}>
          <Console error={error} />
        </div>
      </div>
      <div
        className={`${styles.rightColumn} ${darkMode ? styles.darkMode : ""}`}
      >
        {viewMode === "bytecode" && (
          <Inspector darkMode={darkMode} data={codeObject} />
        )}
        {viewMode === "tokens" && (
          <Inspector darkMode={darkMode} data={tokens} />
        )}
      </div>
    </div>
  );
};

export default App;
