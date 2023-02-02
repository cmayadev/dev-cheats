import Header from '../Header/Header'
import Aside from '../Aside/Aside'
import Container from '../Container/Container'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

import styles from './Layout.module.scss'

const Layout = (props) => {

    const { children, sidebar } = props;

    return (
        <div className={styles.Layout}>
            <Header sidebar={sidebar} />
            { 
                sidebar ? 
                <>
                    <Sidebar /> 
                    <div className={`main${sidebar ? ' has-sidebar' : ''}`}>
                        <div className={styles.content}>
                            <Container size="doc">
                                <Aside />
                                {children}
                            </Container>
                        </div>
                    </div>
                </> :
                <div className={`main${sidebar ? ' has-sidebar' : ''}`}>
                    {children}
                </div>
            }
            <Footer />
        </div>
    )
}

export default Layout