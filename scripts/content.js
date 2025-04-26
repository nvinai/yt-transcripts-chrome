if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeScript();
  });
} else {
  initializeScript();
}

async function waitForElement(selector, timeout = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    console.log(`${selector} not found. Retrying ...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Element with selector "${selector}" not found within ${
      timeout / 1000
    } seconds`
  );
}

// Utility function to create a button
function createButton(text, styles, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  Object.assign(button.style, styles);
  button.addEventListener("click", onClick);
  return button;
}

// Utility function to create a toast notification
function createToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    top: "1px",
    right: "20px",
    fontSize: "14px",
    backgroundColor: "white",
    color: "black",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    zIndex: "10000",
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Removed overlay and related UI elements
// Function to send content to the background script
function sendContentToSidePanel(content) {
  chrome.runtime.sendMessage({ action: "updateSidePanel", content }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message to background script:", chrome.runtime.lastError);
    } else {
      console.log("Response from background script:", response);
    }
  });
}

// Example usage: Extracted text can be sent to the side panel
async function initializeScript() {
  if (!window.location.href.match(/youtube\.com\/watch\?./)) {
    console.log("Script not initialized: Not on a YouTube video page with query parameters.");
    return;
  }

  try {
    const expander = await waitForElement("#expand");
    console.log("Expander found.");
    expander.click();

    const showTranscriptButton = await waitForElement('button[aria-label="Show transcript"]');
    showTranscriptButton.click();

    const container = await waitForElement("#segments-container");
    const segments = container.querySelectorAll("yt-formatted-string.segment-text.style-scope.ytd-transcript-segment-renderer");

    const extractedTexts = Array.from(segments).map((segment) => segment.textContent.trim());

    // Send the extracted text to the side panel
    sendContentToSidePanel(extractedTexts.join("\n"));
  } catch (error) {
    console.error(error.message);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "viewTranscripts") {
    initializeScript();
    sendResponse({ status: "drawerOpened" });
  }
});
