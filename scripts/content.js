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
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Element with selector "${selector}" not found within ${timeout / 1000} seconds`);
}

async function initializeScript() {
  if (!window.location.href.match(/youtube\.com\/watch\?./)) {
    console.log("Script not initialized: Not on a YouTube video page with query parameters.");
    return;
  }

  let overlay; // Declare overlay variable here for later reference

  try {
    const expander = await waitForElement("#expand");
    console.log("Expander found.");
    expander.click();

    const showTranscriptButton = await waitForElement('button[aria-label="Show transcript"]');
    showTranscriptButton.click();

    const container = await waitForElement("#segments-container");
    const segments = container.querySelectorAll(
      "yt-formatted-string.segment-text.style-scope.ytd-transcript-segment-renderer"
    );

    const extractedTexts = Array.from(segments).map((segment) =>
      segment.textContent.trim()
    );

    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "85px";
    overlay.style.right = "5px";
    overlay.style.backgroundColor = "rgba(13, 9, 9, 0.9)";
    overlay.style.color = "white";
    overlay.style.border = "1px solid #ccc";
    overlay.style.padding = "10px";
    overlay.style.zIndex = "1000";
    overlay.style.maxHeight = "70vh";
    overlay.style.overflowY = "auto";
    overlay.style.whiteSpace = "pre-wrap";
    overlay.style.zIndex = "9999";
    overlay.style.width = "400px";
    overlay.textContent = extractedTexts.join(",\n");
    overlay.style.fontSize = "14px";
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';

    const header = document.createElement("h2");
    header.textContent = "Transcript";
    header.style.margin = "0";
    header.style.padding = "10px";
    header.style.fontSize = "1.2em"; // Proportional to the text content
    header.style.textAlign = "center";
    header.style.borderBottom = "1px solid #ccc";
    header.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    header.style.marginBottom = '10px';
    overlay.insertBefore(header, overlay.firstChild); // Add header as the first element

    const controlsContainer = document.createElement("div");
    controlsContainer.style.position = "absolute";
    controlsContainer.style.top = "80px";
    controlsContainer.style.right = "10px";
    controlsContainer.style.display = "flex";
    controlsContainer.style.flexDirection = "column";
    controlsContainer.style.gap = "10px"; // Add spacing between controls

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy Text";
    copyButton.style.backgroundColor = "white";
    copyButton.style.color = "black";
    copyButton.style.border = "none";
    copyButton.style.padding = "5px 10px";
    copyButton.style.cursor = "pointer";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(extractedTexts.join("\n"))
        .then(() => {
          const toast = document.createElement("div");
          toast.textContent = "Text copied to clipboard!";
          toast.style.position = "fixed";
          toast.style.top = "1px";
          toast.style.right = "20px";
          toast.style.fontSize = "14px";
          toast.style.backgroundColor = "white";
          toast.style.color = "black";
          toast.style.padding = "10px 20px";
          toast.style.borderRadius = "5px";
          toast.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
          toast.style.zIndex = "10000";
          document.body.appendChild(toast);

          setTimeout(() => {
            toast.remove();
          }, 3000);
        })
        .catch(err => console.error("Failed to copy text: ", err));
    });

    controlsContainer.appendChild(copyButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.backgroundColor = "white";
    closeButton.style.color = "black";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      overlay.remove();
      console.log("Overlay closed manually.");
    });

    controlsContainer.appendChild(closeButton);

    const fontSizeControls = document.createElement("div");
    fontSizeControls.style.display = "flex";
    fontSizeControls.style.flexDirection = "row";
    fontSizeControls.style.gap = "5px";

    const increaseFontSizeButton = document.createElement("button");
    increaseFontSizeButton.textContent = "+";
    increaseFontSizeButton.style.padding = "5px 10px";
    increaseFontSizeButton.addEventListener("click", () => {
      const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
      overlay.style.fontSize = `${currentFontSize + 2}px`;
    });

    const decreaseFontSizeButton = document.createElement("button");
    decreaseFontSizeButton.textContent = "-";
    decreaseFontSizeButton.style.padding = "5px 10px";
    decreaseFontSizeButton.addEventListener("click", () => {
      const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
      overlay.style.fontSize = `${currentFontSize - 2}px`;
    });

    fontSizeControls.appendChild(increaseFontSizeButton);
    fontSizeControls.appendChild(decreaseFontSizeButton);

    controlsContainer.appendChild(fontSizeControls);

    overlay.appendChild(controlsContainer);

    document.body.appendChild(overlay);

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
