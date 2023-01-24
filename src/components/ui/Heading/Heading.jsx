import styles from './Heading.module.scss'

const Heading = (props) => {

    const { id, level, children } = props;
    const Tag = level;

    return ( 
        <Tag id={id} className={styles.heading}>
            {children}
        </Tag>
    );
}

Heading.defaultProps = {  
    level: "h1"
} 

export default Heading;