import styles from './Button.module.scss'

import cx from 'classnames'

const Button = (props) => {

    const { children, type } = props;

    return ( 
        <button className={ cx(styles.btn, styles[type]) } onClick={props.onClick}>
            {children}
        </button>
    );
}

export default Button;