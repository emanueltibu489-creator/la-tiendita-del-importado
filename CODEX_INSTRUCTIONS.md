# Instrucciones para Codex

## Forma de trabajo

1. Inspeccionar antes de modificar.
2. Explicar primero el diagnóstico y el alcance.
3. Hacer cambios pequeños, reversibles y verificables.
4. No mezclar estabilización, nuevas funciones y rediseño en una misma etapa.
5. Ejecutar `npm run lint` después de cambios TypeScript.
6. Ejecutar `npm run build` cuando el cambio afecte compilación, servidor o despliegue.
7. Informar archivos modificados, comandos ejecutados y resultado.
8. Respetar cambios locales existentes y revisar `git status`.

## Límites

- No modificar Supabase, Google Sheets, producción, GitHub o servicios externos sin autorización explícita.
- No tocar `server.ts` o Gemini cuando la tarea esté limitada al frontend.
- No borrar `src/data.ts` hasta retirar todos sus consumidores.
- No refactorizar archivos grandes si una corrección localizada resuelve el problema.
- No agregar dependencias sin justificar necesidad y costo.
- No generar imágenes sin confirmación.

## Reglas de datos

- Supabase es la fuente principal de perfumes.
- `sku` es obligatorio y es la identidad principal.
- Nunca generar SKU, UUID o identidad desde el nombre.
- Excluir productos sin SKU o sin stock.
- Mantener nombres comerciales exactamente como llegan en `row.nombre`.
- Marcar nombres comerciales con `translate="no"` cuando el navegador pueda traducirlos.
- No inventar stock, precio, notas, género, orientación, oferta o descripción.

## Reglas de carrito

- Catálogo y ficha usan carrito múltiple.
- Sommelier express reemplaza el carrito por un solo producto, cantidad 1.
- Nunca superar `product.stock` cuando el campo esté disponible.
- WhatsApp debe generarse desde el estado actual del carrito.
- El número oficial debe importarse desde `src/config/business.ts`.
- El usuario debe poder quitar un producto y vaciar la reserva.

## Reglas del Sommelier

- Usar únicamente productos disponibles recibidos por props.
- Mantener selección por SKU.
- Orientación, aroma, ocasión y proyección solo pueden evaluarse con campos reales.
- La recomendación principal y alternativas deben ser productos existentes y diferentes.
- Si falta una coincidencia exacta, explicarlo sin inventar.
- El Sommelier express no debe depender de `PERFUMES` estático.

## Marca y comunicación

- Escribir en español claro, cercano y argentino.
- Priorizar perfumería árabe.
- Vender sin gritar ni usar urgencia falsa.
- Evitar “imperdible”, “la mejor calidad” y afirmaciones sin respaldo.
- Explicar términos técnicos en lenguaje simple.

## UX

- Diseñar mobile first.
- Instagram feed: 4:5.
- Historias y reels: 9:16.
- Videos IA: escenas simples de 8 a 10 segundos.
- Mantener legibilidad, áreas táctiles suficientes y acciones claras.

## Cierre de tareas

Entregar:

- diagnóstico breve;
- cambios realizados;
- archivos modificados;
- validación ejecutada;
- riesgos o pendientes reales;
- siguiente acción recomendada, sin aplicarla automáticamente.
