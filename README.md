YouTube Transcripts Chrome Extension
This repository contains a Chrome extension designed to enhance your YouTube experience by providing advanced transcript functionalities.

Features
Dark Mode: Added support for a dark-themed interface for better visibility and user comfort.
Custom Icons: Updated icons for enhanced UI aesthetics, including minor changes to toast notifications and CSS.
Side Panel Integration: Moved UI elements from the content script to a side panel for better organization and usability:
Displays video transcripts in a dedicated panel.
Updates dynamically based on user actions.
Drawer-based Overlay: Replaced the overlay with a drawer UI:
Dismiss the drawer by clicking outside it.
Includes accessibility improvements such as aria labels for better usability.
Transcript Auto-Download: Automatically downloads YouTube transcripts as .txt files:
Uses a Blob-based solution for generating downloadable text files.
Implements a utility for handling dynamic elements like "Expand" and "Show transcript" buttons.
Prompt Splitter Button: Added a button labeled "Open Prompt Splitter" to the controls:
Opens an external tool for splitting prompts in a new tab.
Installation
Clone this repository:
bash
git clone https://github.com/nvinai/yt-transcripts-chrome.git
Navigate to Chrome extensions page (chrome://extensions/) and enable "Developer Mode."
Click "Load unpacked" and select the repository folder.
Usage
Open a YouTube video.
Access the transcript through the side panel.
Use the toolbar features to interact with transcripts, such as downloading or editing.
Future Roadmap
Enhancements to transcript formatting and customization.
Support for additional video platforms.
Further accessibility improvements.
Contributing
Contributions are welcome! Please open an issue or submit a pull request.

License
This project is licensed under the MIT License.
