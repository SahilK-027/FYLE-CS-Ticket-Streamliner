// Function to set values and dispatch events for multiple text input fields
function setTextInputValues(fields) {
  for (const [fieldId, value] of Object.entries(fields)) {
    const inputElement = document.querySelector(fieldId);
    if (inputElement) {
      inputElement.value = value;
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
      inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      console.warn(`Element with ID ${fieldId} not found.`);
    }
  }
}

// Function to show the loading indicator
function showLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-indicator";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "0";
  loadingDiv.style.left = "0";
  loadingDiv.style.width = "100%";
  loadingDiv.style.height = "100%";
  loadingDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  loadingDiv.style.color = "#fff";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.justifyContent = "center";
  loadingDiv.style.fontSize = "20px";
  loadingDiv.style.zIndex = "9999";
  loadingDiv.innerText = "Auto-filling form...";
  document.body.appendChild(loadingDiv);
}

// Function to hide the loading indicator
function hideLoadingIndicator() {
  const loadingDiv = document.getElementById("loading-indicator");
  if (loadingDiv) {
    document.body.removeChild(loadingDiv);
  }
}

// Listen for messages from the background script
console.log("running content");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("called FILL_FORM");
  console.log("message", message);

  if (message.type === "FILL_FORM") {
    hideLoadingIndicator(); // Hide loading indicator initially
    const data = message.data;

    // Define the field IDs and their corresponding values
    const fieldValues = {
      "#cu-form-control-1": data.ticket_title,
      "#cu-form-control-2": data.ticket_description,
      "#cu-form-control-5": data.org_id,
      "#cu-form-control-6": data.org_name,
      "#cu-form-control-7": data.freshdesk_url,
      "#cu-form-control-8": data.email_ids_of_affected_users.join(", "),
      "#cu-form-control-12": data.impact,
    };

    // Set the values and dispatch events
    setTextInputValues(fieldValues);

    // Handle checkboxes separately
    document.querySelector("#cu3-checkbox-1-input").checked =
      data.is_integration;
    document.querySelector("#cu3-checkbox-2-input").checked = data.is_card;

    console.log("Form filled with data from Freshdesk");
    hideLoadingIndicator(); // Hide loading indicator
    sendResponse({ success: true });
  } else if (message.type === "SHOW_LOADING") {
    showLoadingIndicator(); // Show loading indicator
  }
});
