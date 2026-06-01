const WORD_PATTERN = /[\p{L}]+(?:['’][\p{L}]+)*/gu;

export function tokenizeWords(text) {
  return [...text.matchAll(WORD_PATTERN)].map((match) => ({
    value: match[0],
    start: match.index,
    end: match.index + match[0].length
  }));
}
