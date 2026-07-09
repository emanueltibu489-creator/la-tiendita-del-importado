# Design

## Overview

La Tiendita del Importado usa una estética boutique oscura con acentos dorados y violetas. El sistema visual actual busca transmitir lujo accesible, perfumería árabe, curaduría y confianza. La prioridad no es rediseñar desde cero, sino estabilizar un lenguaje visual consistente para home, destacados, catálogo, ficha, Sommelier, carrito y WhatsApp.

La app combina una superficie de marca y conversión con componentes funcionales de catálogo. Por eso el diseño debe equilibrar impacto visual con claridad operativa.

## Visual Theme

Dirección actual:

- fondo oscuro violeta/ciruela;
- acento dorado para precio, acciones y señales premium;
- superficies tipo panel con bordes violetas/dorados;
- imágenes de producto como elemento principal;
- tono visual boutique, nocturno y premium simple.

Escena de uso:

Una persona entra desde el celular, probablemente desde Instagram o WhatsApp, buscando un perfume importado. Está comparando rápido, necesita entender qué hay disponible y quiere poder consultar sin esfuerzo.

Implicancia:

En desktop puede haber más densidad visual. En mobile debe predominar navegación guiada, lectura limpia y acciones claras.

## Color Palette

Paleta detectada en código actual:

- fondo principal: `#090510`
- superficie violeta oscura: `#1e1135`
- dorado principal: `#D4AF37`
- violeta claro auxiliar: `#f5f3ff`
- violeta auxiliar: `#ede9fe`
- texto base sobre oscuro: `#e5e7eb`

Paleta de marca documentada previamente:

- violeta: `#4B388A`
- dorado: `#D6A20A`
- lavanda: `#F2EAF5`
- ciruela: `#24183F`
- blanco cálido: `#FFFCF7`

Regla de uso:

- dorado para precio, CTA principal, oferta y énfasis comercial real;
- violeta/ciruela para profundidad, paneles y navegación;
- texto claro para información operativa;
- no usar colores nuevos sin motivo comercial o de estado.

Pendiente recomendado:

Validar contraste real en mobile antes de salida pública, especialmente textos secundarios sobre superficies oscuras.

## Typography

Fuentes detectadas:

- `Inter` para interfaz, botones, labels, textos y navegación;
- `Cormorant Garamond` para títulos con sensación premium/luxury.

Uso recomendado:

- `Inter` debe dominar componentes funcionales: catálogo, filtros, carrito, stock, WhatsApp, botones;
- `Cormorant Garamond` puede usarse en títulos de alto impacto y nombres destacados, sin afectar legibilidad;
- evitar textos muy chicos en mobile;
- limitar mayúsculas espaciadas a etiquetas cortas, no a cuerpos largos;
- no usar fuentes nuevas sin una decisión explícita de marca.

## Layout

Patrones actuales:

- home con bloque hero y CTA;
- sección de destacados/oferta relámpago antes del catálogo;
- catálogo/ficha de perfumes;
- navegación por marcas;
- ficha de producto con galería, precio, notas, perfil y CTA;
- carrito lateral;
- Sommelier como modal/asistente;
- WhatsApp flotante.

Reglas de layout:

- desktop puede mostrar catálogo lateral y ficha al costado;
- mobile debe reducir complejidad: selector de marcas/productos por pasos y ficha limpia;
- el buscador o navegación no debe empujar indefinidamente la ficha;
- las listas largas deben ser compactas;
- el CTA de cotización debe estar disponible cuando el usuario no encuentra producto.

Pendiente UX ya identificado:

En desktop, revisar más adelante la alineación visual entre lista/caja de cotización y el área de notas/uso recomendado de la ficha.

## Components

Componentes principales actuales:

- `Navigation`: navegación superior/secciones.
- `FeaturedPerfumes`: destacados y ofertas relámpago.
- `PerfumeDetail`: catálogo por marcas, ficha de perfume y CTA de cotización.
- `PerfumeFilters`: filtros básicos ocultos o secundarios según flujo actual.
- `ProductGallery`: imágenes del producto.
- `SommelierModal`: recomendación guiada con productos reales.
- `CartSidebar`: reserva, cantidades, stock y WhatsApp.
- `WhatsAppWidget`: acceso rápido a consulta.
- `Toast`: feedback de acciones.

Reglas de componentes:

- nombres comerciales siempre con `product.name` real;
- selección de productos por `sku`;
- precios visibles usando precio efectivo cuando hay oferta válida;
- carrito y WhatsApp deben mostrar los mismos productos y subtotales;
- botones de mobile deben ser grandes, táctiles y sin depender de hover;
- estados vacíos deben explicar qué hacer después.

## Data-driven UI

Fuente vigente:

- Google Sheets como origen operativo de carga;
- Supabase `public.productos_perfumes` como fuente usada por la app;
- `sku` como identidad principal.

Reglas:

- no inventar productos;
- no inventar descuentos;
- no mostrar productos sin stock;
- no generar IDs aleatorios;
- no traducir nombres comerciales;
- ofertas relámpago solo si `es_oferta_relampago` es verdadero y `precio_oferta_ars` es válido, mayor a cero y menor que `precio_ars`;
- destacados solo si el campo real lo indica.

## Mobile Requirements

Mobile es prioridad comercial.

Debe cumplir:

- navegación por toque;
- botones cómodos;
- marcas fáciles de abrir/cerrar o navegar;
- listas compactas dentro de marca;
- ficha clara después de seleccionar;
- precio y CTA visibles;
- WhatsApp accesible;
- sin scroll lateral;
- sin depender de hover;
- evitar filtros avanzados en primer plano;
- caja de cotización clara para productos no encontrados.

## Interaction and Motion

Reglas:

- animaciones ligeras y útiles;
- transiciones cortas;
- no bloquear contenido esperando animación;
- evitar movimientos que ensucien la compra;
- respetar `prefers-reduced-motion` cuando se agreguen nuevas animaciones.

## Quality Bar Before Public Test

Antes de push/deploy público, la app debería pasar:

- `git status --short` limpio o cambios intencionales revisados;
- `npm run lint`;
- `npm run build`;
- prueba visual desktop;
- prueba visual mobile;
- prueba de oferta relámpago;
- prueba de producto destacado;
- prueba de carrito con stock máximo;
- prueba de WhatsApp con mensaje limpio;
- prueba de Sommelier;
- prueba de cotización por producto no encontrado;
- verificación de que Sheets, Supabase y app no se contradicen.
