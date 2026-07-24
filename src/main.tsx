import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Fraunces 600 (Hero-H1) wird NICHT hier importiert: die Datei liegt unter
// public/fonts/fraunces-600.woff2 und wird per @font-face in index.css plus
// <link rel="preload"> in index.html so frueh wie moeglich geladen (siehe
// dort). Das vermeidet einen doppelten Ladevorgang derselben Gewichtsstufe.
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/500-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
