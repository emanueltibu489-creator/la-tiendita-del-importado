import { Check, Clock } from 'lucide-react';
import { Product } from '../types';

/** Los productos sin stock se siguen mostrando y vendiendo (se coordinan por WhatsApp); los que tienen stock llevan esta marca. */
export function tieneEntregaInmediata(product: Product): boolean {
  return (product.stock ?? 0) > 0;
}

/** Verde "Entrega inmediata" si hay stock; dorado "A pedido" si se trae por encargo. */
export function EntregaInmediata({ product, compact = false }: { product: Product; compact?: boolean }) {
  const enStock = tieneEntregaInmediata(product);
  const Icon = enStock ? Check : Clock;
  const texto = enStock ? 'Entrega inmediata' : 'A pedido';

  if (compact) {
    return (
      <span
        className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold ${
          enStock ? 'text-emerald-300' : 'text-amber-200'
        }`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {texto}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
        enStock
          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-300/30 bg-amber-400/10 text-amber-200'
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {texto}
    </span>
  );
}
