import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";

import styles from "./Inspector.module.css";

interface InspectorProps {
  data?: object;
  darkMode: boolean;
}

const Inspector = ({ data, darkMode }: InspectorProps) => (
  <div className={styles.outputContainer}>
    {Boolean(data) && (
      <JsonView
        style={{
          ...(darkMode ? darkTheme : lightTheme),
          fontSize: "1rem",
        }}
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
