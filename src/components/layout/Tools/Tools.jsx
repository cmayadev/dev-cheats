import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import Card from '../../ui/Card/Card';

import styles from './Tools.module.scss';

const tools = [
    { icon: "📜", title: "Lorem Ipsum", link: "/lorem", description: "Generate dummy text for your designs or mockups." },
    { icon: "🔐", title: "Pass Generator", link: "/passwords", description: "Generate secure passwords for your applications." },
    { icon: "✂️", title: "Url Shortener", link: "/url-shortener", description: "Reduce your links to something more comfortable." }
]

const Tools = () => {
    return ( 
        <>
            <div>
                <Container size="xl">
                    <div className={styles.items}>
                        {
                            tools.map((tool, i) => 
                                <Link to={tool.link}>
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