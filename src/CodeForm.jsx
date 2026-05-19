import { useEffect, useRef, useState } from "react";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
  placeholder,
} from "@codemirror/view";

import { EXAMPLES } from "./examples";
import styles from "./CodeForm.module.css";

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for environments where the Clipboard API is unavailable.
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  try {
    helper.select();
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Clipboard copy failed");
    }
  } finally {
    document.body.removeChild(helper);
  }
};

const themeCompartment = new Compartment();

const createTheme = (darkMode) =>
  EditorView.theme(
    {
      "&": {
        height: "100%",
        background: "transparent",
        color: darkMode ? "#0184a6" : "#000",
      },
      ".cm-scroller": {
        overflow: "auto",
        fontFamily:
          '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
        lineHeight: "1.5",
      },
      ".cm-gutters": {
        minWidth: darkMode ? "3rem" : "3.5rem",
        borderRight: darkMode
          ? "1px solid rgba(1, 132, 166, 0.22)"
          : "1px solid rgba(4, 96, 189, 0.14)",
        background: darkMode ? "rgba(17, 24, 39, 0.5)" : "rgba(239, 246, 255, 0.72)",
        color: darkMode ? "#557c89" : "#6a7c90",
      },
      ".cm-gutter": {
        minWidth: "inherit",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: darkMode ? "0 0.5rem 0 0.75rem" : "0 0.625rem 0 0.75rem",
      },
      ".cm-content": {
        padding: "0.75rem 1rem",
        caretColor: darkMode ? "#8be9fd" : "#0460bd",
      },
      ".cm-line": {
        padding: 0,
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: darkMode ? "#8be9fd" : "#0460bd",
      },
      ".cm-selectionBackground, ::selection": {
        backgroundColor: darkMode
          ? "rgba(1, 132, 166, 0.28)"
          : "rgba(4, 96, 189, 0.18)",
      },
      ".cm-activeLine": {
        backgroundColor: darkMode
          ? "rgba(1, 132, 166, 0.08)"
          : "rgba(4, 96, 189, 0.05)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
      },
      ".cm-placeholder": {
        color: darkMode ? "#5f99a8" : "#666",
      },
      ".cm-focused": {
        outline: "none",
      },
    },
    { dark: darkMode },
  );

const CodeForm = ({ code, setCode, darkMode }) => {
  const [copyState, setCopyState] = useState("idle");
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (copyState !== "copied") return undefined;

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const handleCopyLink = async () => {
    const shareURL = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ozark",
          text: "Inspect Python from source to bytecode",
          url: shareURL,
        });
        return;
      }

      await copyText(shareURL);
      setCopyState("copied");
    } catch (error) {
      if (error?.name === "AbortError") return;
      setCopyState("error");
    }
  };

  useEffect(() => {
    if (!editorRef.current) return undefined;

    const startState = EditorState.create({
      doc: "",
      extensions: [
        lineNumbers(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([indentWithTab]),
        python(),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.lineWrapping,
        placeholder("Enter Python code here"),
        themeCompartment.of(createTheme(darkMode)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [setCode]);

  useEffect(() => {
    const view = viewRef.current;

    if (!view) return;

    view.dispatch({
      effects: themeCompartment.reconfigure(createTheme(darkMode)),
    });
  }, [darkMode]);

  useEffect(() => {
    const view = viewRef.current;

    if (!view) return;

    const currentCode = view.state.doc.toString();

    if (code === currentCode) return;

    view.dispatch({
      changes: {
        from: 0,
        to: currentCode.length,
        insert: code,
      },
    });
  }, [code]);

  return (
    <div className={`${styles.editorPanel} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.toolbar}>
        <div className={styles.examplesRow}>
          <span className={styles.examplesLabel}>Examples</span>
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
          {copyState === "copied"
            ? "Copied"
            : navigator.share
              ? "Share"
              : "Copy Share Link"}
        </button>
      </div>
      {copyState === "error" && (
        <div className={styles.copyError}>Unable to copy the share link.</div>
      )}
      <div className={styles.editorSurface}>
        <div ref={editorRef} className={styles.editor} />
      </div>
    </div>
  );
};

export default CodeForm;
