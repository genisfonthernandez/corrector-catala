const HOST_ID = "corrector-catala-field-assistant";
const EDITABLE_SELECTOR = [
  "textarea",
  "input[type='text']",
  "input[type='search']",
  "input[type='email']",
  "input[type='url']",
  "input:not([type])",
  "[contenteditable='true']",
  "[contenteditable='plaintext-only']"
].join(",");

let activeField = null;
let shadow = null;
let button = null;
let panel = null;
let status = null;
let textArea = null;
let results = null;
let lastIssues = [];

document.addEventListener("focusin", handleFocusIn, true);
document.addEventListener("input", reposition, true);
document.addEventListener("scroll", reposition, true);
window.addEventListener("resize", reposition);

function handleFocusIn(event) {
  const field = findEditableField(event.target);

  if (!field || field.closest(`#${HOST_ID}`)) {
    return;
  }

  activeField = field;
  ensureUi();
  hidePanel();
  positionButton();
}

function findEditableField(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  if (target.matches(EDITABLE_SELECTOR)) {
    return target;
  }

  return target.closest(EDITABLE_SELECTOR);
}

function ensureUi() {
  if (shadow) {
    return;
  }

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.documentElement.append(host);

  shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host {
      all: initial;
      color: #26201d;
      font-family: Arial, Helvetica, sans-serif;
    }

    button {
      box-sizing: border-box;
      border: 1px solid #c73528;
      border-radius: 3px;
      color: #c73528;
      background: #ffffff;
      font: 700 12px Arial, Helvetica, sans-serif;
      cursor: pointer;
    }

    button:hover {
      background: #fff4ef;
    }

    .trigger {
      position: fixed;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      width: 34px;
      height: 30px;
      border-radius: 999px;
      color: #ffffff;
      background: #c73528;
      box-shadow: 0 4px 12px rgba(70, 32, 25, 0.24);
    }

    .trigger[hidden],
    .panel[hidden] {
      display: none;
    }

    .trigger:hover {
      background: #a92c22;
    }

    .panel {
      position: fixed;
      z-index: 2147483647;
      display: grid;
      gap: 9px;
      width: 330px;
      max-width: calc(100vw - 18px);
      border: 1px solid #d7ccc5;
      border-top: 5px solid #c73528;
      border-radius: 4px;
      padding: 11px;
      background: #ffffff;
      box-shadow: 0 12px 28px rgba(45, 35, 31, 0.22);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .title {
      margin: 0;
      color: #c73528;
      font: 700 16px Arial, Helvetica, sans-serif;
    }

    .close {
      width: 26px;
      min-height: 24px;
      border-color: #d7ccc5;
      color: #6f615a;
    }

    textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 105px;
      max-height: 170px;
      resize: vertical;
      border: 1px solid #d7ccc5;
      border-radius: 3px;
      padding: 8px;
      color: #26201d;
      background: #fffdfb;
      font: 13px/1.45 Arial, Helvetica, sans-serif;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr 0.8fr;
      gap: 7px;
    }

    .primary {
      color: #ffffff;
      background: #c73528;
    }

    .primary:hover {
      background: #a92c22;
    }

    .meta {
      min-height: 15px;
      color: #6f615a;
      font: 12px Arial, Helvetica, sans-serif;
    }

    .results {
      display: grid;
      gap: 7px;
      max-height: 135px;
      overflow: auto;
      border: 1px solid #e0d6cf;
      border-radius: 3px;
      padding: 8px;
      background: #fffdfb;
      color: #756a64;
      font: 13px Arial, Helvetica, sans-serif;
    }

    .issue {
      display: grid;
      gap: 5px;
      padding-bottom: 7px;
      border-bottom: 1px solid #eee5df;
    }

    .issue:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .word {
      width: fit-content;
      padding: 1px 4px;
      border-bottom: 2px solid #c73528;
      background: #fff3ed;
      color: #26201d;
      font-weight: 700;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .suggestion {
      min-height: 25px;
      border-color: #d7a03b;
      color: #62430f;
      background: #fff8e8;
      font-size: 11px;
    }
  `;

  button = document.createElement("button");
  button.className = "trigger";
  button.type = "button";
  button.title = "Revisa aquest text";
  button.hidden = true;
  button.append(createFeatherIcon());
  button.addEventListener("mousedown", (event) => event.preventDefault());
  button.addEventListener("click", togglePanel);

  panel = document.createElement("section");
  panel.className = "panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="header">
      <h2 class="title">Corrector Català</h2>
      <button class="close" type="button" title="Tanca">×</button>
    </div>
    <textarea spellcheck="false"></textarea>
    <div class="actions">
      <button class="primary" data-action="check" type="button">Revisa</button>
      <button data-action="fix" type="button">Corregeix tot</button>
      <button data-action="apply" type="button">Aplica</button>
    </div>
    <div class="meta" aria-live="polite"></div>
    <div class="results">Escriu un text i prem Revisa.</div>
  `;

  panel.querySelector(".close").addEventListener("click", closePanel);
  panel.querySelector("[data-action='check']").addEventListener("click", checkPanelText);
  panel.querySelector("[data-action='fix']").addEventListener("click", fixPanelText);
  panel.querySelector("[data-action='apply']").addEventListener("click", applyPanelText);

  textArea = panel.querySelector("textarea");
  status = panel.querySelector(".meta");
  results = panel.querySelector(".results");

  shadow.append(style, button, panel);
}

function createFeatherIcon() {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "17");
  svg.setAttribute("height", "17");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(namespace, "path");
  path.setAttribute("d", "M20.5 3.5c-5.8.4-10.9 3.1-14 7.3-1.6 2.2-2.4 4.8-2.3 7.7l5.6-5.6");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "2");

  const line = document.createElementNS(namespace, "path");
  line.setAttribute("d", "M9.8 12.9c2.7.1 6.2-1.4 8.3-4.1");
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "currentColor");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-linejoin", "round");
  line.setAttribute("stroke-width", "2");

  svg.append(path, line);
  return svg;
}

