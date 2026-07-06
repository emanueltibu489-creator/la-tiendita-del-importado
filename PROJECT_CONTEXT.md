# Contexto del proyecto

Actualizado: 2026-07-06.

## Producto

Esta aplicación es el canal web oficial de La Tiendita del Importado (LTI), tienda argentina de productos importados. La especialidad principal es la perfumería árabe. También se ofrecen regalos, tecnología, termos, vasos, cosmética y otros productos seleccionados.

La aplicación debe:

- mostrar productos y stock reales;
- ayudar a elegir perfumes;
- facilitar consultas y reservas por WhatsApp;
- transmitir confianza y una experiencia de lujo accesible;
- funcionar correctamente primero en dispositivos móviles.

## Público

La audiencia incluye desde adolescentes hasta adultos mayores. Las necesidades principales son:

- encontrar una primera fragancia;
- comprar según presupuesto;
- elegir para uso diario, noche, evento o regalo;
- descubrir perfumería árabe;
- consultar una referencia específica;
- recibir asesoramiento antes de comprar.

## Propuesta de valor

LTI compite por curaduría, claridad, presentación y confianza, no solo por precio. La voz debe ser cercana, conocedora y argentina. El principio de marca es **premium entendible**.

## Stack actual

- React 19.
- TypeScript.
- Vite.
- Tailwind CSS 4.
- Express.
- Supabase JS.
- Gemini mediante `@google/genai`.
- Motion.
- Lucide React.

## Arquitectura actual

- `src/App.tsx`: estado principal, carga de perfumes, carrito y apertura de modales.
- `src/services/products.ts`: consulta y mapeo de perfumes desde Supabase.
- `src/supabase.ts`: cliente de Supabase.
- `src/components/PerfumeDetail.tsx`: selección y ficha de perfume.
- `src/components/SommelierModal.tsx`: Sommelier express y pestaña de IA.
- `src/components/CartSidebar.tsx`: reserva y mensaje de WhatsApp.
- `src/components/WhatsAppWidget.tsx`: consultas rápidas.
- `src/config/business.ts`: configuración comercial compartida.
- `src/data.ts`: datos estáticos temporales para compatibilidad, Bazar y Tecno.
- `server.ts`: servidor Express y endpoint de Gemini.

La aplicación es actualmente una SPA sin rutas independientes.

## Datos y fuente de verdad

- Perfumes visibles: `public.productos_perfumes` en Supabase.
- Clave comercial principal: `sku`.
- Los SKU se normalizan con `trim().toUpperCase()`.
- Los productos sin SKU, sin stock o con SKU duplicado se excluyen.
- Catálogo, ficha, carrito y Sommelier express trabajan con productos reales recibidos desde Supabase.
- Bazar y Tecno continúan siendo datos estáticos temporales.
- El Sommelier con Gemini todavía utiliza el catálogo estático del servidor. Esto está pendiente de migración.

## Flujo comercial actual

1. El usuario llega a la home.
2. Explora perfumería o abre el Sommelier.
3. Revisa una ficha y agrega productos al carrito, o completa el Sommelier.
4. Desde catálogo/ficha, el carrito permite varios productos.
5. Desde Sommelier express, reservar reemplaza el carrito por un único producto con cantidad 1.
6. El pedido se envía a WhatsApp con nombre, SKU, cantidad, precio unitario y subtotal.

## Configuración comercial confirmada

- WhatsApp oficial: `5493435049794`.
- El número debe consumirse únicamente desde `src/config/business.ts`.
- No está habilitada actualmente la envoltura de regalo.
- No inventar precios, stock, ofertas, urgencia ni beneficios.

## Reglas de producto

- El nombre comercial debe ser exactamente `nombre` de Supabase.
- No traducir, reinterpretar ni generar nombres de producto.
- No recomendar productos agotados.
- No usar UUID ni nombre como identidad alternativa cuando falta SKU.
- Packaging, logos, envases y tipografías de producto no deben modificarse.

## Estado Git conocido

Último commit verificado:

`be0fa0f Mejora flujo de Sommelier, carrito y WhatsApp`

Después de ese commit se realizaron nuevas correcciones documentadas en esta sesión. Verificar siempre `git status` antes de comenzar una tarea.
