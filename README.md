# Corrector Català

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B7P820MJKB)

Extensió de navegador per revisar ortografia catalana localment, sense servidor.

Corrector Català funciona com un mini corrector: obres l'extensió, escrius o enganxes text, revises paraules desconegudes, apliques suggeriments i copies el resultat. També inclou una integració experimental amb camps de text de pàgines web.

Aquest projecte no és un producte oficial de Softcatalà.

## Funcions

- Revisió ortogràfica local amb Hunspell en WebAssembly.
- Diccionari Hunspell català de Softcatalà empaquetat dins l'extensió.
- Suggeriments de correcció.
- Correcció manual paraula a paraula.
- Correcció automàtica amb la primera proposta disponible.
- Còpia del text corregit.
- Assistent experimental en camps editables.

## Limitacions

- No fa correcció gramatical.
- No revisa estil ni puntuació avançada.
- La integració en pàgines pot fallar en editors complexos, com Google Docs.

## Instal·lació local

1. Obre `chrome://extensions`.
2. Activa el mode desenvolupador.
3. Prem `Carrega desempaquetada`.
4. Selecciona la carpeta arrel d'aquest projecte.

Després de canviar el codi, recarrega l'extensió des de la pàgina d'extensions.

## Proves

```powershell
npm.cmd install
npm.cmd run test:wasm
npm.cmd run test:extension
```

La primera prova valida el motor i el diccionari. La segona obre temporalment Brave, Chrome o Edge i comprova el popup, `textarea`, `input`, `contenteditable`, la correcció automàtica i l'aplicació del resultat.

Si el navegador no és en una ruta habitual de Windows, defineix `CORRECTOR_BROWSER_PATH` abans d'executar la prova.

## Estructura

- `src/`: codi de l'extensió.
- `public/dictionaries/`: diccionari Hunspell català.
- `src/vendor/`: motor Hunspell WebAssembly necessari perquè l'extensió funcioni sense servidor.
- `licenses/`: llicències dels recursos de tercers inclosos.
- `scripts/`: proves automatitzades locals.

## Arquitectura

- `manifest.json`: configuració Manifest V3.
- `src/popup/`: corrector independent.
- `src/content/field-assistant.js`: interfície integrada en camps editables.
- `src/background/service-worker.js`: rep les peticions del content script.
- `src/spellcheck/`: carrega Hunspell-WASM, tokenitza i revisa el text.

El text es processa completament dins del navegador:

```txt
popup o camp editable
  -> service worker
  -> Hunspell-WASM
  -> diccionari local
  -> suggeriments
```

## Desenvolupament

Després de canviar el codi:

1. Recarrega l'extensió des de `chrome://extensions`.
2. Recarrega les pàgines on vulguis provar l'assistent.
3. Executa les dues proves abans de publicar canvis.

La integració funciona amb camps simples. Google Docs no exposa un camp editable estàndard i queda fora de l'MVP actual.

## Privadesa

L'extensió no envia textos, correccions ni dades personals a cap servidor extern. Consulta [PRIVACY.md](PRIVACY.md).

## Reutilització i atribució

El codi propi del projecte es publica sota llicència MIT. Pots reutilitzar-lo, modificar-lo o publicar-ne derivats sempre que conservis l'avís de copyright, la llicència i una atribució clara a aquest repositori:

```txt
Corrector Català, Genís Font Hernández
https://github.com/genisfonthernandez/corrector-catala
```

Els diccionaris i llibreries de tercers mantenen les seves llicències originals. Consulta [ATTRIBUTION.md](ATTRIBUTION.md).

## Llicència

Consulta [LICENSE](LICENSE), [ATTRIBUTION.md](ATTRIBUTION.md) i la carpeta `licenses/`.
