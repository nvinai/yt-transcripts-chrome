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

// Utility function to create a toast notification
function createToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      top: "1px",
      right: "20px",
      fontSize: "14px",
      backgroundColor: "#34b7eb",
      color: "#f7fdff",
      padding: "10px 20px",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      zIndex: "10000",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

// Copy content to clipboard
function copyToClipboard() {
  const content = document.getElementById('content').textContent;
  navigator.clipboard.writeText(content).then(() => {
    createToast('Text copied to clipboard!');
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

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  chrome.storage.local.set({ darkMode: isDarkMode });
});

// Apply saved dark mode preference
chrome.storage.local.get('darkMode', ({ darkMode }) => {
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
});

document.getElementById('copy-button').addEventListener('click', copyToClipboard);
document.getElementById('chat-button').addEventListener('click', openChatGPT);
document.getElementById('third-button').addEventListener('click', promptSplitAction);