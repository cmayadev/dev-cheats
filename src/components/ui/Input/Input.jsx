import styles from "./Input.module.scss";

export default function Input({
  abbr, describedBy, inputMode, invalid, label, onChange, size, type, value,
}) {
  return (
    <div className={styles.inputContainer}>
      <input className={styles[`size-${size}`]} type={type} value={value}
        inputMode={inputMode} aria-label={label} aria-invalid={invalid}
        aria-describedby={describedBy} onChange={onChange} />
      {abbr && <abbr className="unit" aria-hidden="true">{abbr}</abbr>}
    </div>
  );
}
