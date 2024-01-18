import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";

import tools from "../../../api/tools.json";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [categories, setCategories] = useState({});

  tools.sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    const newCategories = {};

    tools.forEach((item) => {
      if (newCategories[item.category]) {
        newCategories[item.category].push(item);
      } else {
        newCategories[item.category] = [item];
      }
    });

    setCategories(newCategories);
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.head}></div>
      <nav>
        <div className={styles.sideGroup}>
          {Object.keys(categories).map((category) => (
            <div key={category} className={styles.categoryGroup}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <ul>
                {categories[category].map((tool, index) => (
                  <li key={index}>
                    <NavLink
                      to={`${tool.category}/${tool.slug}`}
                      className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                      }
                    >
                      {tool.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
