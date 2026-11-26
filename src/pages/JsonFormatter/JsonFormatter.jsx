import { useRef, useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { jsonErrorLocation, transformJson } from "./transformJson";
import styles from "./JsonFormatter.module.scss";

const example = '{"name":"Dev Cheats","tools":["JSON Formatter","Color Converter"],"local":true}';

export default function JsonFormatter({ title }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const inputField = useRef(null);
  const [status, setStatus] = useState("");

  function updateInput(value) {
    setInput(value);
    setOutput("");
    setError(null);
    setStatus("");
  }

  function transform(pretty) {
    setStatus("");
    try {
      setOutput(transformJson(input, pretty));
      setError(null);
      setStatus(pretty ? "JSON formatted." : "JSON minified.");
    } catch (error) {
      setOutput("");
      setError(input.trim()
        ? { message: error.message, location: jsonErrorLocation(input, error.message) }
        : { message: "Enter JSON to get started." });
    }
  }

  function jumpToError() {
    const { offset, line, column } = error.location;
    const field = inputField.current;
    field.focus({ preventScroll: true });
    field.setSelectionRange(offset, offset);
    const { font, lineHeight } = getComputedStyle(field);
    const ruler = document.createElement("canvas").getContext("2d");
    if (ruler) {
      ruler.font = font;
      const text = input.slice(offset - column + 1, offset).replaceAll("\t", "        ");
      field.scrollLeft = Math.max(0, ruler.measureText(text).width - field.clientWidth / 2);
    }
    field.scrollTop = Math.max(0, (line - 1) * Number.parseFloat(lineHeight) - field.clientHeight / 2);
    field.scrollIntoView({ block: "nearest" });
  }


  return (
    <Tool title={title}>
      <div className={styles.editors}>
        <div>
          <TextPanel id="json-input" label="Input" value={input} rows={11} lineNumbers fieldRef={inputField}
            placeholder="Paste your JSON here" invalid={Boolean(error)}
            describedBy={error ? "json-error" : undefined}
            action={<Button onClick={() => updateInput(example)}>Load example</Button>}
            onChange={(event) => updateInput(event.target.value)} />
          {error && (
            <div className={styles.validation}>
              <p id="json-error" role="alert" className="tool-error">{error.message}</p>
              {error.location && (
                <Button onClick={jumpToError}>Go to line {error.location.line}, column {error.location.column}</Button>
              )}
            </div>
          )}
          <div className={styles.actions}>
            <Button type="primary" onClick={() => transform(true)}>Format JSON</Button>
            <Button onClick={() => transform(false)}>Minify</Button>
            <Button onClick={() => updateInput("")}>Clear</Button>
          </div>
        </div>
        <div>
          <TextPanel id="json-output" label="Output" value={output} rows={11} lineNumbers
            placeholder="Formatted JSON will appear here" copyLabel="Copy JSON" />
          <p className="tool-feedback" role="status">{status}</p>
        </div>
      </div>
    </Tool>
  );
}
