import { useState, useEffect } from 'react';
import cx from 'classnames'
import { toast } from 'react-toastify';
import { generatePassword } from "../../api/password-generator";
import { checkPasswordSecurity } from "../../api/password-validator";
import Dice from '/dice.svg';
import Button from '../../components/ui/Button/Button';
import Tool from '../../components/layout/Tool/Tool';

import styles from './Passwords.module.scss'

const Passwords = (props) => {

    const { setSidebar, title } = props;

    const [password, setPassword] = useState("");
    const [security, setSecurity] = useState("empty");
    const [uppercase, setUppercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(false);
    const [size, setSize] = useState(12);

    useEffect(() => {
        setSidebar(true);
    }, [setSidebar, true]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPassword = generatePassword(size, uppercase, numbers, symbols);
        setPassword(newPassword);
        setSecurity(checkPasswordSecurity(newPassword));
    };

    const handleRangeChange = (e) => {
        setSize(e.target.value);
        const newPassword = generatePassword(size, uppercase, numbers, symbols);
        setPassword(newPassword);
        setSecurity(checkPasswordSecurity(newPassword));
    }

    const handleRandomize = () => {
        setUppercase(Math.random() >= 0.5);
        setNumbers(Math.random() >= 0.5);
        setSymbols(Math.random() >= 0.5);
        handleSubmit({ preventDefault: () => {} });
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    };

    return (
        <Tool title={title}>

            <div className={styles.password}>
                {password}
                <button className={styles.random} onClick={handleRandomize}>
                    <img src={Dice} alt="Randomize" title="Randomize" />
                </button>    
            </div>
            
            <div className={ cx(styles.security, styles[security]) }>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={styles.range}>
                <input
                    type="range"
                    min="8"
                    max="32"
                    value={size}
                    onChange={handleRangeChange}
                />
            </div>

            <div className={styles.options}>
                <span> Password length: {size} </span>
                <div>
                    <label className={ cx(styles.control, styles.controlCheckbox) }>
                        A-Z
                        <input
                            type="checkbox"
                            checked={uppercase}
                            onChange={() => setUppercase(!uppercase)}
                        />
                        <div className={styles.control_indicator}></div>
                    </label>
                    <label className={ cx(styles.control, styles.controlCheckbox) }>
                        0-9
                        <input
                            type="checkbox"
                            checked={numbers}
                            onChange={() => setNumbers(!numbers)}
                        />
                        <div className={styles.control_indicator}></div>
                    </label>
                    <label className={ cx(styles.control, styles.controlCheckbox) }>
                        @#$
                        <input
                            type="checkbox"
                            checked={symbols}
                            onChange={() => setSymbols(!symbols)}
                        />
                        <div className={styles.control_indicator}></div>
                    </label>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button type="primary" onClick={handleSubmit}>Generate</Button>
                <Button type="secondary" onClick={handleCopy}>Copy</Button>
            </div>

        </Tool>
    );
}

export default Passwords;