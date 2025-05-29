const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const responseBox = document.getElementById("responseBox");

chrome.storage.sync.get(["apiKey", "prompt"], (data) => {
  if (data.apiKey) apiKeyInput.value = data.apiKey;
  if (data.prompt) promptInput.value = data.prompt;
});

document.getElementById("saveBtn").onclick = () => {
  chrome.storage.sync.set(
    {
      apiKey: apiKeyInput.value,
      prompt: promptInput.value,
    },
    () => alert("✅ Saved!")
  );
};
