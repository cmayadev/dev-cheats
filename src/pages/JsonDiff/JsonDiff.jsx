import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { compareJson, parseDocument } from "./jsonDiff";
import styles from "./JsonDiff.module.scss";

const example = [
  '{\n  "status": "draft",\n  "tags": ["css"],\n  "published": false\n}',
  '{\n  "status": "ready",\n  "tags": ["css", "json"]\n}',
];
const labels = ["Original JSON", "Updated JSON"];
const pageSize = 50;

export default function JsonDiff({ title }) {
  const { state } = useLocation();
  const [documents, setDocuments] = useState(() => [state?.originalJson ?? "", ""]);
  const [errors, setErrors] = useState([]);
  const [comparisonError, setComparisonError] = useState("");
  const [changes, setChanges] = useState(null);
  const [limit, setLimit] = useState(pageSize);

  function update(next) {
    setDocuments(next);
    setErrors([]);
    setComparisonError("");
    setChanges(null);
  }

  function compare() {
    const validation = [];
    const parsed = documents.map((document, index) => {
      try {
        return parseDocument(document);
      } catch (error) {
        validation[index] = error.message;
      }
    });
    setErrors(validation);
    setChanges(null);
    setComparisonError("");
    if (validation.length) return;

    try {
      setChanges(compareJson(...parsed));
      setLimit(pageSize);
    } catch {
      setComparisonError("The documents are too deeply nested to compare.");
    }
  }

  const totals = changes?.reduce((counts, { type }) => {
    counts[type]++;
    return counts;
  }, { Added: 0, Removed: 0, Changed: 0 });

  return (
    <Tool title={title}>
      <div className={styles.columns}>
        {labels.map((label, index) => (
          <div key={label}>
            <TextPanel label={label} value={documents[index]} rows={9} lineNumbers
              invalid={Boolean(errors[index])} describedBy={errors[index] ? `diff-error-${index}` : undefined}
              placeholder="Paste JSON here"
              onChange={(event) => update(documents.map((value, side) =>
                side === index ? event.target.value : value
              ))} />
            {errors[index] && (
              <p id={`diff-error-${index}`} className="tool-error" role="alert">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <Button type="primary" onClick={compare}>Compare JSON</Button>
        <Button onClick={() => update(example)}>Load example</Button>
        <Button onClick={() => update([documents[1], documents[0]])}>Swap sides</Button>
      </div>
      {comparisonError && <p className="tool-error" role="alert">{comparisonError}</p>}
      {changes && (
        <section className={styles.results} aria-labelledby="diff-results">
          <h2 id="diff-results">Differences</h2>
          <p className="tool-feedback" role="status">
            {changes.length
              ? `${totals.Added} added · ${totals.Removed} removed · ${totals.Changed} changed`
              : "The documents match."}
          </p>
          {changes.length > 0 && (
            <ul className={styles.changes}>
              {changes.slice(0, limit).map(({ type, path, before, after }) => (
                <li key={path}>
                  <div className={styles.changeHeader}>
                    <strong>{type}</strong>
                    <code>{path || "Document root"}</code>
                  </div>
                  <div className={styles.columns}>
                    {before !== undefined && <div><span>Original</span><pre>{before}</pre></div>}
                    {after !== undefined && <div><span>Updated</span><pre>{after}</pre></div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {changes.length > limit && (
            <Button onClick={() => setLimit(limit + pageSize)}>Show more changes</Button>
          )}
        </section>
      )}
    </Tool>
  );
}
