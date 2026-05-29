import { useEffect, useState } from "react";

import "./Ozark.css";
import { createMemphis } from "./memphis";
import type { Memphis } from "./memphis";
import OzarkTool from "./OzarkTool";

interface OzarkProps {
  darkMode?: boolean;
}

interface LoadingMessageProps {
  darkMode: boolean;
}

interface InitErrorMessageProps {
  darkMode: boolean;
  error: string;
}

const LoadingMessage = ({ darkMode }: LoadingMessageProps) => (
  <div className={`loadingMessage ${darkMode ? "loadingMessageDark" : ""}`}>
    Loading Memphis...
  </div>
);

const InitErrorMessage = ({ darkMode, error }: InitErrorMessageProps) => (
  <div className={`errorMessage ${darkMode ? "errorMessageDark" : ""}`}>
    <p className="errorMessageTitle">Memphis failed to load.</p>
    <p className="errorMessageBody">{error}</p>
  </div>
);

const Ozark = ({ darkMode = false }: OzarkProps) => {
  const [memphis, setMemphis] = useState<Memphis | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setMemphis(null);
    setInitError(null);

    createMemphis()
      .then((runtime) => {
        if (!cancelled) {
          setMemphis(runtime);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitError("Failed to initialize Memphis.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (initError) {
    return <InitErrorMessage darkMode={darkMode} error={initError} />;
  }

  if (!memphis) {
    return <LoadingMessage darkMode={darkMode} />;
  }

  return <OzarkTool darkMode={darkMode} memphis={memphis} />;
};

export default Ozark;
