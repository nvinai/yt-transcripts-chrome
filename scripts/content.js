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
 
    const blob = new Blob([extractedTexts.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    document.body.appendChild(link);
    link.click(); // Automatically trigger the download
    URL.revokeObjectURL(link.href); // Clean up the object URL
  } catch (error) {
    console.error(error.message);
  }
}
