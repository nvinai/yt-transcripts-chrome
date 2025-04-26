// Fetch and display content from chrome.storage.session
chrome.storage.session.get('sidePanelContent', ({ sidePanelContent }) => {
  document.getElementById('content').textContent = sidePanelContent || 'No content available.';
});

// Listen for updates to the content
chrome.storage.session.onChanged.addListener((changes) => {
  if (changes.sidePanelContent) {
    document.getElementById('content').textContent = changes.sidePanelContent.newValue || 'No content available.';
  }
});

// Copy content to clipboard
function copyToClipboard() {
  const content = document.getElementById('content').textContent;
  navigator.clipboard.writeText(content).then(() => {
    alert('Transcript copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Open ChatGPT
function openChatGPT() {
  const content = document.getElementById('content').textContent;
  navigator.clipboard.writeText(content).then(() => {
    window.open('https://chat.openai.com/', '_blank');
  });
}

// Placeholder for the third action
function promptSplitAction() {
  window.open("https://chatgpt-prompt-splitter.jjdiaz.dev/", "_blank");
}

document.getElementById('copy-button').addEventListener('click', copyToClipboard);
document.getElementById('chat-button').addEventListener('click', openChatGPT);
document.getElementById('third-button').addEventListener('click', promptSplitAction);