import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useToolFavorites } from "../../../api/toolFavorites";
import { searchTools, toolGroups } from "../../../api/toolSearch";
import styles from "./Sidebar.module.scss";

const catalog = searchTools("");

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { favorites } = useToolFavorites();
  const groups = [
    { label: "Favorites", tools: favorites },
    ...toolGroups.map((label) => ({ label, tools: catalog.filter((tool) => tool.group === label) })),
  ];

  return (
    <aside className={styles.sidebar}>
      <button className={styles.toggle} type="button" aria-expanded={expanded}
        aria-controls="tool-navigation" onClick={() => setExpanded(!expanded)}>
        Browse tools <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <nav id="tool-navigation" className={styles.sideGroup} data-expanded={expanded} aria-label="Tools">
        {groups.filter((group) => group.tools.length).map(({ label, tools }) => (
          <div className={styles.categoryGroup} key={label}>
            <h2>{label}</h2>
            <ul>
              {tools.map((tool) => (
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
