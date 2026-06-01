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
npm.cmd run test:wasm
npm.cmd run test:extension
```

## Estructura

- `src/`: codi de l'extensió.
- `public/dictionaries/`: diccionari Hunspell català.
- `src/vendor/`: motor Hunspell WebAssembly necessari perquè l'extensió funcioni sense servidor.
- `licenses/`: llicències dels recursos de tercers inclosos.
- `scripts/`: proves automatitzades locals.

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
