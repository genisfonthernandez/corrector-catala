import { readFile } from "node:fs/promises";
import { createHunspellFromStrings } from "hunspell-wasm";

const [aff, dic] = await Promise.all([
  readFile("./public/dictionaries/ca/catalan.aff", "utf8"),
  readFile("./public/dictionaries/ca/catalan.dic", "utf8")
]);

console.time("load");
const dictionary = await createHunspellFromStrings(aff, dic);
console.timeEnd("load");

for (const word of ["hola", "corrector", "funciona", "servidro", "correctro"]) {
  console.log(`${word}: ${dictionary.testSpelling(word)} -> ${dictionary.getSpellingSuggestions(word).slice(0, 5).join(", ")}`);
}

const phrase = "hola bon diia aquest correctro funciona sense servidro";
const words = phrase.match(/[\p{L}]+(?:['’][\p{L}]+)*/gu) ?? [];
const issues = words
  .map((word) => word.toLocaleLowerCase("ca"))
  .filter((word) => !dictionary.testSpelling(word));

console.log(`phrase issues: ${issues.join(", ")}`);

if (!issues.includes("diia") || !issues.includes("correctro") || !issues.includes("servidro")) {
  throw new Error("Expected known misspellings were not detected.");
}

dictionary.dispose();
