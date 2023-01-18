import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import styles from './Layout.module.scss'

const Layout = ({ children }) => {
    return (
        <div className={styles.Layout}>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Layout