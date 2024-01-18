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
  const [color, setColor] = useState("#96A4E0");

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
    const enteredColor = event.target.value;
    if (enteredColor.length === 7 && enteredColor.charAt(0) === "#") {
      setColor(enteredColor);
    }
  };

  const handleInputBlur = (event) => {
    const enteredColor = event.target.value;

    if (enteredColor.length === 7 && enteredColor.charAt(0) === "#") {
      setColor(enteredColor);
    } else {
      console.log(
        "Color inválido. Asegúrate de introducir un color válido en formato #RRGGBB."
      );
    }
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
            <div className={styles.methods}>
              <div>
                <span>HEX</span>
                <span>RGB</span>
                <span>HSL</span>
              </div>
              <div>
                <span
                  className={styles.canCopy}
                  onClick={() => copyToClipboard(color)}
                >
                  {color}
                </span>
                <span
                  className={styles.canCopy}
                  onClick={() =>
                    copyToClipboard(`rgb(${rgb.r},${rgb.g},${rgb.b})`)
                  }
                >{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</span>
                <span
                  className={styles.canCopy}
                  onClick={() => copyToClipboard(`hsl(${hsl})`)}
                >
                  {hsl}
                </span>
              </div>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder={color}
              onChange={handleColorChange}
              onBlur={handleInputBlur}
              maxLength={7}
            />
          </div>
        </div>
        <div className={styles.palette}>
          <div className={styles.colorTypes}>
            <div className={styles.colorGroup}>
              <h4>Tints</h4>
              <div>
                {tints.map((tint, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: tint }}
                    onClick={() => copyToClipboard(hslToHex(tint))}
                  >
                    <span>{hslToHex(tint)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h4>Shades</h4>
              <div>
                {shades.map((shade, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: shade }}
                    onClick={() => copyToClipboard(hslToHex(shade))}
                  >
                    <span>{hslToHex(shade)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h4>Tones</h4>
              <div>
                {tones.map((tone, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: tone }}
                    onClick={() => copyToClipboard(hslToHex(tone))}
                  >
                    <span>{hslToHex(tone)}</span>
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