function positionButton() {
  if (!activeField || !button) {
    return;
  }

  const rect = activeField.getBoundingClientRect();
  if (!isVisible(rect)) {
    button.hidden = true;
    return;
  }

  button.style.left = `${Math.min(window.innerWidth - 42, Math.max(8, rect.right - 40))}px`;
  button.style.top = `${Math.min(window.innerHeight - 38, Math.max(8, rect.bottom - 36))}px`;
  button.hidden = false;
}

function positionPanel() {
  if (!activeField || !panel) {
    return;
  }

  const rect = activeField.getBoundingClientRect();
  const left = Math.min(window.innerWidth - 342, Math.max(8, rect.right - 330));
  const below = rect.bottom + 8;
  const top = below + 410 < window.innerHeight
    ? below
    : Math.max(8, rect.top - 410);

  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function isVisible(rect) {
  return rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= window.innerHeight &&
    rect.left <= window.innerWidth;
}

function reposition() {
  if (panel && !panel.hidden) {
    positionButton();
    positionPanel();
  } else {
    positionButton();
  }
}

function togglePanel() {
  if (panel && !panel.hidden) {
    closePanel();
    return;
  }

  openPanel();
}

function openPanel() {
  if (!activeField) {
    return;
  }

  textArea.value = readFieldText(activeField);
  panel.hidden = false;
  positionButton();
  positionPanel();
  checkPanelText();
}

function hidePanel() {
  if (panel) {
    panel.hidden = true;
  }

  positionButton();
}

function closePanel() {
  hidePanel();
}

async function checkPanelText() {
  const text = textArea.value;
  if (!text.trim()) {
    lastIssues = [];
    results.textContent = "Escriu un text i prem Revisa.";
    setStatus("");
    return;
  }

  let response;

  try {
    response = await chrome.runtime.sendMessage({
      type: "CHECK_TEXT",
      text
    });
  } catch (error) {
    lastIssues = [];
    results.textContent = "No s'ha pogut connectar amb el corrector.";
    setStatus(error instanceof Error ? error.message : "Error");
    return;
  }

  if (response?.error) {
    lastIssues = [];
    results.textContent = "No s'ha pogut carregar el diccionari.";
    setStatus("Error");
    return;
  }

  lastIssues = response?.issues ?? [];
  renderResults(lastIssues);
  setStatus(
    lastIssues.length === 0
      ? "Text revisat"
      : `${lastIssues.length} possible${lastIssues.length === 1 ? "" : "s"} error${lastIssues.length === 1 ? "" : "s"}`
  );
}

function renderResults(issues) {
  results.replaceChildren();

  if (issues.length === 0) {
    results.textContent = "No s'han detectat paraules desconegudes.";
    return;
  }

  for (const issue of issues) {
    const item = document.createElement("article");
    item.className = "issue";

    const word = document.createElement("div");
    word.className = "word";
    word.textContent = issue.word;

    const suggestions = document.createElement("div");
    suggestions.className = "suggestions";

    if (issue.suggestions.length === 0) {
      suggestions.textContent = "Sense suggeriments.";
    }

    for (const suggestion of issue.suggestions) {
      const suggestionButton = document.createElement("button");
      suggestionButton.className = "suggestion";
      suggestionButton.type = "button";
      suggestionButton.textContent = suggestion;
      suggestionButton.addEventListener("click", () => replaceIssue(issue, suggestion));
      suggestions.append(suggestionButton);
    }

    item.append(word, suggestions);
    results.append(item);
  }
}

function replaceIssue(issue, suggestion) {
  textArea.value =
    textArea.value.slice(0, issue.start) +
    suggestion +
    textArea.value.slice(issue.end);

  checkPanelText();
}

function fixPanelText() {
  if (lastIssues.length === 0) {
    checkPanelText();
  }

  const fixableIssues = lastIssues.filter((issue) => issue.suggestions.length > 0);
  if (fixableIssues.length === 0) {
    setStatus("Sense canvis automàtics");
    return;
  }

  let nextText = textArea.value;

  for (const issue of [...fixableIssues].sort((left, right) => right.start - left.start)) {
    nextText =
      nextText.slice(0, issue.start) +
      issue.suggestions[0] +
      nextText.slice(issue.end);
  }

  textArea.value = nextText;
  checkPanelText();
}

function applyPanelText() {
  if (!activeField) {
    return;
  }

  writeFieldText(activeField, textArea.value);
  setStatus("Text aplicat");
  closePanel();
}

function readFieldText(field) {
  if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
    return field.value;
  }

  return field.innerText || field.textContent || "";
}

function writeFieldText(field, text) {
  field.focus();

  if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
    field.value = text;
    field.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  if (field.isContentEditable) {
    field.textContent = text;
    field.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  }
}

function setStatus(message) {
  status.textContent = message;
}
