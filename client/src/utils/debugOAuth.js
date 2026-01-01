// Debug helper for OAuth implementation
// This file helps diagnose OAuth issues

export const debugOAuth = {
  checkGoogleAPI: () => {
    console.log("=== Google API Debug ===");
    console.log("window.google exists:", !!window.google);
    if (window.google) {
      console.log("google.accounts exists:", !!window.google.accounts);
      if (window.google.accounts) {
        console.log("google.accounts.id exists:", !!window.google.accounts.id);
      }
    }
  },

  checkClientId: (clientId) => {
    console.log("=== Client ID Debug ===");
    console.log("Client ID:", clientId);
    console.log(
      "Client ID is valid:",
      !!clientId && typeof clientId === "string"
    );
  },

  checkButtonContainer: (containerId) => {
    console.log("=== Button Container Debug ===");
    const container = document.getElementById(containerId);
    console.log(`Container #${containerId} exists:`, !!container);
    if (container) {
      console.log("Container HTML:", container.innerHTML);
      console.log("Container style:", window.getComputedStyle(container));
    }
  },

  checkAllOAuth: (clientId, loginButtonId, signupButtonId) => {
    console.log("=== Full OAuth Debug Report ===");
    debugOAuth.checkGoogleAPI();
    debugOAuth.checkClientId(clientId);
    debugOAuth.checkButtonContainer(loginButtonId);
    debugOAuth.checkButtonContainer(signupButtonId);
    console.log("=== End Debug Report ===");
  },
};

// Add to window for console access
if (typeof window !== "undefined") {
  window.debugOAuth = debugOAuth;
}
