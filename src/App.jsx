import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout/Layout";
import Home from "./pages/Home";
import tools from "./api/tools.json";
import "./App.css";

const pages = tools.map((tool) => ({
  title: tool.title,
  path: `/${tool.category}/${tool.slug}`,
  Component: lazy(() => import(`./pages/${tool.component}/${tool.component}.jsx`)),
}));

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("dev-cheats-theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  } catch {
    // Theme selection also works when storage is disabled.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const { pathname } = useLocation();
  const page = pages.find(({ path }) =>
    path === pathname.toLowerCase().replace(/\/+$/, "")
  );

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    document.title = page ? `${page.title} | Dev Cheats` : "Dev Cheats";
    window.scrollTo(0, 0);
  }, [pathname, page]);

  function updateTheme(nextTheme) {
    setTheme(nextTheme);
    try {
      localStorage.setItem("dev-cheats-theme", nextTheme);
    } catch {
      // Keep the chosen theme for this session.
    }
  }

  return (
    <Layout theme={theme} setTheme={updateTheme} sidebar={Boolean(page)}>
      <Suspense fallback={<p className="route-message" role="status">Loading tool…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          {pages.map(({ path, title, Component }) => (
            <Route key={path} path={path} element={<Component title={title} />} />
          ))}
          <Route path="*" element={
            <div className="route-message">
              <h1>Page not found</h1>
              <Link to="/">Browse all tools</Link>
            </div>
          } />
        </Routes>
      </Suspense>
      <ToastContainer autoClose={8000} theme={theme} />
    </Layout>
  );
}
