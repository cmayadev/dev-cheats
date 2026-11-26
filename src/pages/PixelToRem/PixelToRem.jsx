import { useState } from "react";
import Input from "../../components/ui/Input/Input";
import Tool from "../../components/layout/Tool/Tool";
import styles from "./PixelToRem.module.scss";

function readNumber(value) {
  if (!value.trim()) return NaN;
  return Number(value.replace(",", "."));
}

export default function PixelToRem({ title }) {
  const [source, setSource] = useState("rem");
  const [value, setValue] = useState("1");
  const [fontSize, setFontSize] = useState("16");
  const [swapped, setSwapped] = useState(false);
  const root = readNumber(fontSize);
  const validRoot = Number.isFinite(root) && root > 0;
  const amount = readNumber(value);
  const result = source === "rem" ? amount * root : amount / root;
  const output = validRoot && Number.isFinite(result)
    ? String(Number(result.toFixed(3))) : "";

  function updateAmount(event, unit) {
    setSource(unit);
    setValue(event.target.value);
  }

  return (
    <Tool title={title}>
      <div className={`${styles.converter} ${swapped ? styles.swapped : ""}`}>
        <Input abbr="rem" label="Value in REM" type="text" inputMode="decimal"
          value={source === "rem" ? value : output}
          onChange={(event) => updateAmount(event, "rem")} />
        <button type="button" className={styles.swap} aria-label="Swap field positions"
          onClick={() => setSwapped(!swapped)}>⇄</button>
        <Input abbr="px" label="Value in pixels" type="text" inputMode="decimal"
          value={source === "px" ? value : output}
          onChange={(event) => updateAmount(event, "px")} />
      </div>
      <div className={styles.toolContainer}>
        <p>Root font size</p>
        <Input abbr="px" label="Root font size in pixels" size="m" type="text"
          inputMode="decimal" value={fontSize} onChange={(event) => setFontSize(event.target.value)}
          invalid={!validRoot} describedBy={validRoot ? undefined : "root-error"} />
        {!validRoot && <p className={styles.error} id="root-error">Enter a root font size greater than zero.</p>}
        {value.trim() && !Number.isFinite(amount) &&
          <p className={styles.error}>Enter a valid length.</p>}
      </div>
    </Tool>
  );
}
