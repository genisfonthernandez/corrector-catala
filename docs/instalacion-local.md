# Instalación local

## Cargar en Chromium, Chrome o Edge

1. Abrir la página de extensiones:

```txt
chrome://extensions
```

En Edge:

```txt
edge://extensions
```

2. Activar el modo desarrollador.
3. Pulsar `Load unpacked` o `Cargar desempaquetada`.
4. Seleccionar la carpeta raíz de este proyecto.

5. Abrir cualquier página, seleccionar texto y pulsar el icono de la extensión.

Después de cada cambio de código:

1. Volver a `chrome://extensions`.
2. Pulsar el botón de recargar en `Corrector Català`.
3. Recargar también las pestañas donde se quiere probar, por ejemplo Gmail.
4. Probar de nuevo.

## Flujo actual 1.0

- Abrir la extensión desde el icono de Chrome.
- Pegar o escribir texto en el cuadro.
- Pulsar `Revisa`.
- Pulsar una sugerencia para corregir manualmente.
- Pulsar `Corregeix tot` para aplicar la primera sugerencia disponible.
- Pulsar `Copia` para llevar el texto corregido al portapapeles.

## Flujo experimental 2.0

- Enfocar un campo editable de una página web.
- Pulsar la pluma que aparece abajo a la derecha del campo.
- Revisar el texto en el panel integrado.
- Corregir manualmente o con `Corregeix tot`.
- Pulsar `Aplica` para devolver el texto corregido al campo y cerrar el panel.
- Pulsar de nuevo la pluma para abrir o cerrar el panel.

Botones del corrector:

- `Revisa`: analiza el texto del cuadro y muestra palabras sospechosas.
- `Corregeix tot`: aplica la primera sugerencia disponible dentro del cuadro.
- `Aplica el text`: intenta escribir el texto del cuadro en la página original.

## Prueba rápida

Texto útil para probar:

```txt
Aquest correctro catala funciona sense servidro.
```

La versión actual usa el diccionario Hunspell catalán de Softcatalà empaquetado en la extensión.

## Prueba por terminal

```powershell
npm.cmd run test:wasm
npm.cmd run test:extension
```

## Limitaciones actuales

- La 2.0 intenta aplicar correcciones sobre campos simples, pero puede fallar en editores complejos.
- No revisa gramática.
- No subraya mientras se escribe.
- No envía texto fuera del navegador.
- Google Docs requiere soporte específico: no expone un campo editable normal como textarea/contenteditable estándar.
