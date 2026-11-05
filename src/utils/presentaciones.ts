import { Product } from '../types';

// Un mismo perfume en varios tamaños: en la planilla son SKU separados con el mismo "grupo";
// en la web se ve una sola tarjeta y en la ficha se elige el tamaño.

function mlNumber(product: Product): number {
  return Number.parseFloat(String(product.ml ?? '').replace(',', '.')) || 0;
}

export function isSamePerfume(a: Product, b: Product): boolean {
  return a.sku === b.sku || (Boolean(a.grupo) && a.grupo === b.grupo);
}

/** Los tamaños del perfume, de menor a mayor. Si no tiene grupo, solo él. */
export function getPresentaciones(perfumes: Product[], product: Product): Product[] {
  if (!product.grupo) return [product];
  return perfumes
    .filter((perfume) => perfume.grupo === product.grupo)
    .sort((a, b) => mlNumber(a) - mlNumber(b));
}

// Para la tarjeta del grupo se prefiere un tamaño con stock y, entre esos, el más chico
function isBetterCard(candidate: Product, current: Product): boolean {
  const candidateInStock = (candidate.stock ?? 0) > 0;
  const currentInStock = (current.stock ?? 0) > 0;
  if (candidateInStock !== currentInStock) return candidateInStock;
  return mlNumber(candidate) < mlNumber(current);
}

/** Deja una sola tarjeta por grupo, en el lugar donde aparecía el grupo. */
export function onePerPerfume(perfumes: Product[]): Product[] {
  const bestByGroup = new Map<string, Product>();
  perfumes.forEach((perfume) => {
    if (!perfume.grupo) return;
    const current = bestByGroup.get(perfume.grupo);
    if (!current || isBetterCard(perfume, current)) bestByGroup.set(perfume.grupo, perfume);
  });

  const seenGroups = new Set<string>();
  return perfumes.flatMap((perfume) => {
    if (!perfume.grupo) return [perfume];
    if (seenGroups.has(perfume.grupo)) return [];
    seenGroups.add(perfume.grupo);
    return [bestByGroup.get(perfume.grupo)!];
  });
}
