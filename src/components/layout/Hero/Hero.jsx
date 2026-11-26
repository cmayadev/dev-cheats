import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Hero.module.scss";

const previews = [
  { id: "json", label: "JSON", title: "JSON Formatter", path: "/tools/json-formatter" },
  { id: "color", label: "Color", title: "Color Converter", path: "/converters/color-converter" },
  { id: "css", label: "CSS", title: "CSS Clamp Generator", path: "/tools/css-clamp" },
];

const swatches = ["#F5DFFF", "#DDB6FF", "#AD83F5", "#8053D5", "#542CAA"];

function PreviewContent({ id }) {
  if (id === "color") {
    return (
      <div className={styles.palette}>
        <code>{swatches[2]}</code>
        <div aria-label="Purple color palette">
          {swatches.map((color) => <span key={color} style={{ background: color }} />)}
        </div>
      </div>
    );
  }

  if (id === "css") {
    return (
      <div className={styles.cssPreview}>
        <strong>Fluid type</strong>
        <code>clamp(1rem, 2vw + .5rem, 2rem)</code>
      </div>
    );
  }

  return (
    <pre className={styles.code}><code>{'{\n  '}<span>"tool"</span>{': '}<em>"JSON Formatter"</em>{',\n  '}<span>"runsIn"</span>{': '}<em>"browser"</em>{',\n  '}<span>"ready"</span>{': '}<b>true</b>{'\n}'}</code></pre>
  );
}

export default function Hero() {
  const [selected, setSelected] = useState(0);
  const preview = previews[selected];

  return (
    <section className={styles.hero} aria-labelledby="home-heading">
      <Container size="xl">
        <div className={styles.banner}>
          <div className={styles.content}>
            <h1 id="home-heading">The web developer’s <span>toolbox.</span></h1>
            <p>Format JSON, fine-tune colors and CSS, and optimize images right in your browser.</p>
            <a className={styles.cta} href="#tool-search">Browse tools <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.showcase}>
            <div className={styles.stage}>
              <div className={styles.layerOne} aria-hidden="true" />
              <div className={styles.layerTwo} aria-hidden="true" />
              <Link key={preview.id} to={preview.path} className={styles.preview} aria-label={`Open ${preview.title}`}>
                <div className={styles.previewHeader}>
                  <span>{preview.title}</span>
                  <span className={styles.open}>Open tool <span aria-hidden="true">↗</span></span>
                </div>
                <PreviewContent id={preview.id} />
              </Link>
            </div>
            <div className={styles.selectors} role="group" aria-label="Tool previews">
              {previews.map(({ id, label }, index) => (
                <button type="button" key={id} aria-pressed={selected === index}
                  onClick={() => setSelected(index)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
