# Esquema Supabase

## Alcance

Este documento describe el contrato utilizado por la aplicación. No sustituye una migración ni confirma restricciones internas que no fueron inspeccionadas.

## Proyecto

- Project ref: `npszwrggqidncvqlvqvw`.
- Tabla consumida: `public.productos_perfumes`.
- Storage público observado: bucket/ruta `productos`.

No guardar aquí claves privadas, `service_role`, contraseñas o tokens.

## Tabla `public.productos_perfumes`

Campos consumidos por la aplicación:

| Campo | Tipo esperado en frontend | Uso |
|---|---|---|
| `sku` | `string` | Identidad comercial obligatoria |
| `marca` | `string \| null` | Marca |
| `nombre` | `string \| null` | Nombre comercial exacto |
| `ml` | pendiente de mapear | Volumen |
| `precio_ars` | `number \| string \| null` | Precio |
| `stock` | `number \| string \| null` | Disponibilidad y límite de carrito |
| `categoria` | `string \| null` | Categoría |
| `genero` | `string \| null` | Orientación del perfume |
| `notas_salida` | `string \| null` | Notas iniciales |
| `notas_corazon` | `string \| null` | Notas medias |
| `notas_fondo` | `string \| null` | Notas de fondo |
| `es_oferta_relampago` | `boolean \| null` | Badge de oferta |
| `es_destacado_semana` | `boolean \| null` | Badge destacado |
| `imagen_url_1` | `string \| null` | Imagen principal |
| `imagen_url_2` | `string \| null` | Imagen secundaria |
| `imagen_url_3` | `string \| null` | Imagen secundaria |
| `descripcion_corta` | `string \| null` | Resumen |
| `perfil_olfativo` | `string \| null` | Perfil para ficha y Sommelier |
| `momento_ideal` | `string \| null` | Ocasión |
| `estacion_ideal` | `string \| null` | Estación/clima |
| `proyeccion` | `string \| null` | Intensidad/proyección |

## Reglas de aplicación

- Normalizar SKU con `trim().toUpperCase()`.
- Excluir filas sin SKU.
- Excluir filas con `stock <= 0` del catálogo disponible.
- Excluir SKU duplicados y emitir advertencia.
- Usar exclusivamente `nombre` como nombre comercial.
- No usar nombre, marca ni UUID como fallback de identidad.
- Consultar columnas explícitas; no usar `select('*')`.
- Ordenar perfumes por `nombre`.

## Mapeo a `Product`

| Supabase | `Product` |
|---|---|
| `sku` | `sku` e `id` temporal |
| `marca` | `brand` |
| `nombre` | `name` |
| `precio_ars` | `price` |
| `stock` | `stock` |
| `genero` | `genero` |
| `descripcion_corta` | `description`, `shortDesc`, `descripcion_corta` |
| `perfil_olfativo` | `perfil_olfativo`, parte de `metrics.estilo` |
| `momento_ideal` | `momento_ideal`, `metrics.momento` |
| `estacion_ideal` | `estacion_ideal`, `metrics.clima` |
| `proyeccion` | `proyeccion`, `metrics.proyeccion` |
| notas | `notes` |
| imágenes | `image`, `images` |

## Restricciones pendientes de confirmar

No afirmar como existentes hasta verificarlas:

- `sku` con `NOT NULL`;
- índice `UNIQUE` sobre SKU normalizado;
- `stock >= 0`;
- `precio_ars >= 0`;
- RLS habilitado;
- política `SELECT` para `anon`;
- permisos del Data API;
- políticas de lectura del Storage.

## Recomendaciones de esquema

Aplicar solo con autorización:

1. Convertir SKU en obligatorio y único.
2. Añadir checks para stock y precio no negativos.
3. Mantener RLS habilitado en `public`.
4. Crear una política pública de solo lectura para catálogo.
5. Generar tipos TypeScript desde Supabase.
6. Versionar cambios mediante migraciones.

## Seguridad

- El frontend solo puede usar una clave publicable.
- Nunca exponer `service_role`.
- RLS es obligatorio como defensa del Data API.
- Las futuras tablas de clientes o pedidos no deben usar políticas públicas de lectura.
