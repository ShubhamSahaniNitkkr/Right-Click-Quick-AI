chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickai",
    title: "Ask QuickAI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickai") {
    chrome.tabs.sendMessage(tab.id, {
      action: "show-quickai",
      selectedText: info.selectionText,
    });
  }
});
