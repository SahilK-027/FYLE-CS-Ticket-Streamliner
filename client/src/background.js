chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab is fully loaded
  if (changeInfo.status === "complete" && tab.url) {
    // Check if the URL matches ClickUp
    if (tab.url.includes("clickup.com")) {
      // Enable the extension action (button in the toolbar)
      chrome.action.enable(tabId);
      chrome.action.setIcon({ tabId: tabId, path: "icons/icon32.jpg" });
    } else {
      // Disable the extension action
      chrome.action.disable(tabId);
      chrome.action.setIcon({ tabId: tabId, path: "icons/icon32disabled.jpg" });
    }
  }
});

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
    ticket_title: "Receipt Images Disappearing After Capture in Mobile App",
    ticket_description:
      "The user reports that when taking a photo of a receipt in the mobile app, the image stays for a few seconds before disappearing. The issue persists even after installing the latest version of the app. The user has followed all necessary steps to reproduce the issue (detailed in the original ticket). This problem is impacting multiple users and is preventing them from completing their expense reporting process.",
    org_id: "orgyX1EFZXrN",
    org_name: "E3 Environmental",
    freshdesk_url: "https://fyle.freshdesk.com/a/tickets/54427",
    email_ids_of_affected_users: ["abc@fyle.in", "cccc@fyle.in"],
    is_integration: true,
    is_card: true,
    impact:
      "Users cannot report expenses, impacting their ability to complete financial processes.",
    priority: "p0",
    ADDITIONAL_SUMMARY:
      "Other similar tickets may indicate that this issue has occurred in other organizations and across various platforms, suggesting a broader issue with expense reporting or receipt image processing. Further investigation of these tickets could reveal shared causes or solutions.",
  };
};
