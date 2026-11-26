import styles from "./Card.module.scss";

const Card = (props) => {
  const { icon, title, description } = props;

  return (
    <div className={styles.cardBox}>
      <article className={styles.article}>
        <div className={styles.cardHeader}>
          <div className={styles.icon} aria-hidden="true">{icon}</div>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </div>
        <p className={styles.description}>{description}</p>
      </article>
    </div>
  );
};

export default Card;
