chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "show-quickai") {
    const selectedText = request.selectedText;

    const existing = document.getElementById("quickai-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "quickai-popup";
    popup.innerHTML = `
      <style>
        #quickai-popup {
          position: fixed;
          top: 100px;
          right: 50px;
          z-index: 999999;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          width: 320px;
          padding: 10px;
          font-family: sans-serif;
        }
        #quickai-popup textarea {
          width: 100%;
          margin-top: 5px;
          padding: 6px;
          font-size: 12px;
          font-family: monospace;
          resize: vertical;
        }
        #quickai-popup button {
          margin: 5px 5px 0 0;
          padding: 6px 10px;
          font-size: 12px;
          cursor: pointer;
        }
        #quickai-close {
          position: absolute;
          top: 0;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
          background: none;
          border: none;
          color: #999;
        }
        #quickai-close:hover {
          color: red;
        }
        #loader {
          margin-top: 5px;
          font-size: 14px;
          color: #666;
          display: none;
        }
      </style>
      <button id="quickai-close">❌</button>
      <div>
        <strong>Prompt + Selection:</strong>
        <textarea id="finalPrompt" readonly></textarea>
        <div id="loader">⏳ Loading...</div>
        <textarea id="aiResponse" rows="6" readonly></textarea>
        <button id="copyBtn">📋 Copy</button>
        <button id="retryBtn">🔁 Retry</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Close button functionality
    document.getElementById("quickai-close").onclick = () => {
      popup.remove();
    };

    async function runAI(text) {
      const loader = document.getElementById("loader");
      const aiResponse = document.getElementById("aiResponse");
      const finalPromptBox = document.getElementById("finalPrompt");

      loader.style.display = "block";
      aiResponse.value = "";

      chrome.storage.sync.get(
        ["apiKey", "prompt"],
        async ({ apiKey, prompt }) => {
          if (!apiKey) {
            alert("Please set your Gemini API key in the extension popup.");
            loader.style.display = "none";
            return;
          }

          const fullPrompt = `${text} \n ${prompt || ""}`.trim();
          finalPromptBox.value = fullPrompt;

          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: fullPrompt }] }],
                }),
              }
            );

            const data = await response.json();
            const reply =
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              `❌ Error in Gemini response: ${JSON.stringify(data)}`;

            aiResponse.value = reply;
            loader.style.display = "none";
            navigator.clipboard.writeText(reply);
            chrome.storage.sync.set({ lastResponse: reply });
          } catch (error) {
            loader.innerText = "❌ Failed to fetch response";
            console.error("Gemini API error:", error);
          }
        }
      );
    }

    runAI(selectedText);

    document.getElementById("copyBtn").onclick = () => {
      const btn = document.getElementById("copyBtn");
      const value = document.getElementById("aiResponse").value;
      navigator.clipboard.writeText(value);
      btn.textContent = "✅ Copied!";
      setTimeout(() => {
        btn.textContent = "📋 Copy";
      }, 1000);
    };

    document.getElementById("retryBtn").onclick = () => {
      runAI(selectedText);
    };
  }
});
