import { useState } from 'react';
import cx from 'classnames'
import { toast } from 'react-toastify';
import { generatePassword } from "../../api/password-generator";
import { checkPasswordSecurity } from "../../api/password-validator";
import Dice from '/dice.svg';
import Button from '../../components/ui/Button/Button';
import Tool from '../../components/layout/Tool/Tool';

import styles from './Passwords.module.scss'

const Passwords = (props) => {

    const { title } = props;

    const [password, setPassword] = useState("");
    const [security, setSecurity] = useState("empty");
    const [uppercase, setUppercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(false);
    const [size, setSize] = useState(12);


    const refreshPassword = (length, useUppercase, useNumbers, useSymbols) => {
        const nextPassword = generatePassword(length, useUppercase, useNumbers, useSymbols);
        setPassword(nextPassword);
        setSecurity(checkPasswordSecurity(nextPassword));
    };

    const handleSubmit = () => refreshPassword(size, uppercase, numbers, symbols);

    const handleRangeChange = (event) => {
        const length = Number(event.target.value);
        setSize(length);
        refreshPassword(length, uppercase, numbers, symbols);
    };

    const handleRandomize = () => {
        const nextUppercase = Math.random() >= 0.5;
        const nextNumbers = Math.random() >= 0.5;
        const nextSymbols = Math.random() >= 0.5;
        setUppercase(nextUppercase);
        setNumbers(nextNumbers);
        setSymbols(nextSymbols);
        refreshPassword(size, nextUppercase, nextNumbers, nextSymbols);
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
                    aria-label="Password length"
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