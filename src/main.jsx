import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToolFavoritesProvider } from "./api/toolFavorites";
import "./index.css";
import "./reset.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToolFavoritesProvider>
      <App />
    </ToolFavoritesProvider>
  </BrowserRouter>
);
