import { Link } from 'react-router-dom';
import cx from 'classnames'

import styles from './Footer.module.scss';

const Footer = () => {
    return ( 
        <>
            <footer>
                <div className={styles.footerGrid}>
                    <div className={styles.logo}>                    
                        <Link to="/" className={styles.title}>Dev Cheats</Link>
                        <p>Tools for your web development.</p>
                        <ul className={styles.socials}>
                            <li>
                                <a href="https://github.com/cmayadev/dev-cheats" className={ cx(styles.icon, styles.github) } target="_blank">
                                    <span>GitHub</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.col1}>
                        <h2 className={styles.category}>Cat 1</h2>
                        <ul className={styles.sections}>
                            <li className={styles.section}>Section 1</li>
                            <li className={styles.section}>Section 2</li>
                            <li className={styles.section}>Section 3</li>
                        </ul>
                    </div>
                    <div className={styles.col2}>
                        <h2 className={styles.category}>Cat 2</h2>
                        <ul className={styles.sections}>
                            <li className={styles.section}>Section 1</li>
                            <li className={styles.section}>Section 2</li>
                            <li className={styles.section}>Section 3</li>
                        </ul>
                    </div>
                    <div className={styles.col3}>
                        <h2 className={styles.category}>Cat 3</h2>
                        <ul className={styles.sections}>
                            <li className={styles.section}>Section 1</li>
                            <li className={styles.section}>Section 2</li>
                            <li className={styles.section}>Section 3</li>
                        </ul>
                    </div>
                    <div className={styles.col4}>
                        <h2 className={styles.category}>Cat 4</h2>
                        <ul className={styles.sections}>
                            <li className={styles.section}>Section 1</li>
                            <li className={styles.section}>Section 2</li>
                            <li className={styles.section}>Section 3</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;