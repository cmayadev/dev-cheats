import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./ShareLink.module.scss";

export default function ShareLink({ settings }) {
  const { pathname } = useLocation();
  const [feedback, setFeedback] = useState(null);
  const link = settings
    ? new URL(`${pathname}?${new URLSearchParams(settings)}`, window.location.origin).href
    : "";
  const current = feedback?.link === link ? feedback : null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setFeedback({ link, message: "Link copied to clipboard." });
    } catch {
      setFeedback({ link, message: "Copy the link below.", manual: true });
    }
  }

  return (
    <div className={styles.share}>
      <Button onClick={copyLink} disabled={!link}>Copy link</Button>
      <span className="tool-feedback" role="status">{current?.message}</span>
      {current?.manual && (
        <input aria-label="Shareable link" value={link} readOnly
          onFocus={(event) => event.currentTarget.select()} />
      )}
    </div>
  );
}
