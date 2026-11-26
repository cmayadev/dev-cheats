import Header from '../Header/Header'
import Container from '../Container/Container'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

import styles from './Layout.module.scss'

const Layout = (props) => {

    const { children, theme, setTheme, sidebar } = props;

    return (
        <div className={styles.Layout}>
            <Header theme={theme} setTheme={setTheme} sidebar={sidebar} />
            { 
                sidebar ? 
                <>
                    <Sidebar /> 
                    <main className={`main${sidebar ? ' has-sidebar' : ''}`}>
                        <div className={styles.content}>
                            <Container size="doc">
                                {children}
                            </Container>
                        </div>
                    </main>
                </> :
                <main className={`main${sidebar ? ' has-sidebar' : ''}`}>
                    {children}
                </main>
            }
            <Footer />
        </div>
    )
}

export default Layout