import { Link } from "react-router-dom";
import tools from "../../../api/tools.json";
import Container from "../Container/Container";
import styles from "./Tool.module.scss";

export default function Tool({ children, title }) {
  const details = tools.find((tool) => tool.title === title);

  return (
    <div className={styles.tool}>
      <Container size="content">
        <header className={styles.intro}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">All tools</Link>
            {details && <span><span aria-hidden="true">/</span> {details.group}</span>}
          </nav>
          <h1>{title}</h1>
          {details && <p>{details.description}</p>}
        </header>
        <div className={styles.workspace}>{children}</div>
      </Container>
    </div>
  );
}
