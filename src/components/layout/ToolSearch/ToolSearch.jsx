import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchTools } from "../../../api/toolSearch";
import styles from "./ToolSearch.module.scss";

export default function ToolSearch() {
  const dialog = useRef(null);
  const input = useRef(null);
  const activeOption = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const results = searchTools(query);
  const navigate = useNavigate();
  const location = useLocation();

  function showSearch() {
    if (!dialog.current.open) {
      setQuery("");
      setActive(0);
      setOpen(true);
      dialog.current.showModal();
    }
    input.current.focus();
  }

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey
          && !event.isComposing && event.key.toLowerCase() === "k") {
        event.preventDefault();
        showSearch();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (dialog.current.open) dialog.current.close();
  }, [location.key]);

  function select(tool) {
    dialog.current.close();
    navigate(`/${tool.category}/${tool.slug}`);
  }

  function handleInputKey(event) {
    if (event.nativeEvent.isComposing || !results.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + direction + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[active]);
    }
  }

  useEffect(() => {
    if (open) activeOption.current?.scrollIntoView({ block: "nearest" });
  }, [active, query, open]);

  return (
    <>
      <button type="button" className={styles.trigger} aria-label="Search tools"
        aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K" onClick={showSearch}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <span>Search</span>
      </button>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="global-tool-search-heading"
        onClose={() => setOpen(false)}>
        <div className={styles.header}>
          <h2 id="global-tool-search-heading">Search tools</h2>
          <button type="button" onClick={() => dialog.current.close()}>Close</button>
        </div>
        <input ref={input} className={styles.input} type="text" role="combobox"
          aria-label="Find a tool" aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
          aria-controls="global-tool-results"
          aria-activedescendant={open && results.length ? `global-tool-option-${active}` : undefined}
          placeholder="Search JSON, colors, CSS…" value={query}
          onKeyDown={handleInputKey}
          onChange={(event) => { setQuery(event.target.value); setActive(0); }} />
        <ul id="global-tool-results" className={styles.results} role="listbox" aria-label="Matching tools"
          hidden={!results.length}>
          {results.map((tool, index) => (
            <li key={tool.slug} ref={index === active ? activeOption : null}
              id={`global-tool-option-${index}`} role="option" aria-selected={index === active}
              className={styles.option} onClick={() => select(tool)}>
              <span aria-hidden="true">{tool.icon}</span>
              <span><strong>{tool.title}</strong><small>{tool.group}</small></span>
            </li>
          ))}
        </ul>
        {!results.length && <p className={styles.empty} role="status">No tools match your search.</p>}
      </dialog>
    </>
  );
}
