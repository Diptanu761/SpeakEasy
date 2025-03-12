document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

    if (!startButton || !stopButton) {
        console.error("❌ Missing start/stop button in popup.html");
        return;
    }

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                console.log("✅ Microphone access granted.");
                chrome.runtime.sendMessage({ action: "start" });
            })
            .catch((err) => {
                console.error("❌ Microphone access denied:", err);
                alert("⚠️ Please allow microphone access in Chrome settings.");
            });
    });

    stopButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "stop" });
    });
});
document.getElementById("startButton").addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log("✅ Microphone access granted.");
            startListening();
        })
        .catch((err) => {
            console.error("❌ Microphone access denied:", err);
            alert("⚠️ Please allow microphone access in Chrome settings.");
        });
});