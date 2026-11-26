import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
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


  return (
    <Tool title={title}>
      <div className={styles.editors}>
        <div>
          <TextPanel id="json-input" label="Input" value={input} rows={11}
            placeholder="Paste your JSON here" invalid={Boolean(error)}
            describedBy={error ? "json-error" : undefined}
            action={<Button onClick={() => updateInput(example)}>Load example</Button>}
            onChange={(event) => updateInput(event.target.value)} />
          {error && <p id="json-error" role="alert" className="tool-error">{error}</p>}
          <div className={styles.actions}>
            <Button type="primary" onClick={() => transform(true)}>Format JSON</Button>
            <Button onClick={() => transform(false)}>Minify</Button>
            <Button onClick={() => updateInput("")}>Clear</Button>
          </div>
        </div>
        <div>
          <TextPanel id="json-output" label="Output" value={output} rows={11}
            placeholder="Formatted JSON will appear here" copyLabel="Copy JSON" />
          <p className="tool-feedback" role="status">{status}</p>
        </div>
      </div>
    </Tool>
  );
}
