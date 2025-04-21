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
 
    // const blob = new Blob([extractedTexts.join("\n")], { type: "text/plain" });
    // // const link = document.createElement("a");
    // // link.href = URL.createObjectURL(blob);
    // // link.download = "transcript.txt";
    // // document.body.appendChild(link);
    // // link.click(); // Automatically trigger the download
    // // URL.revokeObjectURL(link.href); // Clean up the object URL

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.backgroundColor = "rgba(13, 9, 9, 0.9)";
    overlay.style.color = "white";
    overlay.style.border = "1px solid #ccc";
    overlay.style.padding = "10px";
    overlay.style.zIndex = "1000";
    overlay.style.maxHeight = "90vh";
    overlay.style.overflowY = "auto";
    overlay.style.whiteSpace = "pre-wrap";
    overlay.style.zIndex= "9999";
    overlay.style.width= "350px";
    overlay.textContent = extractedTexts.join(",\n");
    overlay.style.fontSize = "14px";
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'row';

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy Text";
    copyButton.style.marginTop = "10px";
    copyButton.style.display = "block";
    copyButton.style.position = "absolute";
    copyButton.style.top = "10px";
    copyButton.style.right = "10px";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(extractedTexts.join("\n"))
        .then(() => {
          const toast = document.createElement("div");
          toast.textContent = "Text copied to clipboard!";
          toast.style.position = "fixed";
          toast.style.top = "5px";
          toast.style.right = "20px";
          toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
          toast.style.color = "white";
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

    overlay.appendChild(copyButton);

    const fontSizeControls = document.createElement("div");
    fontSizeControls.style.position = "absolute";
    fontSizeControls.style.top = "50px";
    fontSizeControls.style.right = "10px";
    fontSizeControls.style.display = "flex";
    fontSizeControls.style.flexDirection = "column";

    const increaseFontSizeButton = document.createElement("button");
    increaseFontSizeButton.textContent = "+";
    increaseFontSizeButton.style.marginBottom = "5px";
    increaseFontSizeButton.addEventListener("click", () => {
      const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
      overlay.style.fontSize = `${currentFontSize + 2}px`;
    });

    const decreaseFontSizeButton = document.createElement("button");
    decreaseFontSizeButton.textContent = "-";
    decreaseFontSizeButton.addEventListener("click", () => {
      const currentFontSize = parseFloat(window.getComputedStyle(overlay).fontSize);
      overlay.style.fontSize = `${currentFontSize - 2}px`;
    });

    fontSizeControls.appendChild(increaseFontSizeButton);
    fontSizeControls.appendChild(decreaseFontSizeButton);

    overlay.appendChild(fontSizeControls);

    document.body.appendChild(overlay);
  } catch (error) {
    console.error(error.message);
  }
}
