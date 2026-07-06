# Requisitos UX

## Objetivo

Ayudar a encontrar un producto, entenderlo y consultar o reservar por WhatsApp con la menor fricción posible.

## Principios

1. Mobile first.
2. Producto y decisión antes que decoración.
3. Información real antes que promesas.
4. Una acción principal clara por contexto.
5. Consistencia entre pantalla, carrito y WhatsApp.
6. Premium entendible: sofisticado, pero legible y cercano.

## Home

En el primer viewport debe quedar claro:

- que LTI vende productos importados;
- que la especialidad es perfumería árabe;
- que se puede explorar perfumes;
- que existe asesoramiento para elegir;
- que la consulta/reserva termina por WhatsApp.

Acciones principales:

- `Ver perfumes`.
- `Ayudame a elegir`.

## Catálogo

- Mostrar solo productos disponibles.
- Usar nombres comerciales exactos.
- Proteger nombres con `translate="no"`.
- Mostrar precio y señales de stock reales.
- Permitir reconocer marca, nombre y perfil sin abrir información extensa.
- Proveer estados de carga, error, vacío y reintento.
- No ocultar productos por errores silenciosos sin registrar advertencia.

## Ficha de perfume

Debe ayudar a decidir mediante:

- nombre y marca;
- imágenes reales;
- precio;
- volumen;
- stock;
- perfil olfativo;
- notas de salida, corazón y fondo;
- ocasión;
- estación/clima;
- proyección;
- orientación;
- acción para agregar o consultar.

No presentar duración, fijación o rendimiento como garantía universal.

## Sommelier express

Flujo:

1. Orientación: masculino, femenino, unisex o indiferente.
2. Preferencia aromática.
3. Momento de uso.
4. Proyección.
5. Resultado.

Resultado:

- una recomendación principal;
- hasta dos alternativas;
- productos diferentes y disponibles;
- selección por SKU;
- explicación cuando no exista coincidencia exacta;
- acción para ver ficha;
- acción para reservar;
- acción para ver catálogo completo.

Reservar desde Sommelier:

- reemplaza la reserva anterior;
- deja un producto, cantidad 1;
- abre el carrito con ese mismo producto.

## Carrito

- Mostrar nombre real, SKU, cantidad y subtotal.
- Respetar stock máximo.
- Deshabilitar suma al alcanzar stock.
- Permitir restar, quitar producto y vaciar reserva.
- Catálogo/ficha permiten varios productos.
- Sommelier reemplaza el contenido.
- No mostrar envoltura de regalo.
- El contenido visible debe coincidir con WhatsApp.

## WhatsApp

- Usar `5493435049794`.
- Generar un mensaje nuevo desde el estado actual.
- Incluir nombre, SKU, cantidad, precio unitario y subtotal.
- Incluir total y modalidad de pago vigente.
- No incluir productos anteriores ni opciones deshabilitadas.

## Mobile

- Áreas táctiles mínimas: 44×44 px.
- Texto principal mínimo recomendado: 16 px.
- Evitar acciones importantes dependientes de hover.
- Mantener acciones primarias en zona accesible al pulgar.
- Evitar solapamiento de elementos flotantes.
- No producir scroll horizontal.

## Accesibilidad

- Contraste WCAG AA.
- Foco visible.
- Botones con nombre accesible.
- Modales con foco inicial, Escape, bloqueo y restauración de foco.
- Jerarquía correcta de encabezados.
- Alt text útil en imágenes principales.
- Soporte para `prefers-reduced-motion`.
- No depender solo del color.

## Contenido

- Español argentino claro.
- Evitar clichés y urgencia falsa.
- No inventar autoridad, certificaciones o exclusividad.
- No traducir nombres comerciales.
- Explicar beneficios concretos.

## Criterios de aceptación

- Un usuario mobile puede llegar de home a WhatsApp sin ambigüedad.
- El carrito nunca supera stock conocido.
- Sommelier y carrito muestran el mismo SKU.
- El nombre mostrado coincide con Supabase.
- El mensaje de WhatsApp coincide con la reserva visible.
