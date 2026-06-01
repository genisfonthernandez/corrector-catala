# Roadmap

## Fase 0 - Definición

- [x] Revisar ideas candidatas.
- [x] Guardar investigación inicial en `Programacion/recursos`.
- [x] Crear estructura del proyecto.
- [ ] Decidir nombre público.
- [ ] Decidir primera plataforma: Chrome/Edge o Firefox.

## Fase 1 - Popup 1.0

- [x] Crear extensión mínima Manifest V3.
- [x] Crear popup independiente desde el icono de la extensión.
- [x] Empaquetar diccionario catalán compatible con Hunspell.
- [x] Detectar palabras no reconocidas localmente con diccionario real.
- [x] Mostrar sugerencias básicas en popup o panel.
- [x] No enviar texto fuera del navegador.
- [x] Compactar y catalanizar la interfaz del popup.
- [x] Añadir corrección manual desde sugerencias.
- [x] Añadir corrección automática con la primera sugerencia disponible.
- [x] Añadir botón para copiar el texto corregido.
- [x] Crear icono inicial de la extensión.

## Fase 2 - MVP usable

- [x] Sustituir diccionario de desarrollo por diccionario catalán real.
- [ ] Añadir opciones básicas de idioma/variante si hacen falta.
- [ ] Documentar privacidad y límites.
- [ ] Preparar instalación manual para pruebas.
- [x] Revisar rendimiento con diccionario grande.

## Fase 2.0 - Integración en campos de texto

- [x] Diseñar content script para detectar campos editables.
- [x] Mostrar botón pequeño junto al recuadro de texto.
- [x] Abrir el corrector con el contenido del campo.
- [x] Intentar reemplazar el texto corregido.
- [x] Cerrar el panel al aplicar.
- [x] Permitir abrir/cerrar con la pluma.
- [ ] Probar Gmail, ChatGPT, buscadores y formularios simples.
- [ ] Diseñar adaptador específico para Google Docs si merece entrar en el MVP.
- [ ] Revisar permisos antes de publicación.

## Fase 3 - Validación

- [x] Crear pruebas automatizadas básicas de extensión.
- [ ] Crear repositorio GitHub privado inicialmente.
- [x] Preparar README público.
- [ ] Buscar 3-5 usuarios de prueba.
- [ ] Recoger feedback.
- [ ] Decidir si merece publicación en tienda.

## Siguiente sesión sugerida

1. Revisar la extensión cargada en Chrome tras la integración Hunspell real.
2. Crear perfil de soporte/donaciones si se decide hacerlo antes de GitHub.
3. Crear repositorio GitHub privado.
4. Hacer commit inicial limpio.
5. Revisar si se publica el repositorio y cuándo contactar con Softcatalà.
