import { useId, useRef, useState } from "react";
import Button from "../Button/Button";
import styles from "./TextPanel.module.scss";

export default function TextPanel({
  id, label, value, onChange, placeholder, invalid, describedBy, action, copyLabel, rows = 8, prose, lineNumbers = false, fieldRef,
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const internalField = useRef(null);
  const gutter = useRef(null);
  const field = fieldRef ?? internalField;
  const lineCount = lineNumbers ? value.split(/\r\n|[\r\n]/).length : 0;

  function syncGutter(event) {
    if (gutter.current) gutter.current.scrollTop = event.currentTarget.scrollTop;
  }
  const [feedback, setFeedback] = useState(null);
  const visibleFeedback = feedback?.value === value ? feedback.message : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback({ value, message: "Copied to clipboard." });
    } catch {
      if (field.current?.value === value) {
        field.current.focus();
        field.current.select();
      }
      setFeedback({ value, message: "Clipboard unavailable. Copy the selected text manually." });
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.bar}>
        <label htmlFor={fieldId}>{label}</label>
        {copyLabel ? <Button disabled={!value} onClick={copy}>{copyLabel}</Button> : action}
      </div>
      <div className={lineNumbers ? styles.numbered : undefined}>
        {lineNumbers && (
          <div className={styles.gutter} ref={gutter} aria-hidden="true"
            style={{ "--line-digits": String(lineCount).length }}>
            <pre>{Array.from({ length: lineCount }, (_, index) => index + 1).join("\n")}</pre>
          </div>
        )}
        <textarea ref={field} id={fieldId} className={prose ? styles.prose : undefined}
          value={value} onChange={onChange} readOnly={!onChange} placeholder={placeholder}
          rows={rows} spellCheck={false} aria-invalid={invalid} aria-describedby={describedBy}
          wrap={lineNumbers ? "off" : undefined} onScroll={lineNumbers ? syncGutter : undefined} />
      </div>
      {copyLabel && <p className={styles.feedback} role="status">{visibleFeedback}</p>}
    </div>
  );
}
