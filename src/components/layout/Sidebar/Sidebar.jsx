import styles from "./Sidebar.module.scss";
import tools from "../../../api/tools.json";
import { NavLink } from "react-router-dom";

const catalog = tools.filter((tool) => !tool.hidden);
const groups = [...new Set(catalog.map((tool) => tool.group))];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sideGroup} aria-label="Tools">
        {groups.map((group) => (
          <div className={styles.categoryGroup} key={group}>
            <h2>{group}</h2>
            <ul>
              {catalog.filter((tool) => tool.group === group).map((tool) => (
                <li key={tool.slug}>
                  <NavLink to={`/${tool.category}/${tool.slug}`}
                    className={({ isActive }) => isActive ? styles.activeLink : undefined}>
                    {tool.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
