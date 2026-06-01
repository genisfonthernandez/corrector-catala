import { checkTextWithHunspell } from "../spellcheck/hunspell-checker.js";

const textInput = document.querySelector("#text-input");
const checkTextButton = document.querySelector("#check-text");
const autoFixButton = document.querySelector("#auto-fix");
const copyTextButton = document.querySelector("#copy-text");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

let lastIssues = [];

function renderResults(issues) {
  lastIssues = issues;
  results.replaceChildren();
  results.classList.toggle("empty", issues.length === 0);

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
      const button = document.createElement("button");
      button.className = "suggestion";
      button.type = "button";
      button.textContent = suggestion;
      button.addEventListener("click", () => replaceIssue(issue, suggestion));
      suggestions.append(button);
    }

    item.append(word, suggestions);
    results.append(item);
  }
}

async function checkCurrentText() {
  const text = textInput.value.trim();

  if (!text) {
    lastIssues = [];
    results.classList.add("empty");
    results.textContent = "Escriu un text i prem Revisa.";
    setStatus("");
    return;
  }

  setStatus("Revisant...");
  try {
    const issues = await checkTextWithHunspell(textInput.value);
    renderResults(issues);
    setStatus(
      issues.length === 0
        ? "Text revisat"
        : `${issues.length} possible${issues.length === 1 ? "" : "s"} error${issues.length === 1 ? "" : "s"}`
    );
  } catch (error) {
    lastIssues = [];
    results.classList.add("empty");
    results.textContent = "No s'ha pogut carregar el diccionari.";
    setStatus(error instanceof Error ? error.message : "Error");
    console.error(error);
  }
}

function replaceIssue(issue, suggestion) {
  textInput.value =
    textInput.value.slice(0, issue.start) +
    suggestion +
    textInput.value.slice(issue.end);

  void checkCurrentText();
}

async function autoFixText() {
  if (lastIssues.length === 0) {
    await checkCurrentText();
  }

  const fixableIssues = lastIssues.filter((issue) => issue.suggestions.length > 0);
  if (fixableIssues.length === 0) {
    setStatus("Sense canvis automàtics");
    return;
  }

  let nextText = textInput.value;

  for (const issue of [...fixableIssues].sort((left, right) => right.start - left.start)) {
    nextText =
      nextText.slice(0, issue.start) +
      issue.suggestions[0] +
      nextText.slice(issue.end);
  }

  textInput.value = nextText;
  await checkCurrentText();
}

async function copyText() {
  if (!textInput.value.trim()) {
    setStatus("No hi ha text");
    return;
  }

  try {
    await navigator.clipboard.writeText(textInput.value);
    setStatus("Text copiat");
  } catch {
    textInput.select();
    setStatus("Text seleccionat");
  }
}

function setStatus(message) {
  status.textContent = message;
}

checkTextButton.addEventListener("click", () => void checkCurrentText());
autoFixButton.addEventListener("click", () => void autoFixText());
copyTextButton.addEventListener("click", copyText);
