chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_SUMMARY") {
    console.log("Received message:", message);

    const freshDeskURL = message.url;
    const LLM_Response = fetchSummaryFromBackend(freshDeskURL);

    // Notify content script to show loading
    notifyContentScript({ type: "SHOW_LOADING" });

    // Delay sending the form data by 2 seconds
    setTimeout(() => {
      sendLLMResponseToActiveTab(LLM_Response, sendResponse);
    }, 2500);

    return true;
  }
});

function sendLLMResponseToActiveTab(data, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Tabs queried:", tabs);
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      console.log("Sending message to tab:", tabId);
      chrome.tabs.sendMessage(tabId, { type: "FILL_FORM", data: data }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse({ success: true });
        }
      });
    } else {
      console.error("No active tab found.");
      sendResponse({ success: false, error: "No active tab found." });
    }
  });
}

function notifyContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, message);
    }
  });
}

const fetchSummaryFromBackend = () => {
  return {
    ticket_title: "Missing receipt expenses are incomplete expenses",
    ticket_description:
      "When user takes a photo of his receipt, the image stays for only a few seconds and then disappears. He did install the latest version of mobile app, but the problem with the receipts disappearing continued after the update. Steps to repro: 1.2.3.4.",
    org_id: "orgyX1EFZXrN",
    org_name: "E3 Environmental",
    freshdesk_url: "https://fyle.freshdesk.com/a/tickets/54427",
    email_ids_of_affected_users: ["abc@fyle.in", "cccc@fyle.in"],
    is_integration: true,
    is_card: false,
    impact: "users cannot report expenses",
    priority: "p0",
  };
};
