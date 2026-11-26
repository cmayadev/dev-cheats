import { useRef, useState } from "react";
import { optimize } from "svgo/browser";
import Tool from "../../components/layout/Tool/Tool";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import styles from "./SvgOptimizer.module.scss";

const example = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <title>Dev Cheats</title>
  <!-- A simple mark with rounded corners -->
  <rect x="8" y="8" width="112" height="112" rx="24" fill="#f3cc54"/>
  <path id="code-mark" d="M48 45 28 64l20 19m32-38 20 19-20 19M70 40 58 88"
    fill="none" stroke="#21231e" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
</svg>`;
const maxBytes = 1024 * 1024;
const encoder = new TextEncoder();
const sizes = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });
const svgNamespace = "http://www.w3.org/2000/svg";

function imageUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function optimizeSource(input) {
  const originalBytes = encoder.encode(input).length;
  if (!input.trim()) throw new Error("Paste SVG markup or choose an SVG file.");
  if (originalBytes > maxBytes) throw new Error("Choose an SVG smaller than 1 MiB.");

  const doc = new DOMParser().parseFromString(input, "image/svg+xml");
  const root = doc.documentElement;
  if (root.localName !== "svg" || doc.querySelector("parsererror")) {
    throw new Error("Enter a complete, well-formed SVG.");
  }
  if (doc.doctype || (root.namespaceURI && root.namespaceURI !== svgNamespace)) {
    throw new Error("Use a standalone SVG with the standard SVG namespace and no doctype.");
  }

  if (!root.namespaceURI) root.setAttribute("xmlns", svgNamespace);
  const source = root.namespaceURI ? input : new XMLSerializer().serializeToString(root);
  const { data } = optimize(source, {
    plugins: [{
      name: "preset-default",
      params: { overrides: { cleanupIds: false, removeDesc: false } },
    }],
  });
  const optimizedBytes = encoder.encode(data).length;
  return { data, originalBytes, optimizedBytes, originalUrl: imageUrl(source), optimizedUrl: imageUrl(data) };
}

export default function SvgOptimizer({ title }) {
  const [input, setInput] = useState("");
  const [filename, setFilename] = useState("image");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const readVersion = useRef(0);

  function updateInput(value, name = "image") {
    readVersion.current++;
    setInput(value);
    setFilename(name);
    setResult(null);
    setError("");
  }

  async function loadFile(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const version = ++readVersion.current;
    setResult(null);
    setError("");
    if (file.size > maxBytes) {
      setError("Choose an SVG smaller than 1 MiB.");
      return;
    }
    try {
      const markup = await file.text();
      if (version === readVersion.current) {
        updateInput(markup, file.name.replace(/\.svg$/i, "") || "image");
      }
    } catch {
      if (version === readVersion.current) setError("Could not read the SVG file.");
    }
  }

  function optimizeInput() {
    try {
      setResult(optimizeSource(input));
      setError("");
    } catch (error) {
      setResult(null);
      setError(error.message);
    }
  }

  const saved = result ? result.originalBytes - result.optimizedBytes : 0;

  return (
    <Tool title={title}>
      <div className={styles.toolbar}>
        <label htmlFor="svg-file">Open an SVG file</label>
        <input id="svg-file" type="file" accept=".svg,image/svg+xml" onChange={loadFile} />
      </div>
      <div className={styles.columns}>
        <div>
          <TextPanel label="Original SVG" value={input} rows={9} invalid={Boolean(error)}
            describedBy={error ? "svg-error" : undefined} placeholder="Paste SVG markup here"
            action={<Button onClick={() => updateInput(example)}>Load example</Button>}
            onChange={(event) => updateInput(event.target.value, filename)} />
          {error && <p id="svg-error" className="tool-error" role="alert">{error}</p>}
          <div className={styles.actions}>
            <Button type="primary" onClick={optimizeInput}>Optimize SVG</Button>
            <Button onClick={() => updateInput("")} disabled={!input && !error}>Clear</Button>
          </div>
        </div>
        <TextPanel label="Optimized SVG" value={result?.data ?? ""} rows={9} copyLabel="Copy SVG"
          placeholder="Optimized markup will appear here" />
      </div>
      {result && (
        <section className={styles.comparison} aria-label="SVG comparison">
          <div className={styles.columns}>
            <figure>
              <figcaption>Original <span>{sizes.format(result.originalBytes)} B</span></figcaption>
              <img src={result.originalUrl} alt="Original SVG preview" />
            </figure>
            <figure>
              <figcaption>Optimized <span>{sizes.format(result.optimizedBytes)} B</span></figcaption>
              <img src={result.optimizedUrl} alt="Optimized SVG preview" />
            </figure>
          </div>
          <div className={styles.summary}>
            <p role="status">{saved === 0 ? "Same file size"
              : `${sizes.format(Math.abs(saved) / result.originalBytes * 100)}% ${saved > 0 ? "smaller" : "larger"}`}</p>
            <a href={result.optimizedUrl} download={`${filename}-optimized.svg`}>Download SVG</a>
          </div>
        </section>
      )}
    </Tool>
  );
}
