document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");
  button.textContent = "View Transcripts";
  Object.assign(button.style, {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  });

  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "viewTranscripts" });
    });
  });

  document.body.appendChild(button);
});