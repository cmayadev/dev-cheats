import { useState } from 'react';
import { generatePassword } from "../../api/password-generator";
import Container from '../../components/layout/Container/Container';

import styles from './Passwords.module.scss'

const Passwords = () => {

    const [password, setPassword] = useState("");
    const [uppercase, setUppercase] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [symbols, setSymbols] = useState(false);
    const [size, setSize] = useState(8);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPassword = generatePassword(size, uppercase, numbers, symbols);
        setPassword(newPassword);
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(password);
    };

    return (
        <div className={styles.content}>
            <div className={styles.document}>
                <Container size="xxl">
                    <div>
                        <h1>Password Generator</h1>
                        <div>
                            <div className={styles.password}>
                                <div>{password}</div>
                            </div>
                            <button onClick={handleCopy}>Copy to clipboard</button>
                            <form onSubmit={handleSubmit}>
                                <label>
                                Uppercase
                                <input
                                    type="checkbox"
                                    checked={uppercase}
                                    onChange={() => setUppercase(!uppercase)}
                                />
                                </label>
                                <label>
                                Numbers
                                <input
                                    type="checkbox"
                                    checked={numbers}
                                    onChange={() => setNumbers(!numbers)}
                                />
                                </label>
                                <label>
                                Symbols
                                <input
                                    type="checkbox"
                                    checked={symbols}
                                    onChange={() => setSymbols(!symbols)}
                                />
                                </label>
                                <label>
                                Size
                                <input
                                    type="range"
                                    min="8"
                                    max="16"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                />
                                </label>
                                <button type="submit">Generate Password</button>
                            </form>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Passwords;