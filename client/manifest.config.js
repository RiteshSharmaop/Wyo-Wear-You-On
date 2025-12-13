import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  permissions: ["sidePanel", "contentSettings", "storage", "tabs"],
  host_permissions: [
    "http://localhost:4000/*",
    "http://localhost:5173/*",
    "https://openrouter.ai/*",
    "https://api.cloudinary.com/*",
  ],
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  background: {
    service_worker: "src/background.js",
  },
  content_scripts: [
    {
      js: ["src/content/main.jsx"],
      matches: ["https://www.amazon.in/*"],
    },
  ],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
});
