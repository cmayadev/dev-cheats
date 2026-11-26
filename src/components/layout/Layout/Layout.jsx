import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.scss";

export default function Layout({ children, theme, setTheme, sidebar }) {
  return (
    <div className={styles.layout}>
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <Header theme={theme} setTheme={setTheme} />
      <div className={sidebar ? styles.toolLayout : styles.body}>
        {sidebar && <Sidebar />}
        <main className={styles.main} id="main-content" tabIndex={-1}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
