import { Link } from "react-router-dom";
import { useToolFavorites } from "../../../api/toolFavorites";
import tools from "../../../api/tools.json";
import Container from "../Container/Container";
import styles from "./Tool.module.scss";

export default function Tool({ children, title }) {
  const { slugs, toggleFavorite } = useToolFavorites();
  const details = tools.find((tool) => tool.title === title);

  const isFavorite = slugs.includes(details?.slug);

  return (
    <div className={styles.tool}>
      <Container size="content">
        <header className={styles.intro}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">All tools</Link>
            {details && <span><span aria-hidden="true">/</span> {details.group}</span>}
          </nav>
          <div className={styles.titleRow}>
            <h1>{title}</h1>
            {details && !details.hidden && (
              <button type="button" className={styles.favorite}
                aria-label={`Favorite ${title}`} aria-pressed={isFavorite}
                onClick={() => toggleFavorite(details.slug)}>
                <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
              </button>
            )}
          </div>
          {details && <p>{details.description}</p>}
        </header>
        <div className={styles.workspace}>{children}</div>
      </Container>
    </div>
  );
}
