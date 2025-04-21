document.getElementById("extract").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractText
  });
});

function extractText() {
  const expander = document.getElementById('expand');
  if (expander) {
    console.log("🚀 ~ document.addEventListener ~ expander:", expander)
    expander.click();
  }

  const showTranscriptButton = document.querySelector('button[aria-label="Show transcript"]');
  console.log("🚀 ~ document.addEventListener ~ showTranscriptButton:", showTranscriptButton)
  if (showTranscriptButton) {
    console.log("🚀 ~ document.addEventListener ~ expander:", expander)
    showTranscriptButton.click();
  }

  const transcriptRenderer = document.querySelector('#content > ytd-transcript-renderer');
  if (!transcriptRenderer) {
    console.log("🚀 ~ extractText ~ transcriptRenderer:", transcriptRenderer)
    console.log("Transcript renderer not found.");
    return;
  }

  const container = transcriptRenderer.querySelector('#segments-container');
  if (!container) {
    console.log("🚀 ~ extractText ~ container:", container)
    console.log("Segments container not found.");
    return;
  }

  const segments = container.querySelectorAll('yt-formatted-string.segment-text.style-scope.ytd-transcript-segment-renderer');
  console.log("🚀 ~ extractText ~ segments:", segments)
  const extractedTexts = Array.from(segments).map(segment => segment.textContent.trim());
  console.log("🚀 ~ document.addEventListener ~ extractedTexts:", extractedTexts)

  const output = document.createElement('ul');
  extractedTexts.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    output.appendChild(li);
  });
  document.body.appendChild(output);
}