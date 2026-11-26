import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { inspectUrl, updateQuery } from "./url";
import styles from "./UrlInspector.module.scss";

const example = "https://example.com/docs?tag=css&tag=react&sort=recent#examples";

export default function UrlInspector({ title }) {
  const [input, setInput] = useState("");
  const [editedParams, setEditedParams] = useState(null);
  const url = inspectUrl(input);
  const invalid = Boolean(input.trim()) && !url;
  const parameters = editedParams ?? Array.from(url?.searchParams ?? [], ([name, value], id) => ({
    id, name, value,
  }));
  const result = url ? (editedParams ? updateQuery(url, parameters) : url.href) : "";

  function updateInput(value) {
    setInput(value);
    setEditedParams(null);
  }

  function updateParameters(next) {
    setEditedParams(next);
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


  return (
    <Tool title={title}>
      <div className={styles.editors}>
        <div>
          <div className={styles.bar}>
            <label htmlFor="url-input">URL</label>
            <Button onClick={() => updateInput(example)}>Load example</Button>
          </div>
          <input className={styles.input} id="url-input" type="text" inputMode="url"
            autoComplete="off" spellCheck={false} placeholder="https://example.com"
            value={input} onChange={(event) => updateInput(event.target.value)}
            aria-invalid={invalid} aria-describedby={invalid ? "url-error" : undefined} />
          {invalid && <p id="url-error" className="tool-error" role="alert">Enter a full HTTP or HTTPS URL.</p>}
        </div>
        <TextPanel id="url-result" label="Result" value={result} rows={2}
          placeholder="The updated URL will appear here" copyLabel="Copy URL" />
      </div>
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
              <Button onClick={addParameter}>Add parameter</Button>
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
                    <Button aria-label={`Remove parameter ${index + 1}`}
                      onClick={() => updateParameters(parameters.filter((parameter) => parameter.id !== id))}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : <p className={styles.intro}>No query parameters.</p>}
          </section>
        </>
      )}
    </Tool>
  );
}
