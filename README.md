# CS Ticket Streamliner

### **Problem Statement**

We currently use Freshdesk to manage customer tickets, which involves a lengthy manual process for a Customer Success (CS) person to fill out various forms based on the ticket type. The goal is to streamline this process by developing a Chrome extension that:

1. Allows the CS team to input a Freshdesk ticket URL.
2. Automatically retrieves and processes ticket information.
3. Uses an AI model (LLM) to generate a JSON object that can pre-fill the appropriate form fields while allowing for manual edits.

### **Solution Outline**

1. **User Input**: The CS representative enters the Freshdesk ticket URL.
2. **Data Retrieval**: The extension sends a request to the Freshdesk API to retrieve ticket details.
3. **AI Processing**: The retrieved data is sent to an AI model, which processes it and returns a structured JSON object.
4. **Form Autofill**: The extension populates the appropriate fields in the bug report form based on the AI-generated data.
5. **Manual Editing**: CS can review and edit the auto-filled information before submission.

### Running frontend of extension

```bash
cd client
# To run locally
npm run dev

# To build extension
npm run build
```

#### To run your extension in Chrome after building it

- Open Chrome Browser: Launch the Chrome browser on your computer.

- Access Chrome Extensions Page: Navigate to the Chrome Extensions page by typing chrome://extensions/ into the address bar and pressing Enter.

- Enable Developer Mode: Toggle the Developer Mode switch in the top-right corner of the Extensions page to turn it on.

- Load Unpacked Extension: Click the "Load unpacked" button that appears after enabling Developer Mode.

- Select the Extension Directory: In the file dialog that opens, navigate to the directory where your built extension files are located (for example, dist or build). Select this directory and click "Select Folder" (or "Open" on some systems).

- Verify the Extension: Your extension should now appear on the Extensions page. Verify that it is listed and check if there are any errors or warnings that need to be addressed.

- Test Your Extension: Click on the extension icon (if it has one) or interact with it as needed to ensure it is functioning as expected.

- Update the Extension: If you make changes and rebuild the extension, you can click the "Reload" button on the Extensions page to load the latest version.
