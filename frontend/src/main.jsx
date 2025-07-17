import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { PlaylistProvider } from "./context/PlaylistContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PlaylistProvider>
      <App />
    </PlaylistProvider>
  </BrowserRouter>
);
