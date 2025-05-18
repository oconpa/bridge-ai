chrome.action.onClicked.addListener(async () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const urls = tabs
      .map((tab) => tab.url)
      .filter((url) => url && url.startsWith("http"));

    fetch("http://localhost:8080/api/tabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    })
      .then(() => console.log("✅ Sent tabs to backend"))
      .catch((err) => console.error("❌ Error sending tabs", err));
  });
});
