import styles from './Sidebar.module.scss';

const Sidebar = () => {
    return ( 
        <aside className={styles.sidebar}>
            <div className={styles.head}></div>
            <nav>
                <div className={styles.sideGroup}>
                    Sidebar
                </div>
            </nav>
        </aside>
    );
}

export default Sidebar;