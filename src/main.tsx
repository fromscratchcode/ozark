import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./standalone.css";
import StandaloneApp from "./StandaloneApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
);
