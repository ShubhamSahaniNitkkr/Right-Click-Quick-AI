# RightClickQuickGPT 🚀

RightClickQuickGPT is a simple yet powerful Chrome extension that lets you select any text on a webpage, right-click, and instantly get an AI-generated response using OpenAI’s GPT models.

No copy-pasting. No jumping between tabs. Just quick AI help, right where you need it.

## 🧠 What It Does

- Right-click on any selected text → Click "Ask QuickAI"
- It uses your saved prompt and API key to send the text to OpenAI
- A floating popup appears with:
  - The full prompt used
  - Loader while AI thinks
  - The AI’s response
  - A "Copy" button to grab the result
  - A "Retry" button to regenerate the reply

## 🔧 Setup Instructions

1. Clone or download this repo.
2. Open Chrome and go to `chrome://extensions/`
3. Turn ON **Developer Mode**
4. Click **Load Unpacked** and select the folder where your extension lives
5. Click the extension icon and:
   - Paste your OpenAI API key
   - Set a default prompt (e.g. _"Rewrite this better"_)
6. You're good to go!

## 📁 Folder Structure
├── background.js
├── content.js
├── popup.html
├── popup.js
├── manifest.json
├── styles.css
└── icons/
└── icon128.png