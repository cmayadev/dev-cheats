import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <Link to="/">Dev Cheats</Link>
        <a href="https://github.com/cmayadev/dev-cheats" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  );
}
