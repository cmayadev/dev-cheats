import { createContext, useContext, useEffect, useState } from "react";
import { searchTools } from "./toolSearch";

const storageKey = "dev-cheats-favorite-tools";
const catalog = new Map(searchTools("").map((tool) => [tool.slug, tool]));
const FavoritesContext = createContext(null);

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(stored)) return [...new Set(stored.filter((slug) => catalog.has(slug)))];
  } catch {
    // Favorites still work for this session when storage is unavailable.
  }
  return [];
}

export function ToolFavoritesProvider({ children }) {
  const [slugs, setSlugs] = useState(readFavorites);

  useEffect(() => {
    function sync(event) {
      if (event.key === storageKey || event.key === null) setSlugs(readFavorites());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function toggleFavorite(slug) {
    const next = slugs.includes(slug) ? slugs.filter((entry) => entry !== slug) : [...slugs, slug];
    setSlugs(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Keep the updated favorites in memory.
    }
  }

  return (
    <FavoritesContext.Provider value={{ slugs, favorites: slugs.map((slug) => catalog.get(slug)), toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useToolFavorites() {
  return useContext(FavoritesContext);
}
