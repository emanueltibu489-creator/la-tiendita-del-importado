import { Check } from 'lucide-react';
import { Product } from '../types';

/** Los productos sin stock se siguen mostrando y vendiendo (se coordinan por WhatsApp); los que tienen stock llevan esta marca. */
export function tieneEntregaInmediata(product: Product): boolean {
  return (product.stock ?? 0) > 0;
}

export function EntregaInmediata({ product, compact = false }: { product: Product; compact?: boolean }) {
  if (!tieneEntregaInmediata(product)) return null;

  if (compact) {
    return (
      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
        <Check className="h-3 w-3" aria-hidden="true" />
        Entrega inmediata
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
      <Check className="h-3 w-3" aria-hidden="true" />
      Entrega inmediata
    </span>
  );
}
