import { Product } from '../types';

export function hasValidFlashOffer(product: Product): boolean {
  const offerPrice = product.offerPrice ?? 0;
  const stock = product.stock ?? 0;

  return Boolean(
    product.isFlashOffer &&
      offerPrice > 0 &&
      offerPrice < product.price &&
      stock > 0,
  );
}

export function getEffectivePrice(product: Product): number {
  return hasValidFlashOffer(product) ? product.offerPrice! : product.price;
}