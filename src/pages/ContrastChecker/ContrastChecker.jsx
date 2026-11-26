import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import ShareLink from "../../components/ui/ShareLink/ShareLink";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import { contrastRatio, normalizeHex } from "./contrast";
import styles from "./ContrastChecker.module.scss";

const checks = [
  { label: "Normal text", aa: 4.5, aaa: 7 },
  { label: "Large text", aa: 3, aaa: 4.5 },
];

function ColorField({ name, label, value, color, onChange }) {
  const id = `contrast-${name}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputs}>
        <input id={id} type="text" value={value} spellCheck={false}
          aria-invalid={!color} aria-describedby={!color ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)} />
        <input type="color" value={color ?? "#000000"} aria-label={`Pick ${label.toLowerCase()}`}
          onChange={(event) => onChange(event.target.value.toUpperCase())} />
      </div>
      {!color && <p className={styles.error} id={`${id}-error`}>Enter a 3- or 6-digit HEX color.</p>}
    </div>
  );
}

export default function ContrastChecker({ title }) {
  const [params] = useSearchParams();
  const initialText = normalizeHex(params.get("text") ?? "") ?? "#213547";
  const initialBackground = normalizeHex(params.get("background") ?? "") ?? "#FFFFFF";

  return (
    <Tool title={title}>
      <ContrastEditor key={`${initialText}:${initialBackground}`}
        initialText={initialText} initialBackground={initialBackground} />
    </Tool>
  );
}

function ContrastEditor({ initialText, initialBackground }) {
  const [foreground, setForeground] = useState(initialText);
  const [background, setBackground] = useState(initialBackground);
  const textColor = normalizeHex(foreground);
  const backgroundColor = normalizeHex(background);
  const ratio = contrastRatio(foreground, background);

  function swapColors() {
    setForeground(background);
    setBackground(foreground);
  }

  return (
    <>
      <div className={styles.controls}>
        <ColorField name="text" label="Text color" value={foreground} color={textColor} onChange={setForeground} />
        <ColorField name="background" label="Background color" value={background} color={backgroundColor} onChange={setBackground} />
        <Button className={styles.swap} onClick={swapColors}>Swap colors</Button>
      </div>
      <ShareLink settings={ratio !== null ? { text: textColor, background: backgroundColor } : null} />
      {ratio !== null && (
        <>
          <div className={styles.preview} style={{ color: textColor, backgroundColor }}>
            <p className={styles.large}>Large text preview</p>
            <p>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <section className={styles.results} aria-labelledby="contrast-results">
            <h2 id="contrast-results">Contrast ratio</h2>
            <output>{(Math.floor(ratio * 100) / 100).toFixed(2)}:1</output>
            <table>
              <thead><tr><th scope="col">Text size</th><th scope="col">AA</th><th scope="col">AAA</th></tr></thead>
              <tbody>
                {checks.map(({ label, aa, aaa }) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {[aa, aaa].map((threshold, index) => (
                      <td key={index} className={ratio >= threshold ? styles.pass : styles.error}>
                        {ratio >= threshold ? "Pass" : "Fail"} <small>≥ {threshold}:1</small>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.note}>Large text is at least 24 CSS px, or about 18.7 CSS px when bold.</p>
          </section>
          <div className={styles.export}>
            <TextPanel label="CSS variables" rows={4} copyLabel="Copy CSS"
              value={`:root {\n  --color-text: ${textColor};\n  --color-background: ${backgroundColor};\n}`} />
          </div>
        </>
      )}
    </>
  );
}
