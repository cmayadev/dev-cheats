import styles from './Container.module.scss'

const Container = ({ children, size }) => {
    return ( 
        <div className={styles[`container-` + size]}>
            {children}
        </div>
     );
}

export default Container;