import { useState, useEffect } from 'react';
import cx from 'classnames'
import { toast } from 'react-toastify';
import { generatePassword } from "../../api/password-generator";
import Dice from '/dice.svg';
import Heading from '../../components/ui/Heading/Heading';
import Container from '../../components/layout/Container/Container';

import styles from './Passwords.module.scss'

const Passwords = ({setSidebar}) => {

    const [password, setPassword] = useState("");
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
    };

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
        <div className={styles.content}>
            <Container size="doc">
                <div className={styles.aside}>
                    asdasd
                </div>
                <div className={styles.tool}>
                    <Container size="content">
                        <div>
                            <Heading level="h2">Password Generator</Heading>
                            <div className={styles.password}>
                                {password}
                                <button className={styles.random} onClick={handleRandomize}>
                                    <img src={Dice} alt="Randomize" title="Randomize" />
                                </button>    
                            </div>
        
                            <div className={styles.range}>
                                <input
                                    type="range"
                                    min="8"
                                    max="32"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
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
                                <button className={styles.values} onClick={handleSubmit}>Generate</button>
                                <button className={styles.copy} onClick={handleCopy}>Copy</button>
                            </div>
                        </div>
                    </Container>
                </div>
            </Container>
        </div>
    );
}

export default Passwords;