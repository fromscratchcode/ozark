import { useEffect, useRef } from "react";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
  placeholder,
} from "@codemirror/view";

import styles from "./CodeForm.module.css";

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
        minWidth: "3.5rem",
        borderRight: darkMode
          ? "1px solid rgba(1, 132, 166, 0.22)"
          : "1px solid rgba(4, 96, 189, 0.14)",
        background: darkMode
          ? "rgba(17, 24, 39, 0.5)"
          : "rgba(239, 246, 255, 0.72)",
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
        caretColor: darkMode ? "#8be9fd" : "var(--theme-dark-blue)",
      },
      ".cm-line": {
        padding: 0,
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: darkMode ? "#8be9fd" : "var(--theme-dark-blue)",
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

const CodeEditor = ({ code, setCode, darkMode }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const initialThemeRef = useRef(createTheme(darkMode));

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
        themeCompartment.of(initialThemeRef.current),
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

  return <div ref={editorRef} className={styles.editor} />;
};

export default CodeEditor;
