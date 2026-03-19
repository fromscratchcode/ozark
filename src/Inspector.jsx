import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import styles from "./Inspector.module.css";

const Inspector = ({ data, darkMode }) => (
  <div className={styles.outputContainer}>
    {data && (
      <JsonView
        style={darkMode ? darkTheme : lightTheme}
        value={data}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    )}
    {!data && <div>See error.</div>}
  </div>
);

export default Inspector;
