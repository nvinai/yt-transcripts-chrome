chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  // Set the side panel behavior to open when the action icon is clicked
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Example of a listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractText") {
    console.log("Extract text action received");
    console.log("Message from popup:", message);
    sendResponse({ status: "success" });
  }
});

// Listener to handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSidePanel") {
    chrome.storage.session.set({ sidePanelContent: message.content }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting storage:", chrome.runtime.lastError);
      } else {
        console.log("Content successfully stored in session storage:", message.content);
      }
    });
    sendResponse({ status: "contentStored" });
  }
});