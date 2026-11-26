import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Container/Container";
import { searchTools, toolGroups as groups } from "../../../api/toolSearch";
import styles from "./Tools.module.scss";

export default function Tools() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const matches = searchTools(query).filter((tool) => !category || tool.group === category);

  return (
    <section className={styles.tools} aria-label="Tool catalog">
      <Container size="xl">
        <div className={styles.catalog}>
          <div className={styles.search}>
            <h2>Browse tools</h2>
            <label className={styles.searchLabel} htmlFor="tool-search">Find a tool</label>
            <input id="tool-search" type="search" value={query}
              placeholder="Search JSON, colors, CSS…"
              onChange={(event) => setQuery(event.target.value)} />
            <div className={styles.filters} role="group" aria-label="Tool categories">
              {["", ...groups].map((group) => (
                <button type="button" key={group} aria-pressed={category === group}
                  onClick={() => setCategory(group)}>
                  {group || "All tools"}
                </button>
              ))}
            </div>
            <p className={styles.count} role="status">
              {matches.length ? `${matches.length} ${matches.length === 1 ? "tool" : "tools"}` : "No tools match your search."}
            </p>
          </div>
          {groups.map((group) => {
            const items = matches.filter((tool) => tool.group === group);
            if (!items.length) return null;

            return (
              <section className={styles.group} key={group}>
                <h3>{group}</h3>
                <ul className={styles.items} role="list">
                  {items.map((tool) => (
                    <li key={tool.slug}>
                      <Link to={`/${tool.category}/${tool.slug}`}>
                        <span className={styles.toolTitle}><code aria-hidden="true">{tool.icon}</code>{tool.title}</span>
                        <span className={styles.description}>{tool.description}</span>
                        <span className={styles.arrow} aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
