import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import Tool from "../../components/layout/Tool/Tool";
import { parseTimestamp } from "./timestamp";
import styles from "./TimestampConverter.module.scss";

const formats = {
  seconds: { label: "Unix seconds", example: "1704067200", hint: "Enter Unix seconds with up to three decimal places." },
  milliseconds: { label: "Unix milliseconds", example: "1704067200000", hint: "Enter a whole number of milliseconds." },
  iso: { label: "ISO 8601", example: "2024-01-01T01:00:00+01:00", hint: "Enter an ISO date and time with Z or an offset, such as +01:00." },
};

const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const zones = [...new Set([localZone, "UTC", ...(Intl.supportedValuesOf?.("timeZone") ?? [
  "America/Los_Angeles", "America/New_York", "Europe/London", "Europe/Madrid", "Asia/Tokyo",
])])];
const dateFormat = { dateStyle: "medium", timeStyle: "long" };

function epochSeconds(time) {
  const fraction = Math.abs(time % 1000);
  const seconds = Math.floor(Math.abs(time) / 1000);
  return `${time < 0 ? "-" : ""}${seconds}${fraction ? `.${String(fraction).padStart(3, "0").replace(/0+$/, "")}` : ""}`;
}

export default function TimestampConverter({ title }) {
  const [source, setSource] = useState({ format: "seconds", input: "" });
  const [zone, setZone] = useState(localZone);
  const [feedback, setFeedback] = useState(null);
  const time = parseTimestamp(source.input, source.format);
  const activeFormat = formats[source.format];
  const invalid = Boolean(source.input.trim()) && time === null;
  const instant = time === null ? null : new Date(time);
  const rows = instant ? [
    ["UTC (ISO 8601)", instant.toISOString()],
    [zone, new Intl.DateTimeFormat(undefined, { ...dateFormat, timeZone: zone }).format(instant)],
    ["Unix seconds", epochSeconds(time)],
    ["Unix milliseconds", String(time)],
  ] : [];
  const currentFeedback = feedback?.source === source && feedback.zone === zone ? feedback.message : "";

  function showNow() {
    setSource({ format: "iso", input: new Date().toISOString() });
  }

  async function copy(label, value) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback({ source, zone, message: `${label} copied to clipboard.` });
    } catch {
      setFeedback({ source, zone, message: "Clipboard unavailable. Select and copy the result manually." });
    }
  }

  return (
    <Tool title={title}>
      <div className={styles.settings}>
        <label>Input format
          <select value={source.format} onChange={(event) => setSource({ ...source, format: event.target.value })}>
            {Object.entries(formats).map(([name, { label }]) => <option key={name} value={name}>{label}</option>)}
          </select>
        </label>
        <label>Display time zone
          <select value={zone} onChange={(event) => setZone(event.target.value)}>
            {zones.map((name) => <option key={name} value={name}>{name}{name === localZone ? " (local)" : ""}</option>)}
          </select>
        </label>
      </div>
      <div className={styles.entry}>
        <label htmlFor="timestamp-input">Timestamp</label>
        <input id="timestamp-input" type="text" inputMode={source.format === "iso" ? "text" : undefined}
          spellCheck={false} autoComplete="off" value={source.input} placeholder={activeFormat.example}
          aria-invalid={invalid} aria-describedby={invalid ? "timestamp-error" : undefined}
          onChange={(event) => setSource({ ...source, input: event.target.value })} />
        {invalid && <p className="tool-error" id="timestamp-error" role="alert">{activeFormat.hint}</p>}
        <div className={styles.actions}>
          <Button onClick={() => setSource({ ...source, input: activeFormat.example })}>Load example</Button>
          <Button onClick={showNow}>Use current time</Button>
        </div>
      </div>
      {instant && (
        <section className={styles.results} aria-labelledby="timestamp-results">
          <h2 id="timestamp-results">Converted values</h2>
          <dl>
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd><code>{value}</code></dd>
                <dd><Button aria-label={`Copy ${label}`} onClick={() => copy(label, value)}>Copy</Button></dd>
              </div>
            ))}
          </dl>
          <p className="tool-feedback" role="status">{currentFeedback}</p>
        </section>
      )}
    </Tool>
  );
}
