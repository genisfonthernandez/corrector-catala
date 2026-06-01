import { createHunspellFromStrings } from "../vendor/hunspell-wasm/dist/Hunspell.js";
import { tokenizeWords } from "./tokenizer.js";

let dictionaryPromise = null;

export async function checkTextWithHunspell(text) {
  const dictionary = await loadDictionary();
  const words = tokenizeWords(text);
  const unknownWords = new Map();

  for (const word of words) {
    const normalized = normalizeWord(word.value);

    if (!normalized || shouldIgnore(normalized) || dictionary.testSpelling(normalized)) {
      continue;
    }

    if (!unknownWords.has(normalized)) {
      unknownWords.set(normalized, {
        word: word.value,
        start: word.start,
        end: word.end,
        suggestions: rankSuggestions(normalized, dictionary.getSpellingSuggestions(normalized)).slice(0, 5)
      });
    }
  }

  return [...unknownWords.values()];
}

export async function isHunspellReady() {
  await loadDictionary();
  return true;
}

function loadDictionary() {
  if (!dictionaryPromise) {
    dictionaryPromise = Promise.all([
      fetchText("public/dictionaries/ca/catalan.aff"),
      fetchText("public/dictionaries/ca/catalan.dic")
    ]).then(([affData, dicData]) => createHunspellFromStrings(affData, dicData));
  }

  return dictionaryPromise;
}

async function fetchText(path) {
  const url = chrome.runtime.getURL(path);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No s'ha pogut carregar ${path}: ${response.status}`);
  }

  return response.text();
}

function normalizeWord(word) {
  return word
    .toLocaleLowerCase("ca")
    .replace(/^['’]+|['’]+$/g, "")
    .normalize("NFC");
}

function shouldIgnore(word) {
  return word.length < 2 || /\d/.test(word);
}

function rankSuggestions(word, suggestions) {
  const collapsedDuplicate = collapseConsecutiveDuplicates(word);

  return suggestions
    .map((suggestion, index) => ({ suggestion, index }))
    .sort((left, right) => {
      if (word === collapsedDuplicate) {
        return left.index - right.index;
      }

      const leftDuplicateFix = left.suggestion === collapsedDuplicate ? 0 : 1;
      const rightDuplicateFix = right.suggestion === collapsedDuplicate ? 0 : 1;

      if (leftDuplicateFix !== rightDuplicateFix) {
        return leftDuplicateFix - rightDuplicateFix;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.suggestion);
}

function collapseConsecutiveDuplicates(word) {
  return word.replace(/([\p{L}])\1+/gu, "$1");
}
