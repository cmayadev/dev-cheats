import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { compareText, highlightLine } from "./textDiff";
import styles from "./TextDiff.module.scss";

const example = ["color: #333;\nmargin: 1rem;\nline-height: 1.5;", "color: #333;\nmargin: 2rem;\nline-height: 1.5;\npadding: 1rem;"];
const pageSize = 50;

function DiffLine({ line, value, highlights, side }) {
  const label = side === "before" ? "Original" : "Updated";

  return (
    <div className={styles.line} data-side={side}>
      <span>{label}{line !== null && ` · Line ${line}`}</span>
      {value === undefined
        ? <p>—<span className={styles.visuallyHidden}> No line</span></p>
        : <pre>{value === ""
          ? <span className={styles.emptyLine}>Empty line</span>
          : highlights
            ? highlights.filter((part) => !part[side === "before" ? "added" : "removed"])
              .map((part, index) =>
                part.added || part.removed ? <mark key={index}>{part.value}</mark> : part.value
              )
            : value}</pre>}
    </div>
  );
}

export default function TextDiff({ title }) {
  const [inputs, setInputs] = useState(["", ""]);
  const [changes, setChanges] = useState(null);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(pageSize);

  function update(next) {
    setInputs(next);
    setChanges(null);
    setError("");
  }

  function compare(event) {
    event.preventDefault();
    try {
      setChanges(compareText(...inputs));
      setLimit(pageSize);
      setError("");
    } catch (error) {
      setChanges(null);
      setError(error.message);
    }
  }

  return (
    <Tool title={title}>
      <form onSubmit={compare}>
        <div className={styles.columns}>
          <TextPanel label="Original text" value={inputs[0]} rows={9} lineNumbers
            placeholder="Paste the original text"
            onChange={(event) => update([event.target.value, inputs[1]])} />
          <TextPanel label="Updated text" value={inputs[1]} rows={9} lineNumbers
            placeholder="Paste the updated text"
            onChange={(event) => update([inputs[0], event.target.value])} />
        </div>
        <div className={styles.actions}>
          <Button type="primary" htmlType="submit">Compare text</Button>
          <Button onClick={() => update(example)}>Load example</Button>
          <Button onClick={() => update([inputs[1], inputs[0]])}>Swap sides</Button>
        </div>
      </form>
      {error && <p className="tool-error" role="alert">{error}</p>}
      {changes && (
        <section className={styles.results} aria-labelledby="text-diff-results">
          <h2 id="text-diff-results">Differences</h2>
          <p className="tool-feedback" role="status">
            {changes.length ? `${changes.length} ${changes.length === 1 ? "difference" : "differences"}` : "The texts match."}
          </p>
          {changes.length > 0 && (
            <ol className={styles.changes}>
              {changes.slice(0, limit).map(({ before, after, kind, originalLine, updatedLine }) => {
                const highlights = highlightLine(before, after);
                return (
                  <li key={`${originalLine}:${updatedLine}`}>
                    <strong>{kind}</strong>
                    <div className={styles.columns}>
                      <DiffLine side="before" line={originalLine} value={before} highlights={highlights} />
                      <DiffLine side="after" line={updatedLine} value={after} highlights={highlights} />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {changes.length > limit && (
            <Button onClick={() => setLimit(limit + pageSize)}>Show more differences</Button>
          )}
        </section>
      )}
    </Tool>
  );
}
