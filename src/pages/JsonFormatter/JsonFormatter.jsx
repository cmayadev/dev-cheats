import { useState } from "react";
import Tool from "../../components/layout/Tool/Tool";
import { transformJson } from "./transformJson";
import styles from "./JsonFormatter.module.scss";

const example = '{"name":"Dev Cheats","tools":["JSON Formatter","Color Converter"],"local":true}';

export default function JsonFormatter({ title }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function updateInput(value) {
    setInput(value);
    setOutput("");
    setError("");
    setStatus("");
  }

  function transform(pretty) {
    setStatus("");
    try {
      setOutput(transformJson(input, pretty));
      setError("");
      setStatus(pretty ? "JSON formatted." : "JSON minified.");
    } catch (error) {
      setOutput("");
      setError(input.trim() ? error.message : "Enter JSON to get started.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Clipboard unavailable. Select and copy the result manually.");
    }
  }

  return (
    <Tool title={title}>
      <p className={styles.intro}>Format, validate or minify JSON in your browser.</p>
      <div className={styles.editors}>
        <div className={styles.editor}>
          <div className={styles.bar}>
            <label htmlFor="json-input">Input</label>
            <button type="button" onClick={() => updateInput(example)}>Load example</button>
          </div>
          <textarea id="json-input" value={input} spellCheck={false}
            placeholder="Paste your JSON here"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "json-error" : undefined}
            onChange={(event) => updateInput(event.target.value)} />
        </div>
        <div className={styles.editor}>
          <div className={styles.bar}>
            <label htmlFor="json-output">Output</label>
            <button type="button" disabled={!output} onClick={copy}>Copy JSON</button>
          </div>
          <textarea id="json-output" value={output} spellCheck={false} readOnly />
        </div>
      </div>
      {error && <p id="json-error" role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => transform(true)}>Format JSON</button>
        <button type="button" onClick={() => transform(false)}>Minify</button>
        <button type="button" onClick={() => updateInput("")}>Clear</button>
        <span role="status">{status}</span>
      </div>
    </Tool>
  );
}
