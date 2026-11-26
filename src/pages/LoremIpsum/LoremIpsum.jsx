import { useState } from "react";
import { loremIpsum } from "react-lorem-ipsum";
import Tool from "../../components/layout/Tool/Tool";
import styles from "./LoremIpsum.module.scss";

const modes = {
  paragraphs: "Paragraphs",
  words: "Words",
  bytes: "Bytes",
  lists: "List items",
};

function generateText(mode, count) {
  if (mode === "paragraphs") return loremIpsum({ p: count }).join("\n\n");
  if (mode === "lists") {
    return loremIpsum({ p: count, avgSentencesPerParagraph: 1 })
      .map((item) => `- ${item}`).join("\n");
  }

  if (mode === "words") {
    return loremIpsum({ p: count, avgSentencesPerParagraph: 1 })
      .join(" ").split(/\s+/).slice(0, count).join(" ");
  }

  const text = loremIpsum({ p: Math.ceil(count / 32) }).join(" ");
  const bytes = new TextEncoder().encode(text);
  return new TextDecoder().decode(bytes.subarray(0, count), { stream: true });
}

export default function LoremIpsumGenerator({ title }) {
  const [count, setCount] = useState("5");
  const [mode, setMode] = useState("paragraphs");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const max = mode === "bytes" || mode === "words" ? 10000 : 1000;

  function generate(event) {
    event.preventDefault();
    setText(generateText(mode, Number(count)));
    setStatus("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Clipboard unavailable. Select and copy the text manually.");
    }
  }

  return (
    <Tool title={title}>
      <form className={styles.controls} onSubmit={generate}>
        <label>Amount
          <input type="number" min="1" max={max} step="1" required value={count}
            onChange={(event) => setCount(event.target.value)} />
        </label>
        <label htmlFor="lorem-mode">Format
          <select id="lorem-mode" value={mode} onChange={(event) => setMode(event.target.value)}>
            {Object.entries(modes).map(([value, label]) =>
              <option key={value} value={value}>{label}</option>
            )}
          </select>
        </label>
        <button className={styles.primary} type="submit">Generate</button>
      </form>
      <div className={styles.outputHeader}>
        <label htmlFor="lorem-output">Generated text</label>
        <button className={styles.secondary} type="button" disabled={!text} onClick={copy}>Copy text</button>
      </div>
      <textarea id="lorem-output" className={styles.output} value={text} readOnly rows={8} />
      <p className={styles.status} role="status">{status}</p>
    </Tool>
  );
}
