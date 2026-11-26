import { useRef, useState } from "react";
import Button from "../../components/ui/Button/Button";
import TextPanel from "../../components/ui/TextPanel/TextPanel";
import Tool from "../../components/layout/Tool/Tool";
import styles from "./ShadowBuilder.module.scss";

const initialLayer = { x: 0, y: 12, blur: 28, spread: 0, color: "#121512", opacity: 22, inset: false };
const dimensions = [
  ["x", "Horizontal offset", -200, 200],
  ["y", "Vertical offset", -200, 200],
  ["blur", "Blur", 0, 200],
  ["spread", "Spread", -200, 200],
];

function shadowValue({ x, y, blur, spread, color, opacity, inset }) {
  const channels = color.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16));
  return `${inset ? "inset " : ""}${Number(x)}px ${Number(y)}px ${Math.max(0, Number(blur))}px ${Number(spread)}px rgb(${channels.join(" ")} / ${opacity}%)`;
}

export default function ShadowBuilder({ title }) {
  const [layers, setLayers] = useState([{ ...initialLayer, id: 0 }]);
  const [selectedId, setSelectedId] = useState(0);
  const [darkPreview, setDarkPreview] = useState(false);
  const nextId = useRef(1);
  const activeIndex = layers.findIndex(({ id }) => id === selectedId);
  const active = layers[activeIndex];
  const shadows = layers.map(shadowValue);

  function addLayer() {
    const id = nextId.current++;
    setLayers([...layers, { ...initialLayer, id, y: 4, blur: 10, opacity: 15 }]);
    setSelectedId(id);
  }

  function updateLayer(property, value) {
    setLayers(layers.map((layer) => layer.id === selectedId ? { ...layer, [property]: value } : layer));
  }

  function moveLayer(direction) {
    const next = layers.slice();
    const destination = activeIndex + direction;
    [next[activeIndex], next[destination]] = [next[destination], next[activeIndex]];
    setLayers(next);
  }

  function removeLayer() {
    const next = layers.filter(({ id }) => id !== selectedId);
    setLayers(next);
    setSelectedId(next[Math.min(activeIndex, next.length - 1)]?.id ?? null);
  }

  return (
    <Tool title={title}>
      <div className={styles.workspace}>
        <section className={styles.preview} aria-labelledby="shadow-preview">
          <div className={styles.bar}>
            <h2 id="shadow-preview">Preview</h2>
            <div className={styles.actions} role="group" aria-label="Preview background">
              <Button aria-pressed={!darkPreview} onClick={() => setDarkPreview(false)}>Light</Button>
              <Button aria-pressed={darkPreview} onClick={() => setDarkPreview(true)}>Dark</Button>
            </div>
          </div>
          <div className={styles.stage} data-dark={darkPreview}>
            <div className={styles.sample} aria-hidden="true" style={{ boxShadow: shadows.join(", ") || "none" }} />
          </div>
        </section>
        <section className={styles.layers} aria-labelledby="shadow-layers">
          <div className={styles.bar}>
            <h2 id="shadow-layers">Layers</h2>
            <Button onClick={addLayer}>Add layer</Button>
          </div>
          {active ? (
            <>
              <div className={styles.actions} role="group" aria-label="Select layer">
                {layers.map(({ id }, index) => (
                  <Button key={id} aria-pressed={id === selectedId} onClick={() => setSelectedId(id)}>
                    Layer {index + 1}
                  </Button>
                ))}
              </div>
              <div className={styles.fields}>
                {dimensions.map(([key, label, min, max]) => (
                  <label key={key}>
                    {label}
                    <span>
                      <input type="number" min={min} max={max} value={active[key]}
                        onChange={(event) => updateLayer(key, event.target.value)}
                        onBlur={() => updateLayer(key, Math.min(max, Math.max(min, Number(active[key]))))} />
                      <small aria-hidden="true">px</small>
                    </span>
                  </label>
                ))}
                <label className={styles.color}>Color
                  <span>
                    <input type="color" value={active.color}
                      onChange={(event) => updateLayer("color", event.target.value)} />
                    <code aria-hidden="true">{active.color}</code>
                  </span>
                </label>
                <label>
                  Opacity <span className={styles.percent}>{active.opacity}%</span>
                  <input type="range" min="0" max="100" value={active.opacity}
                    aria-label="Opacity" aria-valuetext={`${active.opacity}%`}
                    onChange={(event) => updateLayer("opacity", Number(event.target.value))} />
                </label>
              </div>
              <label className={styles.inset}>
                <input type="checkbox" checked={active.inset}
                  onChange={(event) => updateLayer("inset", event.target.checked)} />
                Inset shadow
              </label>
              <div className={styles.actions}>
                <Button disabled={activeIndex === 0} onClick={() => moveLayer(-1)}>Move up</Button>
                <Button disabled={activeIndex === layers.length - 1} onClick={() => moveLayer(1)}>Move down</Button>
                <Button onClick={removeLayer}>Remove layer</Button>
              </div>
            </>
          ) : <p className="tool-feedback">Add a layer to start building a shadow.</p>}
        </section>
      </div>
      <div className={styles.output}>
        <TextPanel label="CSS" value={`box-shadow: ${shadows.join(",\n  ") || "none"};`}
          rows={Math.min(6, Math.max(2, shadows.length))} copyLabel="Copy CSS" />
      </div>
    </Tool>
  );
}
