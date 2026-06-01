# Corrector Català

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B7P820MJKB)

Extensió de navegador per revisar ortografia catalana de forma local.

La versió actual funciona com un mini corrector: obres l'extensió, escrius o enganxes text, revises paraules desconegudes, apliques suggeriments i copies el resultat. També inclou una integració experimental amb camps de text de pàgines web.

## Estat

- Fase: prototip funcional
- Motor: Hunspell en WebAssembly
- Diccionari: Hunspell català de Softcatalà
- Servidor: cap
- Privadesa: el text no surt del navegador

## Funcions

- Popup independent des del botó de la extensió.
- Revisió ortogràfica local.
- Suggeriments de correcció.
- Correcció manual paraula a paraula.
- Correcció automàtica amb la primera proposta disponible.
- Còpia del text corregit.
- Assistent experimental en camps editables.

## Limitacions

- No fa correcció gramatical.
- No revisa estil ni puntuació avançada.
- La integració en pàgines pot fallar en editors complexos.
- Google Docs necessita suport específic i no es considera suportat de forma estable.

## Instal·lació local

1. Obre `chrome://extensions`.
2. Activa el mode desenvolupador.
3. Prem `Carrega desempaquetada`.
4. Selecciona la carpeta arrel d'aquest projecte.

Després de canviar `manifest.json`, és millor treure l'extensió i tornar-la a carregar.

## Proves

```powershell
npm.cmd run test:wasm
```

## Documentació

- [Arquitectura](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Proves](docs/testing.md)
- [Privadesa](PRIVACY.md)
- [Atribució](ATTRIBUTION.md)
- [Notes legals](docs/legal-notes.md)

## Atribució

El diccionari català prové de [Softcatala/catalan-dict-tools](https://github.com/Softcatala/catalan-dict-tools). Aquest projecte no és un producte oficial de Softcatalà.

## Llicència

El codi propi del projecte es publica sota llicència MIT. Els diccionaris i llibreries de tercers mantenen les seves llicències originals; consulta [ATTRIBUTION.md](ATTRIBUTION.md).
