import { supabase } from '../supabase';
import { Product } from '../types';

interface SupabaseProductRow {
  sku: string | null;
  marca: string | null;
  nombre: string | null;
  precio_ars: number | string | null;
  stock: number | string | null;
  categoria: string | null;
  genero: string | null;
  notas_salida: string | null;
  notas_corazon: string | null;
  notas_fondo: string | null;
  es_oferta_relampago: boolean | null;
  es_destacado_semana: boolean | null;
  imagen_url_1: string | null;
  imagen_url_2: string | null;
  imagen_url_3: string | null;
  descripcion_corta: string | null;
  perfil_olfativo: string | null;
  momento_ideal: string | null;
  estacion_ideal: string | null;
  proyeccion: string | null;
}

const PRODUCT_COLUMNS = `
  sku,
  marca,
  nombre,
  precio_ars,
  stock,
  categoria,
  genero,
  notas_salida,
  notas_corazon,
  notas_fondo,
  es_oferta_relampago,
  es_destacado_semana,
  imagen_url_1,
  imagen_url_2,
  imagen_url_3,
  descripcion_corta,
  perfil_olfativo,
  momento_ideal,
  estacion_ideal,
  proyeccion
`;

function mapSupabaseProduct(row: SupabaseProductRow): Product | null {
  const sku = row.sku?.trim().toUpperCase();
  const stock = Number(row.stock) || 0;

  if (!sku) {
    console.warn('Producto excluido por falta de SKU.', {
      nombre: row.nombre,
    });
    return null;
  }

  if (stock <= 0) {
    return null;
  }

  const images = [
    row.imagen_url_1,
    row.imagen_url_2,
    row.imagen_url_3,
  ].filter((image): image is string => Boolean(image));

  return {
    id: sku,
    sku,
    brand: row.marca || 'Sin marca',
    name: row.nombre || 'Producto sin nombre',
    price: Number(row.precio_ars) || 0,
    stock,
    category: 'Perfumería',
    description:
      row.descripcion_corta ||
      row.notas_salida ||
      'Fragancia importada seleccionada.',
    shortDesc:
      row.descripcion_corta ||
      row.notas_corazon ||
      'Descubrí esta fragancia exclusiva.',
    descripcion_corta: row.descripcion_corta || '',
    perfil_olfativo: row.perfil_olfativo || '',
    genero: row.genero || '',
    momento_ideal: row.momento_ideal || '',
    estacion_ideal: row.estacion_ideal || '',
    proyeccion: row.proyeccion || '',
    character: row.notas_fondo || 'Selección especial',
    notes: {
      salida: row.notas_salida || 'Sin especificar',
      corazon: row.notas_corazon || 'Sin especificar',
      fondo: row.notas_fondo || 'Sin especificar',
    },
    metrics: {
      momento: row.momento_ideal || 'Versátil',
      iconMomento: '✨',
      clima: row.estacion_ideal || 'Todo el año',
      iconClima: '☀️',
      estilo: row.perfil_olfativo || row.genero || 'Unisex',
      iconEstilo: '🖤',
      proyeccion: row.proyeccion || 'Consultar',
      iconProyeccion: '💨',
    },
    imageType: sku.toLowerCase(),
    image: images[0],
    images,
    badge: row.es_destacado_semana
      ? 'Destacado'
      : row.es_oferta_relampago
        ? 'Oferta'
        : undefined,
  };
}

export async function getAvailablePerfumes(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos_perfumes')
    .select(PRODUCT_COLUMNS)
    .gt('stock', 0)
    .order('nombre', { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los perfumes: ${error.message}`);
  }

  const products: Product[] = [];
  const seenSkus = new Set<string>();

  for (const row of (data || []) as SupabaseProductRow[]) {
    const product = mapSupabaseProduct(row);
    if (!product) continue;

    if (seenSkus.has(product.sku)) {
      console.warn('Producto excluido por SKU duplicado.', {
        sku: product.sku,
        nombre: product.name,
      });
      continue;
    }

    seenSkus.add(product.sku);
    products.push(product);
  }

  return products;
}
