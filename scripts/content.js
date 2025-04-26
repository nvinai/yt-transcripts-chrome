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
function createOverlay(extractedTexts) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "85px",
    right: "5px",
    backgroundColor: "rgba(13, 9, 9, 0.9)",
    color: "white",
    border: "1px solid #ccc",
    padding: "10px",
    zIndex: "9999",
    maxHeight: "70vh",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    width: "400px",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
  });
  overlay.textContent = extractedTexts.join(",\n");

  const header = document.createElement("h2");
  header.textContent = "Transcript";
  Object.assign(header.style, {
    margin: "0",
    padding: "10px",
    fontSize: "1.2em",
    textAlign: "center",
    borderBottom: "1px solid #ccc",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: "10px",
  });
  overlay.insertBefore(header, overlay.firstChild);

  const controlsContainer = document.createElement("div");
  Object.assign(controlsContainer.style, {
    position: "absolute",
    top: "80px",
    right: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  });

  const closeButton = createButton("x", {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "30px",
    height: "30px",
    backgroundColor: "grey",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }, () => {
    overlay.remove();
    console.log("Overlay closed manually.");
  });
  overlay.appendChild(closeButton);

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
  controlsContainer.appendChild(openPromptSplitterButton);

  const fontSizeControls = document.createElement("div");
  Object.assign(fontSizeControls.style, {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
  });

  const increaseFontSizeButton = createButton("+", {
    padding: "5px 10px",
  }, () => {
    const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
    overlay.style.fontSize = `${currentFontSize + 2}px`;
  });

  const decreaseFontSizeButton = createButton("-", {
    padding: "5px 10px",
  }, () => {
    const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
    overlay.style.fontSize = `${currentFontSize - 2}px`;
  });

  fontSizeControls.appendChild(increaseFontSizeButton);
  fontSizeControls.appendChild(decreaseFontSizeButton);
  controlsContainer.appendChild(fontSizeControls);

  overlay.appendChild(controlsContainer);
  document.body.appendChild(overlay);

  return overlay;
}

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

    overlay = createOverlay(extractedTexts);

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
