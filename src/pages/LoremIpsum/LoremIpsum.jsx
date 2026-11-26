import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import styles from "./LoremIpsum.module.scss";

const modes = {
  paragraphs: "Paragraphs",
  words: "Words",
  bytes: "Bytes",
  lists: "List items",
};

function generateText(loremIpsum, mode, count) {
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const max = mode === "bytes" || mode === "words" ? 10000 : 1000;

  async function generate(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { loremIpsum } = await import("react-lorem-ipsum");
      setText(generateText(loremIpsum, mode, Number(count)));
    } catch {
      setError("Could not generate text. Try again.");
    } finally {
      setBusy(false);
    }
  }


  return (
    <Tool title={title}>
      <form className={styles.controls} onSubmit={generate}>
        <label>Amount
          <input type="number" disabled={busy} min="1" max={max} step="1" required value={count}
            onChange={(event) => setCount(event.target.value)} />
        </label>
        <label htmlFor="lorem-mode">Format
          <select id="lorem-mode" disabled={busy} value={mode} onChange={(event) => setMode(event.target.value)}>
            {Object.entries(modes).map(([value, label]) =>
              <option key={value} value={value}>{label}</option>
            )}
          </select>
        </label>
        <Button type="primary" htmlType="submit" disabled={busy}>{busy ? "Generating…" : "Generate"}</Button>
      </form>
      {error && <p className="tool-error" role="alert">{error}</p>}
      <TextPanel id="lorem-output" label="Generated text" value={text}
        placeholder="Generated text will appear here" copyLabel="Copy text" prose />
    </Tool>
  );
}
