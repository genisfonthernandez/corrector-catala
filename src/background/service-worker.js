import { checkTextWithHunspell } from "../spellcheck/hunspell-checker.js";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "CHECK_TEXT") {
    return false;
  }

  const text = typeof message.text === "string" ? message.text : "";
  checkTextWithHunspell(text)
    .then((issues) => sendResponse({ issues }))
    .catch((error) => sendResponse({
      issues: [],
      error: error instanceof Error ? error.message : "Unknown spellcheck error"
    }));

  return true;
});
