import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Container/Container";
import Card from "../../ui/Card/Card";
import { searchTools } from "../../../api/toolSearch";
import styles from "./Tools.module.scss";

const groups = ["CSS & Design", "Data & Text", "Generators"];
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
                <div className={styles.items}>
                  {items.map((tool) => (
                    <Link to={`/${tool.category}/${tool.slug}`} key={tool.slug} aria-label={tool.title}>
                      <Card icon={tool.icon} title={tool.title} description={tool.description} />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
