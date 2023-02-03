import styles from './Card.module.scss';

const Card = (props) => {

    const { icon, title, description } = props;

    return ( 
        <div className={styles.cardBox}>
            <article className={styles.article}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
                <div className={styles.icon}>{icon}</div>
            </article>
        </div>
    );
}

export default Card;