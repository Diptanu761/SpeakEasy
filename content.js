console.log("SpeakEasy content script loaded...");

document.addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => console.log("✅ Microphone permission granted."))
        .catch((err) => console.error("❌ Microphone access denied:", err));
});

let recognition;
let isListening = false;

function startListening() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log("✅ Microphone access granted.");

            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => {
                console.log("🎙️ Voice Recognition Started...");
                chrome.storage.local.set({ isListening: true });
            };

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                console.log("🗣️ User said:", transcript);
                chrome.runtime.sendMessage({ action: "processCommand", command: transcript });
            };

            recognition.onerror = (event) => {
                console.error("❌ Speech recognition error:", event.error);
                if (event.error === "not-allowed") {
                    alert("⚠️ Microphone access denied. Please allow it in Chrome settings.");
                }
            };

            recognition.onend = () => {
                console.log("🛑 Voice Recognition stopped.");
                chrome.storage.local.set({ isListening: false });
            };

            recognition.start();
        })
        .catch((err) => {
            console.error("❌ Microphone access denied:", err);
            alert("⚠️ Please allow microphone access in Chrome settings.");
        });
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }
}

// Restore state when the page loads
chrome.storage.local.get("isListening", (data) => {
    if (data.isListening) {
        startListening();
    }
});

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        startListening();
    } else if (message.action === "stop") {
        stopListening();
    }
});