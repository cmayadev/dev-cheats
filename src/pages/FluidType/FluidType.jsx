import { useState } from "react";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { fluidType } from "./fluidType";
import styles from "./FluidType.module.scss";

const fields = [
  ["minSize", "Minimum font size"],
  ["maxSize", "Maximum font size"],
  ["minWidth", "Minimum viewport width"],
  ["maxWidth", "Maximum viewport width"],
  ["rootSize", "Root font size"],
];

const initialValues = {
  minSize: "16",
  maxSize: "32",
  minWidth: "320",
  maxWidth: "1280",
  rootSize: "16",
};

export default function FluidType({ title }) {
  const [values, setValues] = useState(initialValues);
  const [position, setPosition] = useState(50);
  const [minSize, maxSize, minWidth, maxWidth, rootSize] = fields.map(([name]) => Number(values[name]));
  const result = fluidType(minSize, maxSize, minWidth, maxWidth, rootSize);
  const viewport = minWidth + (maxWidth - minWidth) * (position / 100);
  const previewSize = result?.sizeAt(viewport);
  const css = result ? `font-size: ${result.css};` : "";

  function updateValue(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }


  return (
    <Tool title={title}>
      <p className={styles.intro}>Generate a CSS font size that scales between two viewport widths.</p>
      <div className={styles.fields}>
        {fields.map(([name, label]) => (
          <label key={name}>
            {label}
            <span className={styles.field}>
              <input type="number" step="any" min="0" value={values[name]}
                onChange={(event) => updateValue(name, event.target.value)}
                aria-label={`${label} in pixels`} />
              <span aria-hidden="true">px</span>
            </span>
          </label>
        ))}
      </div>
      {!result && (
        <p className={styles.error} role="alert">
          Enter positive values. The maximum viewport width must exceed the minimum, and the maximum font size must be at least the minimum.
        </p>
      )}
      {result && (
        <>
          <section className={styles.section} aria-labelledby="fluid-preview">
            <h2 id="fluid-preview">Preview</h2>
            <label className={styles.slider} htmlFor="fluid-width">
              <span>Viewport width · {Number(viewport.toFixed(2))} px</span>
              <input id="fluid-width" type="range" min="0" max="100" value={position}
                aria-valuetext={`${Number(viewport.toFixed(2))} pixels`}
                onChange={(event) => setPosition(Number(event.target.value))} />
            </label>
            <p className={styles.sample} style={{ fontSize: Math.min(previewSize, 120) }}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className={styles.intro}>Font size · {Number(previewSize.toFixed(2))} px</p>
            {previewSize > 120 && <p className={styles.intro}>Preview limited to 120 px.</p>}
          </section>
          <div className={styles.section}>
            <TextPanel id="fluid-css" label="CSS" value={css} rows={2} copyLabel="Copy CSS" />
          </div>
        </>
      )}
    </Tool>
  );
}
