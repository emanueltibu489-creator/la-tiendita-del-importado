# La Tiendita del Importado

Aplicación web de La Tiendita del Importado para mostrar productos importados, con foco actual en perfumes árabes.

## Funciones actuales

- Catálogo de perfumes cargado desde Supabase.
- Stock real y SKU como identidad principal.
- Ofertas relámpago y destacados desde datos reales.
- Ficha de perfume con imágenes, notas y descripción.
- Carrito/reserva por SKU.
- Mensaje de WhatsApp con nombre, SKU, cantidad, precio unitario y subtotal.
- Sommelier express con productos disponibles.
- CTA para cotizar por WhatsApp productos que no aparecen en catálogo.

## Flujo de datos

Google Sheets → Supabase → App.

La app no debe inventar stock, precios, descuentos ni nombres comerciales.

## Comandos

```powershell
npm install
npm run dev
npm run lint
npm run build
```

## Pendientes principales

- Migrar la asesoría IA/Gemini para que use productos reales desde Supabase.
- Revisar RLS y permisos públicos de Supabase.
- Mejorar metadata social/Open Graph antes de una campaña más amplia.
- Agregar medición de eventos cuando se defina herramienta y política.