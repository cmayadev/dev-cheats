import Container from "../Container/Container";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Container size="xl">
        <div className={styles.banner}>
          <h1>Everyday tools for web developers</h1>
          <p>Format JSON, work with CSS and colors, and optimize images. Right in your browser.</p>
        </div>
      </Container>
    </div>
  );
}
