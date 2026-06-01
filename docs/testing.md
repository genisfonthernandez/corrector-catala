# Proves

## Prova del motor Hunspell

```powershell
npm.cmd run test:wasm
```

Comprova que el diccionari real de Softcatalà carrega correctament i detecta errors coneguts.

## Prova automatitzada de l'extensió

```powershell
npm.cmd run test:extension
```

Aquesta prova obre Brave temporalment amb l'extensió carregada i valida:

- popup principal;
- assistent 2.0 en `textarea`;
- assistent 2.0 en `input`;
- assistent 2.0 en `contenteditable`;
- detecció de `diia`, `correctro` i `servidro`;
- `Corregeix tot`;
- `Aplica`;
- tancament del panell;
- text correcte final.

Text de prova:

```txt
hola bon diia aquest correctro funciona sense servidro
```

Resultat esperat:

```txt
hola bon dia aquest corrector funciona sense servidor
```

## Limitació

Aquestes proves no validen Google Docs. Google Docs requereix una integració específica i queda fora del MVP actual.
