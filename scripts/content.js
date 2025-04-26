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

// Function to create the overlay
function createDrawer(extractedTexts) {
  const drawer = document.createElement("div");
  Object.assign(drawer.style, {
    position: "fixed",
    top: "0",
    right: "-400px",
    width: "400px",
    height: "95%",
    backgroundColor: "rgba(13, 9, 9, 0.9)",
    color: "white",
    borderLeft: "1px solid #ccc",
    padding: "10px",
    zIndex: "9999",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    transition: "right 0.3s ease",
  });
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-labelledby", "drawer-header");
  drawer.setAttribute("aria-hidden", "true");

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "9998",
  });
  overlay.setAttribute("aria-hidden", "true");

  overlay.addEventListener("click", () => {
    closeDrawer(drawer, overlay);
  });

  const header = document.createElement("h2");
  header.textContent = "Transcript";
  header.id = "drawer-header";
  Object.assign(header.style, {
    margin: "0",
    padding: "10px",
    fontSize: "1.2em",
    textAlign: "center",
    borderBottom: "1px solid #ccc",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: "10px",
  });
  drawer.appendChild(header);

  const content = document.createElement("div");
  content.textContent = extractedTexts.join("\n");
  Object.assign(content.style, {
    flex: "1",
    overflowY: "auto",
  });
  content.setAttribute("tabindex", "0");
  drawer.appendChild(content);

  const controlsContainer = document.createElement("div");
  Object.assign(controlsContainer.style, {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  });

  const closeButton = createButton("X", {
    backgroundColor: "grey",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  }, () => {
    closeDrawer(drawer, overlay);
  });
  closeButton.setAttribute("aria-label", "Close drawer");
  drawer.appendChild(closeButton);

  const copyButton = createButton("Copy Text", {
    backgroundColor: "white",
    color: "black",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  }, () => {
    navigator.clipboard.writeText(extractedTexts.join("\n"))
      .then(() => createToast("Text copied to clipboard!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  });
  copyButton.setAttribute("aria-label", "Copy transcript text");
  controlsContainer.appendChild(copyButton);

  const openChatGPTButton = createButton("Open ChatGPT", {
    backgroundColor: "white",
    color: "black",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  }, () => {
    navigator.clipboard.writeText(extractedTexts.join("\n")).then(() => {
      window.open("https://chat.openai.com/", "_blank");
    });
  });
  openChatGPTButton.setAttribute("aria-label", "Open ChatGPT in a new tab");
  controlsContainer.appendChild(openChatGPTButton);

  const openPromptSplitterButton = createButton("Open Prompt Splitter", {
    backgroundColor: "white",
    color: "black",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  }, () => {
    window.open("https://chatgpt-prompt-splitter.jjdiaz.dev/", "_blank");
  });
  openPromptSplitterButton.setAttribute("aria-label", "Open Prompt Splitter in a new tab");
  controlsContainer.appendChild(openPromptSplitterButton);

  drawer.appendChild(controlsContainer);
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // Slide in the drawer
  setTimeout(() => {
    drawer.style.right = "0";
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    drawer.focus();
  }, 10);

  return drawer;
}

function closeDrawer(drawer, overlay) {
  drawer.style.right = "-400px";
  drawer.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    drawer.remove();
    overlay.remove();
  }, 300);
  console.log("Drawer closed.");
}
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
    console.log(
      "Script not initialized: Not on a YouTube video page with query parameters."
    );
    return;
  }

  let overlay; // Declare overlay variable here for later reference

  try {
    const expander = await waitForElement("#expand");
    console.log("Expander found.");
    expander.click();

    const showTranscriptButton = await waitForElement(
      'button[aria-label="Show transcript"]'
    );
    showTranscriptButton.click();

    const container = await waitForElement("#segments-container");
    const segments = container.querySelectorAll(
      "yt-formatted-string.segment-text.style-scope.ytd-transcript-segment-renderer"
    );

    const extractedTexts = Array.from(segments).map((segment) =>
      segment.textContent.trim()
    );

    overlay = createDrawer(extractedTexts);

    // Send the extracted text to the side panel
    sendContentToSidePanel(extractedTexts.join("\n"));

    // Add event listener to remove overlay on navigation
    window.addEventListener("popstate", () => {
      if (overlay) {
        overlay.remove();
        console.log("Overlay removed due to navigation.");
      }
    });
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
