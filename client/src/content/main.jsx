import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App.jsx";

console.log("[CRXJS] Hello world from content script!");

// ----------------------------
// 1. Create container for navbar
// ----------------------------
const container = document.createElement("div");
container.id = "crxjs-app";

// Use sticky so the element stays in DOM flow (pushes Amazon down)
container.style.position = "sticky";
container.style.top = "0";
container.style.left = "0";
container.style.right = "0";
container.style.zIndex = "2147483647";
container.style.width = "100%";
container.style.background = "white"; // prevent transparency issues

// Insert before all site content to push Amazon layout down
document.body.insertBefore(container, document.body.firstChild);

const style = document.createElement("style");
style.id = "crxjs-margin-style";
style.textContent = `
    html, body {
        margin-top: 64px !important;
    }
    
    `;
// #nav-belt,
// #nav-main,
// #navbar,
// #nav-progressive-subnav,
// #nav-xshop-container {
//     margin-top: 40px !important;
// }
document.head.appendChild(style);

// ----------------------------
// 3. Mount your React Navbar
// ----------------------------
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
