// Background service worker to handle side panel opening and view switching
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openSidePanel") {
    chrome.sidePanel.open({ tabId: sender.tab.id });
    sendResponse({ success: true });
  }

  // Handle view switching in side panel
  if (
    request.action === "showProfile" ||
    request.action === "showProcess" ||
    request.action === "showLogin"
  ) {
    // Store the current view in storage so side panel can read it
    const viewMap = {
      showProfile: "profile", // Map to "profile" instead of "showProfile"
      showProcess: "showProcess",
      showLogin: "login",
    };

    chrome.storage.session.set({
      currentView: viewMap[request.action] || request.action,
      tabId: sender.tab.id,
    });
    // Open side panel if not already open
    chrome.sidePanel.open({ tabId: sender.tab.id });
    sendResponse({ success: true });
  }
});
