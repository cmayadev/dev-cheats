import styles from "./Card.module.scss";

const Card = (props) => {
  const { icon, title, description } = props;

  return (
    <div className={styles.cardBox}>
      <article className={styles.article}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}>{icon}</div>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.description}>{description}</p>
      </article>
    </div>
  );
};

export default Card;
