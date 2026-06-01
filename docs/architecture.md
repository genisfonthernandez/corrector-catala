# Arquitectura

## Resum

Corrector Català és una extensió Manifest V3 que corregeix ortografia catalana de forma local.

No usa servidor i no envia textos fora del navegador.

## Parts principals

- `manifest.json`: configuració de l'extensió.
- `src/popup`: mini corrector que s'obre des del botó de l'extensió.
- `src/content/field-assistant.js`: assistent experimental per a camps editables.
- `src/background/service-worker.js`: rep peticions de correcció des del content script.
- `src/spellcheck/hunspell-checker.js`: carrega Hunspell-WASM i el diccionari català.
- `public/dictionaries/ca`: diccionari Hunspell de Softcatalà.
- `src/vendor/hunspell-wasm`: fitxers necessaris per executar Hunspell en WebAssembly.

## Flux 1.0

1. L'usuari obre l'extensió.
2. Escriu o enganxa text.
3. Prem `Revisa`.
4. El popup carrega el diccionari local i retorna errors ortogràfics.
5. L'usuari corregeix manualment, corregeix tot o copia el text.

## Flux 2.0 experimental

1. L'usuari enfoca un camp editable.
2. El content script mostra una ploma.
3. L'usuari prem la ploma.
4. El panell integrat llegeix el camp i envia el text al service worker.
5. El service worker revisa el text amb el motor local.
6. El panell mostra suggeriments i pot aplicar el text corregit.

