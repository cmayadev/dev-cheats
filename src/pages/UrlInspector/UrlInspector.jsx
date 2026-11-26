import { useState } from "react";
import Tool from "../../components/layout/Tool/Tool";
import { inspectUrl, updateQuery } from "./url";
import styles from "./UrlInspector.module.scss";

const example = "https://example.com/docs?tag=css&tag=react&sort=recent#examples";

export default function UrlInspector({ title }) {
  const [input, setInput] = useState("");
  const [editedParams, setEditedParams] = useState(null);
  const [status, setStatus] = useState("");
  const url = inspectUrl(input);
  const invalid = Boolean(input.trim()) && !url;
  const parameters = editedParams ?? Array.from(url?.searchParams ?? [], ([name, value], id) => ({
    id, name, value,
  }));
  const result = url ? (editedParams ? updateQuery(url, parameters) : url.href) : "";

  function updateInput(value) {
    setInput(value);
    setEditedParams(null);
    setStatus("");
  }

  function updateParameters(next) {
    setEditedParams(next);
    setStatus("");
  }

  function addParameter() {
    const id = (parameters.at(-1)?.id ?? -1) + 1;
    updateParameters([...parameters, { id, name: "", value: "" }]);
  }

  function editParameter(id, field, value) {
    updateParameters(parameters.map((parameter) =>
      parameter.id === id ? { ...parameter, [field]: value } : parameter
    ));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Clipboard unavailable. Select and copy the URL manually.");
    }
  }

  return (
    <Tool title={title}>
      <p className={styles.intro}>Inspect a URL and edit its query parameters in your browser.</p>
      <div className={styles.bar}>
        <label htmlFor="url-input">URL</label>
        <button type="button" onClick={() => updateInput(example)}>Load example</button>
      </div>
      <input className={styles.input} id="url-input" type="text" inputMode="url"
        autoComplete="off" spellCheck={false} placeholder="https://example.com"
        value={input} onChange={(event) => updateInput(event.target.value)}
        aria-invalid={invalid} aria-describedby={invalid ? "url-error" : undefined} />
      {invalid && <p id="url-error" className={styles.error}>Enter a full HTTP or HTTPS URL.</p>}
      {url && (
        <>
          <dl className={styles.details}>
            <div><dt>Protocol</dt><dd>{url.protocol.slice(0, -1)}</dd></div>
            <div><dt>Host</dt><dd>{url.host}</dd></div>
            <div><dt>Path</dt><dd>{url.pathname}</dd></div>
            <div><dt>Fragment</dt><dd>{url.hash || "None"}</dd></div>
          </dl>
          <section aria-labelledby="url-parameters" className={styles.section}>
            <div className={styles.bar}>
              <h2 id="url-parameters">Query parameters</h2>
              <button type="button" onClick={addParameter}>Add parameter</button>
            </div>
            {parameters.length ? (
              <ul className={styles.parameters}>
                {parameters.map(({ id, name, value }, index) => (
                  <li key={id}>
                    <label>
                      Name
                      <input className={styles.input} aria-label={`Parameter ${index + 1} name`}
                        value={name} spellCheck={false}
                        onChange={(event) => editParameter(id, "name", event.target.value)} />
                    </label>
                    <label>
                      Value
                      <input className={styles.input} aria-label={`Parameter ${index + 1} value`}
                        value={value} spellCheck={false}
                        onChange={(event) => editParameter(id, "value", event.target.value)} />
                    </label>
                    <button type="button" aria-label={`Remove parameter ${index + 1}`}
                      onClick={() => updateParameters(parameters.filter((parameter) => parameter.id !== id))}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className={styles.intro}>No query parameters.</p>}
          </section>
          <div className={styles.section}>
            <div className={styles.bar}>
              <label htmlFor="url-result">Result</label>
              <button type="button" className={styles.primary} onClick={copy}>Copy URL</button>
            </div>
            <textarea className={styles.input} id="url-result" value={result} readOnly rows={2} />
            <p className={styles.status} role="status">{status}</p>
          </div>
        </>
      )}
    </Tool>
  );
}
