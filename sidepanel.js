// Fetch and display content from chrome.storage.session
chrome.storage.session.get('sidePanelContent', ({ sidePanelContent }) => {
  document.getElementById('content').textContent = sidePanelContent || 'No content available.';
});

// Listen for updates to the content
chrome.storage.session.onChanged.addListener((changes) => {
  if (changes.sidePanelContent) {
    console.log("Side panel content updated:", changes.sidePanelContent.newValue);
    document.getElementById('content').textContent = changes.sidePanelContent.newValue || 'No content available.';
  }
});