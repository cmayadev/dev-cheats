import { useState } from "react";
import { NavLink } from "react-router-dom";
import { searchTools, toolGroups } from "../../../api/toolSearch";
import styles from "./Sidebar.module.scss";

const catalog = searchTools("");

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <button className={styles.toggle} type="button" aria-expanded={expanded}
        aria-controls="tool-navigation" onClick={() => setExpanded(!expanded)}>
        Browse tools <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <nav id="tool-navigation" className={styles.sideGroup} data-expanded={expanded} aria-label="Tools">
        {toolGroups.map((group) => (
          <div className={styles.categoryGroup} key={group}>
            <h2>{group}</h2>
            <ul>
              {catalog.filter((tool) => tool.group === group).map((tool) => (
                <li key={tool.slug}>
                  <NavLink to={`/${tool.category}/${tool.slug}`} onClick={() => setExpanded(false)}
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
