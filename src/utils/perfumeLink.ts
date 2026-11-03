import { Product } from '../types';

// Link propio por perfume: ?perfume=odyssey-mandarin-sky-100ml
// Lleva marca, nombre y ml para que no se repita (Aqua Kiss 236 y 250 ml son dos links distintos).
export const PERFUME_PARAM = 'perfume';

export function getPerfumeSlug(perfume: Product): string {
  const ml = perfume.ml?.toString().toLowerCase().replace(/ml/g, '').trim();
  return [perfume.brand, perfume.name, ml ? `${ml}ml` : '']
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Acepta el link nuevo o el SKU, por si alguien lo pasa así
export function findPerfumeFromUrl(perfumes: Product[]): Product | undefined {
  const value = new URLSearchParams(window.location.search).get(PERFUME_PARAM)?.trim().toLowerCase();
  if (!value) return undefined;
  return perfumes.find(
    (perfume) => getPerfumeSlug(perfume) === value || perfume.sku.toLowerCase() === value,
  );
}

export function getPerfumeUrl(perfume: Product): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set(PERFUME_PARAM, getPerfumeSlug(perfume));
  return url.toString();
}

// Cambia la dirección sin recargar ni sumar pasos al botón "atrás"
export function showPerfumeInUrl(perfume: Product) {
  try {
    window.history.replaceState(window.history.state, '', getPerfumeUrl(perfume));
  } catch {
    // Si el navegador no deja, la web sigue andando igual
  }
}
