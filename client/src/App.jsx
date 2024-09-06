import { useState } from "react";
import "./App.css";

function App() {
  const [freshdeskUrl, setFreshdeskUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleAutofill = () => {
    setMessage("");
    setIsError(false);

    if (!freshdeskUrl) {
      setMessage("Please enter a Freshdesk URL");
      setIsError(true);
      return;
    }

    chrome.runtime.sendMessage({ type: "FETCH_SUMMARY", url: freshdeskUrl });
  };

  return (
    <div className="App">
      <h1>Freshdesk to ClickUp Autofill</h1>
      <input
        type="text"
        value={freshdeskUrl}
        onChange={(e) => setFreshdeskUrl(e.target.value)}
        placeholder="Enter Freshdesk URL"
      />
      <button onClick={handleAutofill}>Autofill</button>
      {message && (
        <p className={isError ? "error-message" : "success-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default App;
