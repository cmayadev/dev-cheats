import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button/Button";
import Tool from "../../components/layout/Tool/Tool";
import { encodeImage, scaledHeight, validDimensions } from "./image";
import styles from "./ImageOptimizer.module.scss";

const formats = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg" };
const readableSize = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

function fileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${readableSize.format(bytes / 1024)} KiB`;
  return `${readableSize.format(bytes / 1024 ** 2)} MiB`;
}

function useObjectUrl(blob) {
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setEntry({ blob, url });
    return () => URL.revokeObjectURL(url);
  }, [blob]);
  return entry?.blob === blob ? entry.url : null;
}

function SliderComparison({ sourceUrl, resultUrl, originalDetails, exportDetails }) {
  const [position, setPosition] = useState(50);

  return (
    <figure className={styles.sliderComparison}>
      <figcaption>
        <span><strong>Original</strong><small>{originalDetails}</small></span>
        <span><strong>Export</strong><small>{exportDetails}</small></span>
      </figcaption>
      <div className={styles.sliderViewport} style={{ "--position": `${position}%` }}>
        <img className={styles.sliderOriginal} src={sourceUrl} alt="" />
        <img className={styles.sliderExport} src={resultUrl} alt="" />
        <div className={styles.divider} aria-hidden="true"><span>‹ ›</span></div>
        <input type="range" min="0" max="100" value={position}
          aria-label="Compare original and export"
          aria-valuetext={`${position}% original, ${100 - position}% export`}
          onChange={(event) => setPosition(Number(event.target.value))} />
      </div>
    </figure>
  );
}

function ImageEditor({ file }) {
  const sourceUrl = useObjectUrl(file);
  const image = useRef(null);
  const [source, setSource] = useState(null);
  const [width, setWidth] = useState("");
  const [type, setType] = useState("image/webp");
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("side-by-side");
  const resultUrl = useObjectUrl(result);
  const height = source ? scaledHeight(Number(width), source.width, source.height) : 0;
  const validSize = validDimensions(Number(width), height);

  function readDimensions(event) {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const initialWidth = Math.min(naturalWidth, 8192);
    setSource({ width: naturalWidth, height: naturalHeight });
    setWidth(String(initialWidth));
  }

  function changeSetting(setter, value) {
    setter(value);
    setResult(null);
    setError("");
  }

  async function optimize(event) {
    event.preventDefault();
    if (!validSize || busy) return;
    setBusy(true);
    setResult(null);
    setError("");
    try {
      setResult(await encodeImage(image.current, Number(width), height, type, quality / 100));
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  const difference = result ? file.size - result.size : 0;
  const percent = result && file.size ? readableSize.format(Math.abs(difference) / file.size * 100) : "";
  const filename = `${file.name.replace(/\.[^.]+$/, "") || "image"}-optimized.${formats[type]}`;
  const originalDetails = `${fileSize(file.size)}${source ? ` · ${source.width} × ${source.height} px` : ""}`;
  const exportDetails = result ? `${fileSize(result.size)} · ${width} × ${height} px` : "Preview pending";
  const showSlider = Boolean(resultUrl) && mode === "slider";


  return (
    <>
      {source && (
        <form onSubmit={optimize} className={styles.form} noValidate>
          <fieldset disabled={busy}>
            <legend>Export settings</legend>
            <div className={styles.settings}>
              <label>Width (px)
                <input type="number" value={width} min="1" max="8192" step="1"
                  aria-invalid={!validSize} aria-describedby="image-dimensions"
                  onChange={(event) => changeSetting(setWidth, event.target.value)} />
              </label>
              <label>Format
                <select value={type} onChange={(event) => changeSetting(setType, event.target.value)}>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
              </label>
              {type !== "image/png" && (
                <label>Quality · {quality}%
                  <input type="range" min="1" max="100" value={quality}
                    onChange={(event) => changeSetting(setQuality, Number(event.target.value))} />
                </label>
              )}
            </div>
            <p id="image-dimensions" className={validSize ? styles.note : styles.error}>
              {validSize ? `Output dimensions: ${width} × ${height} px` : "Use whole pixels, up to 8192 px per side and 16 megapixels total."}
            </p>
            {type === "image/jpeg" && <p className={styles.note}>Transparent areas become white in JPEG.</p>}
            <Button type="primary" htmlType="submit" disabled={!validSize}>
              {busy ? "Optimizing…" : "Optimize image"}
            </Button>
          </fieldset>
        </form>
      )}
      {error && <p role="alert" className="tool-error">{error}</p>}
      <section className={styles.comparison} aria-label="Image comparison" aria-busy={busy}>
        {resultUrl && (
          <div className={styles.viewOptions} role="group" aria-label="Comparison view">
            <Button aria-pressed={mode === "side-by-side"} onClick={() => setMode("side-by-side")}>
              Side by side
            </Button>
            <Button aria-pressed={mode === "slider"} onClick={() => setMode("slider")}>Slider</Button>
          </div>
        )}
        {showSlider && <SliderComparison sourceUrl={sourceUrl} resultUrl={resultUrl}
          originalDetails={originalDetails} exportDetails={exportDetails} />}
        <div className={styles.previews} hidden={showSlider}>
          <figure>
            <figcaption>
              <strong>Original</strong>
              <span>{originalDetails}</span>
            </figcaption>
            <div className={styles.viewport}>
              {sourceUrl && (
                <img ref={image} src={sourceUrl} alt="Original image preview"
                  onLoad={readDimensions} onError={() => setError("This image could not be opened.")} />
              )}
            </div>
          </figure>
          <figure>
            <figcaption>
              <strong>Export</strong>
              <span>{exportDetails}</span>
            </figcaption>
            <div className={styles.viewport}>
              {resultUrl
                ? <img src={resultUrl} alt="Optimized image preview" />
                : <p>{busy ? "Preparing export…" : "Optimize the image to compare results."}</p>}
            </div>
          </figure>
        </div>
        <div className={styles.result}>
          <p role="status">
            {resultUrl && (difference === 0 ? "Same file size"
              : `${percent}% ${difference > 0 ? "smaller" : "larger"} · ${fileSize(Math.abs(difference))} ${difference > 0 ? "saved" : "added"}`)}
          </p>
          {resultUrl && (
            <a className={styles.primary} download={filename} href={resultUrl}>
              Download {type === "image/jpeg" ? "JPEG" : formats[type].toUpperCase()}
            </a>
          )}
        </div>
      </section>
    </>
  );
}

export default function ImageOptimizer({ title }) {
  const [selection, setSelection] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  function select(file) {
    if (!file) return;
    if (!Object.hasOwn(formats, file.type)) {
      setError("Choose a WebP, PNG, or JPEG file.");
      return;
    }
    setError("");
    setSelection((previous) => ({ file, id: (previous?.id ?? 0) + 1 }));
  }

  return (
    <Tool title={title}>
      <p className={styles.note}>Animated images export as a single frame.</p>
      <div className={`${styles.drop} ${dragging ? styles.dragging : ""}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          select(event.dataTransfer.files[0]);
        }}>
        <label htmlFor="optimizer-file">Drop a WebP, PNG or JPEG here, or choose a file</label>
        <input id="optimizer-file" type="file" accept="image/webp,image/png,image/jpeg"
          onChange={(event) => {
            select(event.target.files[0]);
            event.target.value = "";
          }} />
        {selection && <p className={styles.note}>{selection.file.name}</p>}
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {selection && <ImageEditor key={selection.id} file={selection.file} />}
    </Tool>
  );
}
