import Container from '../Container/Container';
import Card from '../../ui/Card/Card';

import styles from './Tools.module.scss';

const tools = [
    { icon: "📜", title: "Lorem Ipsum", description: "Generate dummy text for your designs or mockups." },
    { icon: "🔐", title: "Pass Generator", description: "Generate secure passwords for your applications." },
    { icon: "✂️", title: "Url Shortener", description: "Reduce your links to something more comfortable." }
]

const Tools = () => {
    return ( 
        <>
            <div>
                <Container size="xl">
                    <div className={styles.items}>
                        {
                            tools.map((tool, i) => 
                                <Card key={i} icon={tool.icon} title={tool.title} description={tool.description} />
                            )
                        }
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Tools;