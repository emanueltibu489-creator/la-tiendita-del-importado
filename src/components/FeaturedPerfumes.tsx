import { Product } from '../types';
import { getEffectivePrice, hasValidFlashOffer } from '../utils/pricing';

interface FeaturedPerfumesProps {
  perfumes: Product[];
  activeSku: string;
  onSelectPerfume: (sku: string) => void;
}

function formatBrand(value?: string): string {
  const cleaned = value?.trim();

  if (!cleaned) return 'Sin marca';

  return cleaned
    .split(/\s+/)
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ');
}

function FeaturedPerfumeCard({
  perfume,
  activeSku,
  onSelectPerfume,
}: {
  perfume: Product;
  activeSku: string;
  onSelectPerfume: (sku: string) => void;
}) {
  const isActive = perfume.sku === activeSku;
  const hasOffer = hasValidFlashOffer(perfume);
  const effectivePrice = getEffectivePrice(perfume);

  return (
    <button
      type="button"
      onClick={() => onSelectPerfume(perfume.sku)}
      className={`flex min-w-0 gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99] ${
        isActive
          ? 'border-[var(--color-luxury-gold)] bg-[var(--color-luxury-gold)]/10'
          : 'border-purple-900/40 bg-black/25'
      }`}
    >
      {perfume.image && (
        <img
          src={perfume.image}
          alt={perfume.name}
          className="h-24 w-20 shrink-0 rounded-xl object-cover"
          loading="lazy"
          translate="no"
        />
      )}

      <span className="flex min-w-0 flex-1 flex-col">
        <span
          translate="no"
          className="notranslate text-[10px] font-bold uppercase tracking-widest text-purple-300"
        >
          {formatBrand(perfume.brand)}
        </span>

        <span
          translate="no"
          className="notranslate mt-1 line-clamp-2 text-base font-bold leading-snug text-white"
        >
          {perfume.name}
        </span>

        {perfume.descripcion_corta && (
          <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {perfume.descripcion_corta}
          </span>
        )}

        <span className="mt-auto flex flex-col pt-2">
          {hasOffer && (
            <span className="text-xs font-semibold text-gray-500 line-through">
              ${perfume.price.toLocaleString('es-AR')}
            </span>
          )}
          <span className="text-sm font-bold text-[var(--color-luxury-gold)]">
            ${effectivePrice.toLocaleString('es-AR')}
          </span>
        </span>
      </span>
    </button>
  );
}

export function FeaturedPerfumes({
  perfumes,
  activeSku,
  onSelectPerfume,
}: FeaturedPerfumesProps) {
  const featured = perfumes.filter(
    (perfume) => perfume.badge === 'Destacado',
  );
  const flashOffers = perfumes.filter(
    (perfume) => perfume.badge === 'Oferta',
  );

  if (featured.length === 0 && flashOffers.length === 0) {
    return null;
  }

  return (
    <section className="lg:col-span-12">
      <div className="rounded-2xl border border-[var(--color-luxury-gold)]/20 bg-gradient-to-br from-purple-950/50 via-black/20 to-black/30 p-4 shadow-2xl sm:p-5">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-luxury-gold)]">
            Selección especial
          </span>
          <h2 className="mt-1 font-luxury text-2xl font-bold text-white sm:text-3xl">
            Destacados y oferta relámpago
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
            Perfumes elegidos para encontrar rápido una opción con stock real.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {featured.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-300">
                Destacados de la semana
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {featured.map((perfume) => (
                  <div key={perfume.sku}>
                    <FeaturedPerfumeCard
                      perfume={perfume}
                      activeSku={activeSku}
                      onSelectPerfume={onSelectPerfume}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {flashOffers.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-luxury-gold)]">
                Ofertas relámpago
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {flashOffers.map((perfume) => (
                  <div key={perfume.sku}>
                    <FeaturedPerfumeCard
                      perfume={perfume}
                      activeSku={activeSku}
                      onSelectPerfume={onSelectPerfume}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}