import { useEffect, useState } from "react";
import Tool from "../../components/layout/Tool/Tool";

import {
  hexToRgb,
  rgbToHsl,
  copyToClipboard,
  generateTints,
  generateShades,
  generateTones,
} from "../../utils.js";

import styles from "./ColorConverter.module.scss";

const ColorConverter = (props) => {
  const { setSidebar, title } = props;
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setSidebar(true);
  }, [setSidebar, true]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const tints = generateTints(hsl, 5);
  const shades = generateShades(hsl, 5);
  const tones = generateTones(hsl, 5);

  return (
    <Tool title={title}>
      <div className={styles.colorSections}>
        <div className={styles.colorConverter}>
          <div
            className={styles.square}
            onClick={() => document.getElementById("colorPicker").click()}
            style={{ backgroundColor: color }}
          >
            <input
              id="colorPicker"
              type="color"
              value={color}
              onChange={handleColorChange}
              style={{ display: "none" }}
            />
          </div>
          <div className={styles.inputs}>
            <div className={styles.inputGroup}>
              <input type="text" value={color} readOnly />
              <button onClick={() => copyToClipboard(color)}>📋</button>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={`rgb(${rgb.r},${rgb.g},${rgb.b})`}
                readOnly
              />
              <button
                onClick={() =>
                  copyToClipboard(`rgb(${rgb.r},${rgb.g},${rgb.b})`)
                }
              >
                📋
              </button>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" value={hsl} readOnly />
              <button onClick={() => copyToClipboard(hsl)}>📋</button>
            </div>
          </div>
        </div>
        <div className={styles.palette}>
          <div className={styles.colorTypes}>
            <div className={styles.colorGroup}>
              <h3>Tints</h3>
              <div>
                {tints.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}></div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h3>Shades</h3>
              <div>
                {shades.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}></div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h3>Tones</h3>
              <div>
                {tones.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tool>
  );
};

export default ColorConverter;
