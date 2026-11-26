import cx from "classnames";
import styles from "./Button.module.scss";

export default function Button({ children, type = "secondary", htmlType = "button", className, ...props }) {
  return (
    <button type={htmlType} className={cx(styles.btn, styles[type], className)} {...props}>
      {children}
    </button>
  );
}
