

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Example of a listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractText") {
    console.log("Extract text action received");
    console.log("Message from popup:", message);
    sendResponse({ status: "success" });
  }
});