// This is the content script for the Chrome extension
// Extracts text from elements with the class 'segment-text'

document.addEventListener("DOMContentLoaded", () => {
 // verify if the website is youtube.com
 const isYouTube = window.location.hostname === "www.youtube.com";
 if (!isYouTube) {
   console.log("This script only runs on YouTube.");
   return;
 }

 function extractText() {
  const expander = document.getElementById('expand');
  if (expander) {
    console.log("Expander not found.");
    expander.click();
  }

  const showTranscriptButton = document.querySelector('button[aria-label="Show transcript"]');
  if (showTranscriptButton) {
    console.log("🚀 ~ extractText ~ showTranscriptButton:", showTranscriptButton)
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

extractText();
});