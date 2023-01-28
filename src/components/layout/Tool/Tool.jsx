import Heading from '../../ui/Heading/Heading';
import Container from '../../layout/Container/Container';

import styles from './Tool.module.scss'

const Tool = (props) => {

    const { children, title } = props;

    return ( 
        <div className={styles.tool}>
            <Container size="content">
                <Heading level="h2">{title}</Heading>
                {children}
            </Container>
        </div>
    );
}

export default Tool;