# Product

## Register

brand

## Users

La Tiendita del Importado atiende a compradores argentinos que buscan productos importados con una experiencia simple, confiable y visual. La especialidad principal actual es perfumería árabe, con foco en personas que quieren descubrir fragancias, comparar opciones reales disponibles y consultar o reservar por WhatsApp sin fricción.

Los usuarios principales llegan con distintas intenciones:

- encontrar un perfume específico por nombre o marca;
- elegir un perfume por orientación, ocasión, perfil aromático o precio;
- aprovechar destacados u ofertas reales;
- pedir asesoramiento cuando no saben qué elegir;
- consultar por un producto que no aparece en stock;
- reservar rápido desde celular.

La experiencia debe funcionar especialmente bien en mobile, porque el usuario probablemente navega desde Instagram, WhatsApp o el celular mientras decide una compra.

## Product Purpose

La app existe para convertir el catálogo real de La Tiendita del Importado en una experiencia de compra clara y confiable. Debe mostrar productos reales desde Supabase, usar SKU como identidad, respetar stock, comunicar precios y ofertas sin inventar datos, y llevar al usuario a una consulta o reserva limpia por WhatsApp.

El éxito del producto se mide por:

- más consultas calificadas por WhatsApp;
- más reservas de productos disponibles;
- menos confusión sobre precio, stock, nombre comercial u oferta;
- navegación mobile más simple;
- confianza en que la app muestra lo mismo que la base de datos.

## Brand Personality

Premium entendible, cercana y confiable.

La marca debe sentirse boutique sin ser fría. Tiene que vender sin gritar, explicar sin marear y acompañar al usuario cuando no sabe qué perfume elegir. El tono es argentino, claro, práctico y comercialmente honesto.

La app no debe comportarse como un marketplace genérico. Debe parecer una tienda curada: pocos mensajes fuertes, productos protagonistas, rutas claras y WhatsApp como cierre natural.

## Anti-references

Evitar explícitamente:

- nombres de productos inventados, traducidos o reinterpretados;
- precios, stock, ofertas o urgencias que no existan en Supabase/Sheets;
- textos comerciales genéricos como “imperdible” o “la mejor calidad al mejor precio”;
- experiencia mobile sucia, interminable o difícil de tocar;
- filtros avanzados ocupando espacio principal si no ayudan a comprar;
- tarjetas enormes para listas largas de perfumes en mobile;
- animaciones pesadas que dificulten navegar;
- diseños que parezcan plantilla IA sin criterio de tienda real;
- cambios visuales que tapen el producto, su precio o el CTA de WhatsApp.

## Design Principles

1. Datos reales antes que decoración.
   Precio, stock, oferta, nombre comercial y SKU siempre deben venir de la fuente real vigente.

2. Mobile primero.
   La navegación en celular debe ser más guiada que en desktop: tocar, volver, elegir y consultar sin perderse.

3. Producto protagonista.
   La foto, el nombre comercial, la marca, el precio y la acción principal deben tener prioridad sobre textos secundarios.

4. Confianza comercial.
   La app debe mostrar lo mismo que enviará por WhatsApp. El carrito, la ficha y el mensaje final no pueden contradecirse.

5. Asesoramiento sin reemplazar decisión.
   El Sommelier y las recomendaciones ayudan a elegir, pero siempre deben recomendar productos reales disponibles.

6. Mejorar por etapas.
   Cada cambio debe ser chico, reversible, probado y commiteado solo cuando esté validado.

## Accessibility & Inclusion

Objetivo práctico: interfaz legible y usable para público amplio, desde adolescentes hasta adultos mayores.

Requisitos base:

- botones cómodos para tocar en mobile, idealmente cercanos o superiores a 44px de alto;
- textos con contraste suficiente sobre fondo oscuro;
- nombres, precios y CTAs legibles sin depender de hover;
- navegación funcional por toque;
- no usar solo color para comunicar estados importantes;
- evitar scroll lateral;
- mantener mensajes de error o estados vacíos claros;
- respetar preferencia de movimiento reducido cuando se agreguen animaciones.

No hay un estándar formal confirmado todavía, pero el objetivo recomendado para salida pública es acercarse a WCAG AA en contraste, foco visible y navegación básica.
