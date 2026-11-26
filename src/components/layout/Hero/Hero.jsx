import Container from "../Container/Container";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Container size="xl">
        <div>
          <h1>Tools for web developers</h1>
          <p>Format JSON, convert CSS units, build color palettes and generate test content.</p>
        </div>
      </Container>
    </div>
  );
}
