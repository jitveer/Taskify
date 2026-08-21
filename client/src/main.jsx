import { createRoot } from "react-dom/client";
import './index.css'
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register'

// Automate update check when service worker detects changes
registerSW({ immediate: true })

createRoot(document.getElementById("root")).render(
  <App />
);