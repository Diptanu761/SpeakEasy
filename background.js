console.log("SpeakEasy background script loaded...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Received message:", message);

    if (message.action === "start" || message.action === "stop") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;

            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ["content.js"]
                },
                () => {
                    chrome.tabs.sendMessage(tabs[0].id, message);
                }
            );
        });

        sendResponse({ status: "✅ Message forwarded to content script" });
    } else {
        console.log("🚨 Unknown action:", message.action);
    }
});

function handleCommand(command) {
    console.log("🛠️ Processing command:", command);

    if (command.includes("open new tab")) {
        chrome.tabs.create({ url: "https://www.google.com" });

    } else if (command.includes("close tab")) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) chrome.tabs.remove(tabs[0].id);
        });

    } else if (command.includes("scroll down")) {
        chrome.scripting.executeScript({
            target: { allFrames: true },
            func: () => window.scrollBy(0, 500)
        });

    } else if (command.includes("scroll up")) {
        chrome.scripting.executeScript({
            target: { allFrames: true },
            func: () => window.scrollBy(0, -500)
        });

    } else if (command.startsWith("type")) {
        let textToType = command.replace("type", "").trim();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (text) => {
                        let activeElement = document.activeElement;
                        if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
                            activeElement.value += " " + text;
                        } else {
                            alert("⚠️ Click on a text box before using voice typing...");
                        }
                    },
                    args: [textToType]
                });
            }
        });
    }
}

