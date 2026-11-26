import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <Link to="/" className={styles.brand}>Dev Cheats</Link>
        <nav aria-label="Footer">
          <Link to="/">All tools</Link>
          <a href="https://github.com/cmayadev/dev-cheats" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
