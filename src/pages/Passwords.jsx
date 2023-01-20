import Container from '../components/layout/Container/Container';

import styles from './Passwords.module.scss'

const Passwords = () => {
    return ( 
        <>
            <div className={styles.content}>
                <Container size="md">Password Generator</Container>
            </div>
        </>
    );
}

export default Passwords;