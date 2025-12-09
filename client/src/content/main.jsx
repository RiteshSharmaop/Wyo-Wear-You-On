import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App.jsx";

console.log("[CRXJS] Hello world from content script!");

// ----------------------------
// 0. Auto-capture Amazon product image on page load
// ----------------------------
const captureAmazonImage = () => {
  // Try multiple selectors for Amazon product images
  const selectors = [
    "#imgTagWrapperId img",
    "#landingImage",
    ".a-dynamic-image",
    "img[data-a-dynamic-image]",
    "[data-feature-name='dp-image'] img",
    ".imageThumbnail img",
    "#imageBlock img",
  ];

  let imageUrl = null;
  for (const selector of selectors) {
    const img = document.querySelector(selector);
    if (img) {
      imageUrl = img.src || img.getAttribute("data-old-hires");
      if (!imageUrl && img.style.backgroundImage) {
        imageUrl = img.style.backgroundImage.replace(
          /url\(["']?([^"')]+)["']?\)/,
          "$1"
        );
      }
      if (imageUrl) break;
    }
  }

  if (imageUrl) {
    chrome.storage.local.set({ productImage: imageUrl });
    console.log("[CRXJS] Product image captured:", imageUrl);
  }
};

// Capture image when page loads
document.addEventListener("DOMContentLoaded", captureAmazonImage);

// Also try to capture immediately in case DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", captureAmazonImage);
} else {
  captureAmazonImage();
}

// Re-capture when dynamic images load (for lazy-loaded images)
const imageObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length && mutation.type === "childList") {
      // Check if Amazon product image container was updated
      const imageContainers = document.querySelectorAll(
        "#imgTagWrapperId, #landingImage, .a-dynamic-image, [data-feature-name='dp-image']"
      );
      if (imageContainers.length > 0) {
        captureAmazonImage();
        break;
      }
    }
  }
});

// Watch for changes in the main Amazon image container
const targetNode = document.body;
if (targetNode) {
  imageObserver.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}

// ----------------------------
// Handle retry request from ProcessView
// ----------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "retryProductImage") {
    // Capture image and send back to ProcessView
    const captureAndReturn = () => {
      const selectors = [
        "#imgTagWrapperId img",
        "#landingImage",
        ".a-dynamic-image",
        "img[data-a-dynamic-image]",
        "[data-feature-name='dp-image'] img",
        ".imageThumbnail img",
        "#imageBlock img",
      ];

      let imageUrl = null;
      for (const selector of selectors) {
        const img = document.querySelector(selector);
        if (img) {
          imageUrl = img.src || img.getAttribute("data-old-hires");
          if (!imageUrl && img.style.backgroundImage) {
            imageUrl = img.style.backgroundImage.replace(
              /url\(["']?([^"')]+)["']?\)/,
              "$1"
            );
          }
          if (imageUrl) break;
        }
      }

      if (imageUrl) {
        chrome.storage.local.set({ productImage: imageUrl });
        console.log("[CRXJS] Product image re-captured (retry):", imageUrl);
        sendResponse({ success: true, imageUrl });
      } else {
        console.log("[CRXJS] No product image found on this page");
        sendResponse({ success: false, error: "No image found" });
      }
    };

    captureAndReturn();
    return true; // Keep channel open for async response
  }
});

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
