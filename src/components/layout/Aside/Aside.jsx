import styles from './Aside.module.scss'

const Aside = () => {

    return ( 
        <div className={styles.aside}>
            <div className={styles.asideContainer}>
                <div className={styles.asideContent}>
                    <div className={styles.content}>
                        <div className={styles.outlineTitle}>Related</div>
                        <ul>
                            <li>
                                <a href="" className={styles.outlineLink}>Link 1</a>
                                <a href="" className={styles.outlineLink}>Link 2</a>
                                <a href="" className={styles.outlineLink}>Link 3</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Aside;