chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickai-menu",
    title: "Ask Quick AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickai-menu" && info.selectionText) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "show-quickai",
          selectedText: info.selectionText,
        });
      }
    );
  }
});
