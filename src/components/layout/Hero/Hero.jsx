import Container from '../Container/Container.jsx';

import styles from './Hero.module.scss'

const Hero = () => {
    return ( 
        <div className={styles.hero}>
            <Container size="xl">
            <div className={styles.slogan}>
                <h1 className={styles.name}>
                    <span className={styles.clip} title="Dev Cheats">Dev Cheats</span>
                </h1>
                <p className={styles.text}>Tools for developers</p>
                <p className={styles.tagline}>Boost your development with most used tools.</p>
            </div>
            </Container>
        </div>
    );
}

export default Hero;