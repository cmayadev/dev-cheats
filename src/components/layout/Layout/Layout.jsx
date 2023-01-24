import Header from '../Header/Header'
import Aside from '../Aside/Aside'
import Footer from '../Footer/Footer'

import styles from './Layout.module.scss'

const Layout = (props) => {

    const { children, sidebar } = props;

    return (
        <div className={styles.Layout}>
            <Header />
            { sidebar && <Aside /> }
            {children}
            <Footer />
        </div>
    )
}

export default Layout