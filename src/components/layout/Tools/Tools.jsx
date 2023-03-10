import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import Card from '../../ui/Card/Card';

import tools from '../../../api/tools.json';

import styles from './Tools.module.scss';

const Tools = () => {
    return ( 
        <>
            <div className={styles.tools}>
                <Container size="xl">
                    <div className={styles.items}>
                        {
                            tools.map((tool, i) => tool.featured &&
                                <Link to={tool.category + "/" + tool.slug} key={i}>
                                    <Card key={i} icon={tool.icon} title={tool.title} description={tool.description} />
                                </Link>
                            )
                        }
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Tools;