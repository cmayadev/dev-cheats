import { useState } from "react";
import { Link } from "react-router-dom";
import Tool from "../../components/layout/Tool/Tool";
import {
  hexToRgb, rgbToHsl, copyToClipboard, generateTints,
  generateShades, generateTones, hslToHex,
} from "../../utils";
import styles from "./ColorConverter.module.scss";

export default function ColorConverter({ title }) {
  const [input, setInput] = useState("#96A4E0");
  const [color, setColor] = useState(input);
  const invalid = !hexToRgb(input.trim());
  const { r, g, b } = hexToRgb(color);
  const hsl = rgbToHsl(r, g, b);
  const formats = { HEX: color, RGB: `rgb(${r}, ${g}, ${b})`, HSL: `hsl(${hsl})` };
  const palette = {
    Tints: generateTints(hsl, 5),
    Shades: generateShades(hsl, 5),
    Tones: generateTones(hsl, 5),
  };

  function updateColor(value) {
    setInput(value);
    const hex = value.trim();
    if (hexToRgb(hex)) setColor(hex.startsWith("#") ? hex : `#${hex}`);
  }

  return (
    <Tool title={title}>
      <div className={styles.colorConverter}>
        <div className={styles.inputs}>
          <label htmlFor="color-hex">HEX color</label>
          <div className={styles.fields}>
            <input id="color-hex" type="text" value={input}
              onChange={(event) => updateColor(event.target.value)}
              spellCheck={false} aria-invalid={invalid}
              aria-describedby={invalid ? "color-error" : undefined} />
            <input type="color" value={color} aria-label="Choose a color"
              onChange={(event) => updateColor(event.target.value)} />
          </div>
          {invalid && <p id="color-error">Enter six hexadecimal digits, e.g. #96A4E0.</p>}
          <dl className={styles.methods}>
            {Object.entries(formats).map(([format, value]) => (
              <div key={format}>
                <dt>{format}</dt>
                <dd><code>{value}</code></dd>
                <dd><button type="button" aria-label={`Copy ${format} ${value}`}
                  onClick={() => copyToClipboard(value)}>Copy</button></dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.sample}>
          <div className={styles.preview} style={{ backgroundColor: color }} aria-hidden="true" />
          <nav className={styles.contrastLinks} aria-label="Check contrast using this color">
            <span>Check contrast</span>
            <div>
              <Link to={`/tools/contrast-checker?text=${encodeURIComponent(color)}`}>As text</Link>
              <Link to={`/tools/contrast-checker?background=${encodeURIComponent(color)}`}>As background</Link>
            </div>
          </nav>
        </div>
      </div>
      {Object.entries(palette).map(([label, colors]) => (
        <section key={label} className={styles.group}>
          <h2>{label}</h2>
          <div className={styles.swatches}>
            {colors.map((value, index) => {
              const hex = hslToHex(value);
              return (
                <button key={index} type="button" style={{ backgroundColor: value }}
                  aria-label={`Copy ${label.toLowerCase()} color ${hex}`}
                  onClick={() => copyToClipboard(hex)}>
                  <code>{hex}</code>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </Tool>
  );
}
