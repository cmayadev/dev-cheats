import { useEffect, useRef, useState } from "react";
import { generatePassword } from "../../api/password-generator";
import Button from "../../components/ui/Button/Button";
import Tool from "../../components/layout/Tool/Tool";
import styles from "./Passwords.module.scss";

const options = [
  { key: "uppercase", label: "Uppercase", example: "A–Z" },
  { key: "numbers", label: "Numbers", example: "0–9" },
  { key: "symbols", label: "Symbols", example: "@#$" },
];

const strengthLabels = {
  veryWeak: "Very weak",
  weak: "Weak",
  medium: "Moderate",
  strong: "Strong",
  veryStrong: "Very strong",
};

function createPassword({ length, uppercase, numbers, symbols }) {
  return generatePassword(length, uppercase, numbers, symbols);
}

export default function Passwords({ title }) {
  const [settings, setSettings] = useState({
    length: 12,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState(() => createPassword(settings));
  const passwordField = useRef(null);
  const [feedback, setFeedback] = useState(null);
  const copyMessage = feedback?.password === password ? feedback : null;
  const worker = useRef(null);
  const [assessment, setAssessment] = useState(null);
  const [strengthUnavailable, setStrengthUnavailable] = useState(false);
  const strength = assessment?.password === password ? assessment.strength : undefined;

  useEffect(() => {
    let checker;
    try {
      checker = new Worker(new URL("./passwordStrength.worker.js", import.meta.url), { type: "module" });
    } catch {
      setStrengthUnavailable(true);
      return;
    }

    worker.current = checker;
    checker.onmessage = ({ data }) => setAssessment(data);
    checker.onerror = () => {
      checker.terminate();
      worker.current = null;
      setStrengthUnavailable(true);
    };
    return () => {
      checker.terminate();
      worker.current = null;
    };
  }, []);

  useEffect(() => {
    worker.current?.postMessage(password);
  }, [password]);

  function updateSettings(changes) {
    const next = { ...settings, ...changes };
    setSettings(next);
    setPassword(createPassword(next));
    setFeedback(null);
  }

  function randomizeOptions() {
    updateSettings({
      uppercase: Math.random() >= 0.5,
      numbers: Math.random() >= 0.5,
      symbols: Math.random() >= 0.5,
    });
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setFeedback({ password, message: "Copied to clipboard." });
    } catch {
      if (passwordField.current?.value === password) {
        passwordField.current.focus();
        passwordField.current.select();
      }
      setFeedback({ password, error: true, message: "Clipboard unavailable. Copy the selected text manually." });
    }
  }

  return (
    <Tool title={title}>
      <div className={styles.result}>
        <div className={styles.resultHeader}>
          <label htmlFor="generated-password">Generated password</label>
          <div className={styles.actions}>
            <Button type="primary" onClick={() => {
              setPassword(createPassword(settings));
              setFeedback(null);
            }}>Generate</Button>
            <Button onClick={copyPassword}>Copy</Button>
          </div>
        </div>
        <textarea id="generated-password" ref={passwordField} className={styles.password} rows={1}
          data-long={password.length > 24} value={password} readOnly autoComplete="off" spellCheck={false} />
        <p className={copyMessage?.error ? "tool-error" : "tool-feedback"} role="status">
          {copyMessage?.message}
        </p>
        <div className={styles.strength} data-strength={strength}>
          <span role="status">
            {strength ? `Estimated strength · ${strengthLabels[strength]}`
              : strengthUnavailable ? "Strength estimate unavailable." : "Estimating strength…"}
          </span>
          <div className={styles.segments} aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
        </div>
      </div>

      <div className={styles.length}>
        <label htmlFor="password-length">Length</label>
        <span>{settings.length} characters</span>
        <input id="password-length" type="range" min="8" max="32"
          value={settings.length} aria-valuetext={`${settings.length} characters`}
          onChange={(event) => updateSettings({ length: Number(event.target.value) })} />
      </div>

      <fieldset className={styles.options}>
        <legend>Include</legend>
        <div className={styles.optionList}>
          {options.map(({ key, label, example }) => (
            <label key={key} className={styles.option}>
              <input type="checkbox" checked={settings[key]}
                onChange={(event) => updateSettings({ [key]: event.target.checked })} />
              <span>{label}</span>
              <code aria-hidden="true">{example}</code>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.randomize}>
        <Button onClick={randomizeOptions}>Randomize options</Button>
      </div>
    </Tool>
  );
}
