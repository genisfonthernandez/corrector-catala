# Notes legals

Aquest document no és assessorament legal. Resumeix les decisions i punts a revisar abans de publicar.

## Llicències

El projecte distribueix tres blocs diferents:

- codi propi de la extensió;
- diccionari català de Softcatalà;
- motor Hunspell-WASM.

El codi propi queda sota llicència MIT. Els recursos de tercers mantenen les seves llicències originals, descrites a `ATTRIBUTION.md` i `licenses/`.

## Obligacions pràctiques mínimes

- Incloure atribució visible a Softcatalà.
- Incloure textos de llicència del diccionari.
- Incloure textos de llicència de Hunspell-WASM.
- Explicar que no és una extensió oficial de Softcatalà.
- Explicar que no s'envien textos a servidors externs.

## Privadesa

La política de privadesa ha d'indicar clarament:

- quins textos pot llegir la extensió;
- que la revisió és local;
- que no hi ha servidor propi;
- que Google Docs i altres editors complexos poden no estar suportats.
- que l'ús de dades compleix la Chrome Web Store User Data Policy i Limited Use requirements.

## Pendent abans de publicació

- Si el projecte es publica a Chrome Web Store, revisar si convé demanar una revisió externa de compatibilitat de llicències.
- Revisar requisits de Chrome Web Store sobre permisos amplis de content scripts.
- Revisar si convé contactar amb Softcatalà abans de publicar en abierto.

## Fonts revisades

- Chrome Web Store - Program Policies: https://developer.chrome.com/docs/webstore/program-policies/policies
- Chrome Web Store - User Data Policy: https://developer.chrome.com/docs/webstore/user_data
- Chrome Extensions - Content Security Policy: https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy
- Softcatalà catalan-dict-tools: https://github.com/Softcatala/catalan-dict-tools
- hunspell-wasm: https://www.npmjs.com/package/hunspell-wasm
