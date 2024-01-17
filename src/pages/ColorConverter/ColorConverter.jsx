import { useEffect, useState } from "react";
import Tool from "../../components/layout/Tool/Tool";

import {
  hexToRgb,
  rgbToHsl,
  copyToClipboard,
  generateTints,
  generateShades,
  generateTones,
  hslToHex,
} from "../../utils.js";

import styles from "./ColorConverter.module.scss";

const ColorConverter = (props) => {
  const { setSidebar, title } = props;
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setSidebar(true);
  }, [setSidebar, true]);

  const handleClick = (event) => {
    const clickedElement = event.target;

    if (
      clickedElement.id === "colorDiv" ||
      (clickedElement.parentElement &&
        clickedElement.parentElement.id === "colorDiv")
    ) {
      document.getElementById("colorPicker").click();
    }
  };

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
            id="colorDiv"
            className={styles.square}
            onClick={handleClick}
            style={{ backgroundColor: color }}
          >
            <input
              id="colorPicker"
              type="color"
              value={color}
              onChange={handleColorChange}
              style={{ display: "none" }}
            />
            <div>
              <span onClick={() => copyToClipboard(color)}>{color}</span>
              <span
                onClick={() =>
                  copyToClipboard(`rgb(${rgb.r},${rgb.g},${rgb.b})`)
                }
              >{`rgb(${rgb.r},${rgb.g},${rgb.b})`}</span>
              <span onClick={() => copyToClipboard(hsl)}>{hsl}</span>
            </div>
          </div>
          <div className={styles.inputs}>
            <div className={styles.inputGroup}>
              <input type="text" value={color} />
              <button onClick={() => copyToClipboard(color)}>📋</button>
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
              <h4>Tints</h4>
              <div>
                {tints.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}>
                    <span>{hslToHex(tint)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h4>Shades</h4>
              <div>
                {shades.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}>
                    <span>{hslToHex(tint)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h4>Tones</h4>
              <div>
                {tones.map((tint, index) => (
                  <div key={index} style={{ backgroundColor: tint }}>
                    <span>{hslToHex(tint)}</span>
                  </div>
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
