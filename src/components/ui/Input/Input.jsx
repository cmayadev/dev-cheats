import styles from './Input.module.scss'

const Input = (props) => {

    const { abbr, decimals, format, size, type, value } = props;

    return ( 
        <div className={styles.inputContainer}>
            <input className={styles[`size-${size}`]} type={type} decimals={decimals} format={format} value={value} onChange={props.onChange} />
            { abbr && <abbr className="unit">{abbr}</abbr> }
        </div>
    );
}

export default Input;