# Problemas conocidos

## Críticos o de alta prioridad

### Sommelier IA usa catálogo estático

`server.ts` todavía importa `PERFUMES` desde `src/data.ts`.

Impacto:

- puede recomendar productos agotados;
- puede utilizar precios distintos;
- puede mencionar productos que no están en Supabase;
- no garantiza selección por SKU real.

No corregir parcialmente en frontend. Migrar servidor y respuesta estructurada en una etapa específica.

### RLS y permisos no documentados

La aplicación lee `public.productos_perfumes`, pero el repositorio no documenta políticas RLS ni permisos del Data API.

Pendiente:

- confirmar RLS habilitado;
- confirmar política pública de solo lectura;
- confirmar permisos de Storage;
- registrar la configuración sin guardar secretos.

## Importantes

### Bazar y Tecno son estáticos

`BAZAR` y `TECNO` permanecen en `src/data.ts`.

Consecuencias:

- no tienen stock real confirmado;
- el límite de carrito solo puede aplicarse cuando `product.stock` existe;
- precios y disponibilidad pueden quedar desactualizados.

### Catálogo estático legado

`PERFUMES` sigue existiendo temporalmente para el servidor Gemini. No debe volver a utilizarse en catálogo, ficha o Sommelier express.

### Pestaña IA puede producir texto no validado

La respuesta de Gemini se muestra como texto. Hasta migrar el servidor:

- no hay SKU estructurado;
- no se valida el producto mencionado;
- podría generar afirmaciones no respaldadas.

Decisión para la prueba pública inicial:

- la asesoría IA/Gemini queda fuera del flujo comercial principal;
- el Sommelier express sí puede usarse porque trabaja con productos reales disponibles;
- no usar la IA como promesa de venta hasta migrar `server.ts` a Supabase y validar SKU/stock.

### Nombres traducidos por el navegador

Supabase contiene nombres comerciales como `Love spell` y `Guava fiesta shimmer`. El navegador puede traducirlos si no están protegidos.

Sommelier y carrito ya usan `translate="no"`. Revisar el resto de superficies de producto.

### Sin rutas de producto

La aplicación funciona como una sola página con navegación por scroll.

Impacto:

- no se puede compartir una ficha específica;
- navegación atrás/adelante limitada;
- SEO de producto débil.

### Formulario de novedades no conectado

El formulario visual no tiene una integración de persistencia confirmada. No debe prometer registro efectivo hasta implementarlo.

### Configuración Supabase en frontend

La URL y clave publicable están definidas en el código. Una clave publicable puede exponerse, pero conviene usar variables de entorno y documentar RLS.

## Calidad técnica

### Sin tipos generados de Supabase

El tipo de fila está escrito manualmente en `products.ts`.

Riesgo: cambios de esquema pueden no detectarse automáticamente.

### Sin tests automáticos

No hay cobertura confirmada para:

- mapeo de productos;
- SKU inválidos o duplicados;
- límites de stock;
- reemplazo de carrito desde Sommelier;
- mensaje de WhatsApp;
- ranking del Sommelier.

### Bundle grande

El último build verificado produjo una advertencia por un bundle JavaScript superior a 500 kB.

No bloquea producción, pero conviene aplicar carga diferida después de estabilizar funciones.

### Carrito no persistente

El carrito vive en memoria y se pierde al recargar. Confirmar si se desea persistencia antes de implementar.

## UX y contenido

- Textos pequeños de 9–12 px en varias superficies.
- Controles pequeños en mobile.
- WhatsApp y Sommelier flotantes pueden competir.
- Modales requieren revisión completa de foco y teclado.
- Exceso de glassmorphism, gradientes y animaciones.
- Existen afirmaciones comerciales que requieren respaldo documental.
- README, título HTML e idioma del documento conservan señales genéricas de AI Studio.

## No considerar problema

- La clave publicable de Supabase no equivale a `service_role`.
- `id` y `sku` pueden coincidir temporalmente en perfumes para compatibilidad, pero SKU sigue siendo la identidad comercial.
