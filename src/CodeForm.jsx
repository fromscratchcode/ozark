import styles from "./CodeForm.module.css";
import appStyles from "./App.module.css";

const CodeForm = ({ code, setCode, darkMode }) => (
  <textarea
    className={`${styles.codeForm} ${darkMode ? appStyles.darkMode : ""}`}
    value={code}
    onChange={(e) => setCode(e.target.value)}
    placeholder="Enter Python code here"
  />
);

export default CodeForm;
