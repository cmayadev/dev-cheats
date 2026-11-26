import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Hero.module.scss";

const previews = [
  { id: "json", label: "JSON", title: "JSON Formatter", path: "/tools/json-formatter" },
  { id: "color", label: "Color", title: "Color Converter", path: "/converters/color-converter" },
  { id: "css", label: "CSS", title: "CSS Clamp Generator", path: "/tools/css-clamp" },
];

const swatches = ["#FFF4CF", "#F8DF8A", "#F3CC54", "#A27A1C", "#5C4515"];

function PreviewContent({ id }) {
  if (id === "color") {
    return (
      <div className={styles.palette}>
        <code>{swatches[2]}</code>
        <div aria-label="Amber color palette">
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
    <div className={styles.jsonPreview}>
      <code className={styles.rawJson}>{'{"name":"Dev Cheats","tools":["JSON","CSS"]}'}</code>
      <pre className={styles.code}><code>{'{\n  '}<span>"name"</span>{': '}<em>"Dev Cheats"</em>{',\n  '}<span>"tools"</span>{': ['}<em>"JSON"</em>{', '}<em>"CSS"</em>{']\n}'}</code></pre>
    </div>
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
            <h1 id="home-heading">Everyday tools for developers.</h1>
            <p>Format JSON, fine-tune colors and CSS, and optimize images right in your browser.</p>
            <a className={styles.cta} href="#tool-search">Browse tools <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.showcase}>
            <div className={styles.selectors} role="group" aria-label="Tool previews">
              {previews.map(({ id, label }, index) => (
                <button type="button" key={id} aria-pressed={selected === index}
                  onClick={() => setSelected(index)}>{label}</button>
              ))}
            </div>
            <Link to={preview.path} className={styles.preview}>
              <div className={styles.previewHeader}>
                <span>{preview.title}</span>
                <span className={styles.open}>Open tool <span aria-hidden="true">↗</span></span>
              </div>
              <PreviewContent key={preview.id} id={preview.id} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
