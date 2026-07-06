# Roadmap de la aplicación

## Principio

Primero estabilizar datos y conversión. Después mejorar experiencia y recién entonces agregar automatizaciones.

## Completado

### Estabilización TypeScript

- Se eliminó la interfaz `Product` duplicada.
- `npm run lint` vuelve a pasar.
- El build de producción fue validado.

### Fuente de verdad para perfumes

- Se creó `src/services/products.ts`.
- Supabase alimenta catálogo y ficha.
- La consulta usa columnas explícitas.
- SKU obligatorio, normalizado y sin fallback aleatorio.
- Se excluyen productos sin SKU, sin stock y duplicados.

### Carrito y WhatsApp

- Carrito identificado por SKU.
- Número oficial centralizado.
- Límite máximo según stock.
- Mensaje generado desde el carrito actual.
- Nombre, SKU, cantidad, precio unitario y subtotal incluidos.
- Acción para quitar productos y vaciar reserva.
- Envoltura de regalo retirada.
- Sommelier reemplaza el carrito por un único producto.

### Sommelier express

- Usa productos reales desde Supabase.
- Filtra por stock.
- Pregunta orientación, preferencia, ocasión y proyección.
- Selecciona por SKU.
- Muestra recomendación principal y hasta dos alternativas.
- Permite ir al catálogo completo.

## Próxima prioridad: migrar Sommelier IA

Objetivo:

- retirar `PERFUMES` estático de `server.ts`;
- consultar productos disponibles desde Supabase;
- pedir a Gemini una respuesta estructurada con SKU;
- validar en servidor que el SKU exista y tenga stock;
- impedir nombres o productos inventados;
- manejar errores sin exponer detalles internos.

Criterio de terminado:

- la IA solo recomienda SKU disponibles;
- el frontend puede abrir la ficha real;
- ninguna respuesta depende del catálogo estático.

## Prioridad siguiente: confianza y ficha de producto

- Mostrar mililitros.
- Mostrar stock disponible de forma clara.
- Añadir género orientativo cuando exista.
- Explicar entrega, pago y consulta.
- Mostrar autenticidad/procedencia solo con respaldo.
- Añadir consulta por WhatsApp vinculada al SKU.
- Revisar afirmaciones comerciales no verificadas.

## Prioridad siguiente: catálogo

- Búsqueda.
- Filtros por orientación, perfil, ocasión, estación y precio.
- Estados claros de carga, error, vacío y reintento.
- Separar Bazar y Tecno de datos estáticos cuando exista una fuente real.

## Prioridad siguiente: navegación

- Definir rutas para home, catálogo y producto.
- URL compartible por SKU.
- Metadatos SEO, título, idioma, favicon y Open Graph.
- Mantener el carrito al recargar si se confirma como requisito.

## Prioridad siguiente: UX mobile y accesibilidad

- Revisar tamaños mínimos de texto.
- Garantizar áreas táctiles de al menos 44×44 px.
- Evitar superposición entre WhatsApp y Sommelier.
- Mejorar foco, teclado y cierre de modales.
- Añadir soporte para movimiento reducido.
- Reducir densidad visual y efectos sin función.

## Prioridad siguiente: medición

Eventos sugeridos:

- producto visto;
- Sommelier iniciado;
- Sommelier completado;
- recomendación abierta;
- producto agregado;
- reserva reemplazada desde Sommelier;
- WhatsApp abierto;
- reserva vaciada.

Definir herramienta y política de privacidad antes de implementar.

## Más adelante

- Tests automáticos.
- Tipos generados desde Supabase.
- Persistencia de carrito.
- Automatización de stock.
- Newsletter real.
- Optimización del bundle.
- Documentación de despliegue.
