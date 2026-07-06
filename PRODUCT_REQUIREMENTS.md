# Requisitos de producto

## Propósito

La aplicación debe aumentar consultas, reservas y confianza para La Tiendita del Importado, con foco principal en perfumería árabe.

## Objetivos medibles

- Aumentar aperturas de WhatsApp con contexto de producto.
- Reducir consultas sin SKU o sin producto identificado.
- Aumentar finalización del Sommelier.
- Evitar pedidos con cantidad superior al stock.
- Evitar recomendaciones de productos agotados.
- Mantener consistencia entre catálogo, carrito y mensaje.

## Requisitos funcionales actuales

### Productos

- Los perfumes se cargan desde Supabase.
- Cada producto requiere SKU.
- Solo se muestran productos con stock positivo.
- El nombre comercial procede de `nombre`.
- Productos inválidos no rompen la aplicación.

### Catálogo y ficha

- El usuario puede seleccionar un perfume.
- La ficha muestra información olfativa e imágenes.
- Agregar desde catálogo/ficha conserva carrito múltiple.
- La selección se mantiene por SKU.

### Sommelier express

- Recibe productos disponibles desde la aplicación.
- No importa catálogo estático.
- Pregunta orientación, aroma, ocasión y proyección.
- Recomienda un producto real.
- Muestra hasta dos alternativas diferentes.
- Si falta coincidencia de orientación, explica la alternativa.
- Reservar reemplaza el carrito por un único producto.

### Carrito

- Identifica líneas por SKU.
- Agrupa el mismo SKU.
- Limita cantidad por stock cuando está disponible.
- Permite sumar, restar, quitar y vaciar.
- Calcula subtotales y total.
- No incluye envoltura de regalo.

### WhatsApp

- Usa el número oficial centralizado.
- El mensaje se crea en el momento del clic.
- Incluye los datos actuales de la reserva.
- Abre una conversación con texto codificado.

## Requisitos de datos

- SKU único y estable.
- Stock y precio numéricos válidos.
- Nombres exactos.
- Campos olfativos opcionales, sin inventar valores técnicos.
- Los fallbacks editoriales deben ser neutrales.
- No utilizar productos estáticos como disponibilidad real.

## Requisitos no funcionales

- TypeScript sin errores.
- Build de producción correcto.
- Sin secretos privados en frontend.
- Rendimiento aceptable en mobile.
- Interfaz accesible mediante teclado.
- Errores recuperables y comprensibles.
- Cambios versionados en Git.

## Requisitos comerciales

- WhatsApp es el canal de consulta/cierre.
- No prometer stock hasta validarlo.
- No aplicar escasez o urgencia falsas.
- No mostrar servicios no vigentes.
- Precio, seña y condiciones deben estar centralizados cuando se estabilicen.

## Fuera de alcance actual

- Pago online.
- Checkout transaccional.
- Gestión de usuarios.
- Historial de pedidos.
- Panel administrativo.
- Automatizaciones de marketing.
- Migración completa de Bazar/Tecno.

Estos puntos requieren definición comercial antes de implementación.

## Pendientes de decisión

- ¿Reserva o compra es el término principal?
- ¿La seña del 30% aplica a todos los productos?
- ¿Qué formas de pago están vigentes?
- ¿Qué política de cambios corresponde?
- ¿Qué alcance geográfico y costo de envío son reales?
- ¿Debe persistirse el carrito?
- ¿Bazar y Tecno seguirán en la misma experiencia?
- ¿Se capturarán datos de newsletter?

## Criterio general de terminado

Una función está terminada cuando:

- usa datos reales;
- tiene estado de error y vacío;
- funciona en mobile;
- no rompe stock ni SKU;
- pasa `npm run lint`;
- se verificó el flujo visible;
- quedó documentada.
