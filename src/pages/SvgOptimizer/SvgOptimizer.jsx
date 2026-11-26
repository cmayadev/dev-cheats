import { useEffect, useRef, useState } from "react";
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

function prepareSource(input) {
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
  return { source, originalBytes };
}

export default function SvgOptimizer({ title }) {
  const [input, setInput] = useState("");
  const [filename, setFilename] = useState("image");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [download, setDownload] = useState(null);
  const readVersion = useRef(0);
  const worker = useRef(null);

  useEffect(() => () => worker.current?.terminate(), []);

  useEffect(() => {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.data], { type: "application/octet-stream" }));
    setDownload({ result, url });
    return () => URL.revokeObjectURL(url);
  }, [result]);

  function cancelOptimization() {
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
  }

  function updateInput(value, name = "image") {
    readVersion.current++;
    cancelOptimization();
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
    cancelOptimization();
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
    setResult(null);
    setError("");
    try {
      const { source, originalBytes } = prepareSource(input);
      const job = new Worker(new URL("./optimizeSvg.worker.js", import.meta.url), { type: "module" });
      worker.current = job;
      setBusy(true);

      job.onmessage = ({ data: message }) => {
        if (worker.current !== job) return;
        cancelOptimization();
        if (message.error) {
          setError(message.error);
          return;
        }
        const data = message.data;
        setResult({
          data,
          originalBytes,
          optimizedBytes: encoder.encode(data).length,
          originalUrl: imageUrl(source),
          optimizedUrl: imageUrl(data),
        });
      };

      job.onerror = () => {
        if (worker.current !== job) return;
        cancelOptimization();
        setError("Could not run the SVG optimizer. Try again.");
      };

      job.postMessage(source);
    } catch (error) {
      cancelOptimization();
      setError(error.message);
    }
  }

  const saved = result ? result.originalBytes - result.optimizedBytes : 0;

  const downloadUrl = download?.result === result ? download.url : null;

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
            <Button type="primary" onClick={optimizeInput} disabled={busy}>Optimize SVG</Button>
            <span className="tool-feedback" role="status">{busy ? "Optimizing SVG…" : ""}</span>
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
            {downloadUrl && <a href={downloadUrl} download={`${filename}-optimized.svg`}>Download SVG</a>}
          </div>
        </section>
      )}
    </Tool>
  );
}
