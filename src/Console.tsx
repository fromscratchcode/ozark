import styles from "./Console.module.css";

interface ConsoleProps {
  error: string;
  darkMode?: boolean;
}

const needsExtra = (error: string): boolean =>
  error.indexOf("Unsupported feature") !== -1;

const buildExtra = () => {
  return (
    <p>
      For a full list, see the{" "}
      <a href="https://github.com/fromscratchcode/memphis/blob/main/docs/SUPPORTED.md">
        Memphis documentation
      </a>
      .
    </p>
  );
};

const Console = ({ error, darkMode = false }: ConsoleProps) => {
  const firstLine = error || "Success!";
  const secondLine = needsExtra(error) ? buildExtra() : null;

  return (
    <div className={`${styles.consoleBox} ${darkMode ? styles.darkMode : ""}`}>
      <pre className={styles.consoleOutput}>
        {firstLine}
        {secondLine}
      </pre>
    </div>
  );
};

export default Console;
