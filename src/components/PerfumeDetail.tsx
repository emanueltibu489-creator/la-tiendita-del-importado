import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Compass, ShieldCheck } from 'lucide-react';

import { WHATSAPP_NUMBER } from '../config/business';
import { Product } from '../types';
import { getEffectivePrice, hasValidFlashOffer } from '../utils/pricing';
import { FeaturedPerfumes } from './FeaturedPerfumes';
import { ProductGallery } from './ProductGallery';
import {
  PerfumeFilters,
  PerfumeFilterValues,
} from './PerfumeFilters';

interface PerfumeDetailProps {
  perfumes: Product[];
  activePerfume: Product;
  onSelectPerfume: (sku: string) => void;
  onAddToCart: (product: Product) => void;
}

const EMPTY_FILTERS: PerfumeFilterValues = {
  query: '',
  gender: 'todos',
  profile: '',
  occasion: '',
  minPrice: '',
  maxPrice: '',
};

const MOBILE_ALL_PERFUMES_KEY = '__all_perfumes__';

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
function getBrandKey(value: string): string {
  return normalizeText(value || 'Sin marca') || 'sin-marca';
}

function formatBrandName(value: string): string {
  const cleaned = value.trim();

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

function chooseBrandName(current: string, next: string): string {
  const currentClean = current.trim();
  const nextClean = next.trim();

  if (!currentClean) return formatBrandName(nextClean);
  if (!nextClean) return formatBrandName(currentClean);

  const currentIsLowercase = currentClean === currentClean.toLowerCase();
  const nextIsNotLowercase = nextClean !== nextClean.toLowerCase();

  if (currentIsLowercase && nextIsNotLowercase) {
    return nextClean;
  }

  return currentClean;
}

function normalizeGender(
  value?: string,
): Exclude<PerfumeFilterValues['gender'], 'todos'> | '' {
  const normalized = normalizeText(value || '');

  if (normalized.includes('unisex')) return 'unisex';

  if (
    normalized.includes('masculino') ||
    normalized.includes('hombre')
  ) {
    return 'masculino';
  }

  if (
    normalized.includes('femenino') ||
    normalized.includes('mujer')
  ) {
    return 'femenino';
  }

  return '';
}

export function PerfumeDetail({
  perfumes,
  activePerfume,
  onSelectPerfume,
  onAddToCart,
}: PerfumeDetailProps) {
  const [filters, setFilters] =
    useState<PerfumeFilterValues>(EMPTY_FILTERS);

  const [expandedBrand, setExpandedBrand] = useState<string | null>(
    getBrandKey(activePerfume.brand),
  );
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);
  const [mobileSelectedBrandKey, setMobileSelectedBrandKey] =
    useState<string | null>(null);
  const profiles = useMemo(
    () =>
      [
        ...new Set(
          perfumes
            .map((perfume) => perfume.perfil_olfativo?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b, 'es')),
    [perfumes],
  );

  const occasions = useMemo(
    () =>
      [
        ...new Set(
          perfumes
            .map((perfume) => perfume.momento_ideal?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b, 'es')),
    [perfumes],
  );

  const filteredPerfumes = useMemo(() => {
    const query = normalizeText(filters.query);
    const profile = normalizeText(filters.profile);
    const occasion = normalizeText(filters.occasion);
    const minPrice =
      filters.minPrice === '' ? null : Number(filters.minPrice);
    const maxPrice =
      filters.maxPrice === '' ? null : Number(filters.maxPrice);

    return perfumes.filter((perfume) => {
      const matchesName =
        query === '' || normalizeText(perfume.name).includes(query);

      const matchesGender =
        filters.gender === 'todos' ||
        normalizeGender(perfume.genero) === filters.gender;

      const matchesProfile =
        profile === '' ||
        normalizeText(perfume.perfil_olfativo || '') === profile;

      const matchesOccasion =
        occasion === '' ||
        normalizeText(perfume.momento_ideal || '') === occasion;

      const matchesMinPrice =
        minPrice === null ||
        Number.isNaN(minPrice) ||
        getEffectivePrice(perfume) >= minPrice;

      const matchesMaxPrice =
        maxPrice === null ||
        Number.isNaN(maxPrice) ||
        getEffectivePrice(perfume) <= maxPrice;

      return (
        matchesName &&
        matchesGender &&
        matchesProfile &&
        matchesOccasion &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [filters, perfumes]);
    const perfumeGroups = useMemo(() => {
    const groups = new Map<
      string,
      { key: string; brand: string; perfumes: Product[] }
    >();

    filteredPerfumes.forEach((perfume) => {
      const key = getBrandKey(perfume.brand);
      const currentGroup = groups.get(key);

      if (currentGroup) {
        currentGroup.brand = chooseBrandName(
          currentGroup.brand,
          perfume.brand,
        );
        currentGroup.perfumes.push(perfume);
        return;
      }

      groups.set(key, {
        key,
        brand: formatBrandName(perfume.brand),
        perfumes: [perfume],
      });
    });

    return Array.from(groups.values()).sort((groupA, groupB) =>
      groupA.brand.localeCompare(groupB.brand, 'es'),
    );
  }, [filteredPerfumes]);

  const selectedMobileBrandGroup = perfumeGroups.find(
    (group) => group.key === mobileSelectedBrandKey,
  );

  useEffect(() => {
    const activeIsVisible = filteredPerfumes.some(
      (perfume) => perfume.sku === activePerfume.sku,
    );

    if (filteredPerfumes.length > 0 && !activeIsVisible) {
      onSelectPerfume(filteredPerfumes[0].sku);
    }
  }, [activePerfume.sku, filteredPerfumes, onSelectPerfume]);
  useEffect(() => {
    if (perfumeGroups.length === 0) {
      setExpandedBrand(null);
      return;
    }

    if (
      expandedBrand !== null &&
      !perfumeGroups.some((group) => group.key === expandedBrand)
    ) {
      setExpandedBrand(perfumeGroups[0].key);
    }
  }, [expandedBrand, perfumeGroups]);
  const activeHasOffer = hasValidFlashOffer(activePerfume);
  const activeEffectivePrice = getEffectivePrice(activePerfume);
  const deposit = activeEffectivePrice * 0.3;
  const salidaText = activePerfume.notes?.salida?.trim() || '';
  const estiloRaw = (
    activePerfume.metrics?.estilo || ''
  ).toLowerCase();
  const momentoRaw = (
    activePerfume.metrics?.momento || ''
  ).toLowerCase();
  const climaRaw = (
    activePerfume.metrics?.clima || ''
  ).toLowerCase();
  const proyeccionRaw = (
    activePerfume.metrics?.proyeccion || ''
  ).toLowerCase();

  const estiloTexto = estiloRaw.includes('dul')
    ? 'dulce y envolvente'
    : estiloRaw.includes('fresc')
      ? 'fresco y fácil de llevar'
      : estiloRaw.includes('amader')
        ? 'amaderado y con carácter'
        : estiloRaw.includes('eleg')
          ? 'elegante y con buena presencia'
          : estiloRaw.includes('unisex')
            ? 'versátil y muy llevadero'
            : estiloRaw || 'agradable y versátil';

  const momentoTexto = momentoRaw.includes('noche')
    ? 'para la noche, salidas o momentos donde querés destacar'
    : momentoRaw.includes('día') ||
        momentoRaw.includes('diario') ||
        momentoRaw.includes('oficina')
      ? 'para todos los días, oficina o salidas tranquilas'
      : momentoRaw.includes('versátil')
        ? 'para distintos momentos del día'
        : momentoRaw
          ? `para ${momentoRaw}`
          : 'para distintos momentos';

  const proyeccionTexto =
    proyeccionRaw.includes('alta') ||
    proyeccionRaw.includes('fuerte')
      ? 'Tiene buena presencia y se hace notar.'
      : proyeccionRaw.includes('media') ||
          proyeccionRaw.includes('moderada')
        ? 'Tiene una presencia equilibrada, sin resultar invasivo.'
        : proyeccionRaw.includes('suave') ||
            proyeccionRaw.includes('baja')
          ? 'Se siente más suave y cómodo para distancias cortas.'
          : '';

  const climaTexto =
    climaRaw && climaRaw !== 'todo el año'
      ? `Funciona especialmente bien en ${climaRaw}.`
      : climaRaw === 'todo el año'
        ? 'Es una opción que podés usar durante todo el año.'
        : '';

  const salidaDescripcion = salidaText
    ? `En la salida se perciben ${salidaText}.`
    : '';

  const generatedPerfumeDescription =
    `Un perfume ${estiloTexto}, ideal ${momentoTexto}. ` +
    `${proyeccionTexto} ${climaTexto} ${salidaDescripcion}`
      .replace(/\s+/g, ' ')
      .trim();

  const perfumeShortDescription =
    activePerfume.descripcion_corta?.trim() ||
    activePerfume.description?.trim() ||
    generatedPerfumeDescription;
  const handleFeaturedPerfumeSelect = (sku: string) => {
    onSelectPerfume(sku);

    window.setTimeout(() => {
      document
        .getElementById('perfume-sensorial-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };
  const handleRequestPerfumeQuote = () => {
    const message = [
      'Hola, estuve viendo el catálogo de La Tiendita del Importado.',
      'No encontré el perfume que buscaba y quisiera consultar si pueden conseguirlo por encargo.',
      '¿Me pasan precio estimado, demora y condiciones de reserva?',
    ].join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section
      id="perfumeria"
      className="grid grid-cols-1 items-start gap-8 overflow-x-hidden scroll-mt-24 lg:grid-cols-12"
    >
      <div className="hidden lg:col-span-12">
        <PerfumeFilters
          filters={filters}
          profiles={profiles}
          occasions={occasions}
          resultCount={filteredPerfumes.length}
          totalCount={perfumes.length}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <FeaturedPerfumes
        perfumes={perfumes}
        activeSku={activePerfume.sku}
        onSelectPerfume={handleFeaturedPerfumeSelect}
      />

      {filteredPerfumes.length === 0 ? (
        <div className="rounded-xl border border-purple-900/40 bg-black/20 px-4 py-12 text-center lg:col-span-12">
          <h3 className="text-base font-bold text-white">
            No encontramos perfumes
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Probá cambiar o limpiar los filtros.
          </p>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-3 lg:col-span-4 lg:pr-2">
            <div
              className="mb-1 flex items-center justify-between"
              id="perfume-sec-header"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-purple-300">
                Perfumes árabes seleccionados
              </h3>

              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-luxury-gold)]">
                Seña: 30%
              </span>
            </div>

            <button
              type="button"
              aria-expanded={isMobileCatalogOpen}
              aria-controls="perfume-brand-catalog"
              onClick={() => {
                if (isMobileCatalogOpen) {
                  setMobileSelectedBrandKey(null);
                }

                setIsMobileCatalogOpen(!isMobileCatalogOpen);
              }}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-purple-900/40 bg-black/25 px-4 py-3 text-left text-sm font-bold text-white lg:hidden"
            >
              <span>
                {isMobileCatalogOpen
                  ? 'Cerrar marcas y perfumes'
                  : 'Ver marcas y perfumes'}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-[var(--color-luxury-gold)] transition-transform ${
                  isMobileCatalogOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMobileCatalogOpen && (
              <div id="perfume-brand-catalog" className="space-y-2 lg:hidden">
                {mobileSelectedBrandKey === MOBILE_ALL_PERFUMES_KEY ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileSelectedBrandKey(null)}
                      className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-purple-900/40 bg-black/25 px-4 py-3 text-left text-sm font-bold text-white"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 rotate-90 text-[var(--color-luxury-gold)]"
                      />
                      <span>Volver a marcas</span>
                    </button>

                    <div className="rounded-xl border border-purple-900/40 bg-black/20">
                      <div className="flex items-center justify-between gap-3 border-b border-purple-900/40 px-4 py-3 text-base font-bold text-white">
                        <span>Todos los perfumes</span>
                      </div>

                      {filteredPerfumes.map((perfume) => {
                        const isActive = perfume.sku === activePerfume.sku;

                        return (
                          <button
                            key={perfume.sku}
                            type="button"
                            onClick={() => {
                              onSelectPerfume(perfume.sku);
                              setIsMobileCatalogOpen(false);
                              setMobileSelectedBrandKey(null);
                            }}
                            className={`flex min-h-11 w-full items-center justify-between gap-3 border-b border-purple-900/30 px-4 py-3 text-left last:border-b-0 ${
                              isActive ? 'bg-purple-950/60' : 'bg-black/10'
                            }`}
                          >
                            <span className="min-w-0">
                              <span
                                translate="no"
                                className="notranslate block truncate text-base font-bold text-white"
                              >
                                {perfume.name}
                              </span>

                              <span
                                translate="no"
                                className="notranslate mt-0.5 block truncate text-sm text-gray-400"
                              >
                                {formatBrandName(perfume.brand)}
                                {perfume.genero ? ` · ${perfume.genero}` : ''}
                              </span>
                            </span>

                            <span className="shrink-0 whitespace-nowrap text-sm font-bold text-[var(--color-luxury-gold)]">
                              ${getEffectivePrice(perfume).toLocaleString('es-AR')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : selectedMobileBrandGroup ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileSelectedBrandKey(null)}
                      className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-purple-900/40 bg-black/25 px-4 py-3 text-left text-sm font-bold text-white"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 rotate-90 text-[var(--color-luxury-gold)]"
                      />
                      <span>Volver a marcas</span>
                    </button>

                    <div className="rounded-xl border border-purple-900/40 bg-black/20">
                      <div
                        translate="no"
                        className="notranslate border-b border-purple-900/40 px-4 py-3 text-base font-bold text-white"
                      >
                        {selectedMobileBrandGroup.brand}
                      </div>

                      {selectedMobileBrandGroup.perfumes.map((perfume) => {
                        const isActive = perfume.sku === activePerfume.sku;

                        return (
                          <button
                            key={perfume.sku}
                            type="button"
                            onClick={() => {
                              onSelectPerfume(perfume.sku);
                              setIsMobileCatalogOpen(false);
                              setMobileSelectedBrandKey(null);
                            }}
                            className={`flex min-h-11 w-full items-center justify-between gap-3 border-b border-purple-900/30 px-4 py-3 text-left last:border-b-0 ${
                              isActive ? 'bg-purple-950/60' : 'bg-black/10'
                            }`}
                          >
                            <span className="min-w-0">
                              <span
                                translate="no"
                                className="notranslate block truncate text-base font-bold text-white"
                              >
                                {perfume.name}
                              </span>

                              {perfume.genero && (
                                <span className="mt-0.5 block text-sm text-gray-400">
                                  {perfume.genero}
                                </span>
                              )}
                            </span>

                            <span className="shrink-0 whitespace-nowrap text-sm font-bold text-[var(--color-luxury-gold)]">
                              ${getEffectivePrice(perfume).toLocaleString('es-AR')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-purple-900/40 bg-black/20">
                    <div className="border-b border-purple-900/40 px-4 py-3 text-sm font-bold text-white">
                      Elegí una marca
                    </div>

                    <button
                      type="button"
                      onClick={() => setMobileSelectedBrandKey(MOBILE_ALL_PERFUMES_KEY)}
                      className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-purple-900/30 px-4 py-3 text-left"
                    >
                      <span className="min-w-0 truncate text-base font-bold text-white">
                        Ver todos los perfumes
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 -rotate-90 text-[var(--color-luxury-gold)]"
                      />
                    </button>

                    {perfumeGroups.map((group) => (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => setMobileSelectedBrandKey(group.key)}
                        className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-purple-900/30 px-4 py-3 text-left last:border-b-0"
                      >
                        <span
                          translate="no"
                          className="notranslate min-w-0 truncate text-base font-bold text-white"
                        >
                          {group.brand}
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className="h-5 w-5 -rotate-90 text-[var(--color-luxury-gold)]"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="hidden space-y-2 lg:block lg:max-h-[calc(100vh-290px)] lg:overflow-y-auto">
              {perfumeGroups.map((group, groupIndex) => {
                const isOpen = expandedBrand === group.key;
                const panelId = `perfume-brand-${groupIndex}`;

                return (
                  <div
                    key={group.key}
                    className="overflow-hidden rounded-xl border border-purple-900/40 bg-black/20"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setExpandedBrand(isOpen ? null : group.key)
                      }
                      className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-luxury-gold)]"
                    >
                      <span
                        translate="no"
                        className="notranslate min-w-0 truncate text-base font-bold text-white"
                      >
                        {group.brand}
                      </span>

                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 text-[var(--color-luxury-gold)] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        className="border-t border-purple-900/40"
                      >
                        {group.perfumes.map((perfume) => {
                          const isActive = perfume.sku === activePerfume.sku;

                          return (
                            <button
                              key={perfume.sku}
                              id={`btn-${perfume.sku}`}
                              type="button"
                              onClick={() => onSelectPerfume(perfume.sku)}
                              className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border-b border-purple-900/30 px-4 py-3 text-left last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-luxury-gold)] ${
                                isActive
                                  ? 'bg-purple-950/60'
                                  : 'bg-black/10'
                              }`}
                            >
                              <span className="min-w-0">
                                <span
                                  translate="no"
                                  className="notranslate block truncate text-base font-bold text-white"
                                >
                                  {perfume.name}
                                </span>

                                {perfume.genero && (
                                  <span className="mt-0.5 block text-sm text-gray-400">
                                    {perfume.genero}
                                  </span>
                                )}
                              </span>

                              <span className="shrink-0 whitespace-nowrap text-sm font-bold text-[var(--color-luxury-gold)]">
                                ${getEffectivePrice(perfume).toLocaleString('es-AR')}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl border border-[var(--color-luxury-gold)]/25 bg-[var(--color-luxury-gold)]/5 p-4">
              <h4 className="text-sm font-bold text-white">
                ¿No encontraste tu perfume?
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-300">
                Escribinos por WhatsApp y consultamos si podemos conseguirlo para vos.
              </p>
              <button
                type="button"
                onClick={handleRequestPerfumeQuote}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-luxury-gold)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-purple-950 transition-transform active:scale-[0.98] sm:w-auto"
              >
                Cotizar por WhatsApp
              </button>
            </div>
          </div>

          <div
            id="perfume-sensorial-panel"
            className="glass-card relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-luxury-gold)]/20 p-6 shadow-2xl sm:p-8 lg:col-span-8"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activePerfume.sku}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex min-w-0 flex-1 flex-col justify-between"
              >
                <div className="min-w-0">
                  <div className="mb-6 flex flex-col gap-4 border-b border-purple-950 pb-6 md:flex-row md:items-start md:justify-between md:gap-6">
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-4 sm:flex-row sm:gap-5">
                      <ProductGallery perfume={activePerfume} />

                      <div className="min-w-0 flex-1">
                        <span
                          translate="no"
                          className="notranslate block break-words text-xs font-bold uppercase tracking-widest text-purple-400"
                        >
                          {activePerfume.brand}
                        </span>

                        <h2
                          translate="no"
                          className="notranslate mt-1 break-words font-luxury text-xl font-bold leading-snug tracking-wide text-white sm:text-2xl lg:text-3xl"
                        >
                          {activePerfume.name}
                        </h2>

                        {activePerfume.badge && (
                          <span className="mt-1.5 inline-block max-w-full break-words rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-luxury-gold)]">
                            {activePerfume.badge}
                          </span>
                        )}

                        {perfumeShortDescription && (
                          <p className="mt-3 max-w-xl line-clamp-3 break-words text-sm font-light leading-relaxed text-gray-300">
                            {perfumeShortDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full shrink-0 self-start rounded-lg border border-[var(--color-luxury-gold)]/10 bg-[var(--color-luxury-gold)]/5 p-3.5 text-left md:w-auto md:min-w-[10.5rem] md:border-none md:bg-transparent md:p-0 md:text-right">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Reserva con seña del 30%
                      </span>

                      <span className="block break-words text-xl font-bold tracking-wider text-[var(--color-luxury-gold)] tabular-nums sm:text-2xl lg:text-3xl">
                        ${activeEffectivePrice.toLocaleString('es-AR')} ARS
                      </span>

                      {activeHasOffer && (
                        <span className="mt-0.5 block break-words text-xs font-semibold text-gray-500 line-through tabular-nums">
                          ${activePerfume.price.toLocaleString('es-AR')} ARS
                        </span>
                      )}

                      <span className="mt-0.5 block break-words text-[10px] text-gray-400 tabular-nums">
                        Se reserva con ${deposit.toLocaleString('es-AR')} ARS
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
                    <Compass className="h-4 w-4 animate-spin-slow text-[var(--color-luxury-gold)]" />
                    Perfil del perfume y cómo se siente
                  </h3>

                  <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="relative min-w-0 space-y-4 overflow-hidden rounded-xl border border-purple-950/80 bg-black/40 p-5">
                      <div className="absolute bottom-4 left-0 top-4 w-[2.5px] bg-gradient-to-b from-[var(--color-luxury-gold)] via-purple-600 to-indigo-400" />

                      <div className="min-w-0 pl-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Salida
                          </h4>
                          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                            Primeros 15 min
                          </span>
                        </div>
                        <p className="mt-1.5 break-words text-xs font-light leading-relaxed text-gray-300">
                          {activePerfume.notes?.salida}
                        </p>
                      </div>

                      <div className="h-px bg-purple-950/60" />

                      <div className="min-w-0 pl-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Corazón
                          </h4>
                          <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
                            Dura 4-6 horas
                          </span>
                        </div>
                        <p className="mt-1.5 break-words text-xs font-light leading-relaxed text-gray-300">
                          {activePerfume.notes?.corazon}
                        </p>
                      </div>

                      <div className="h-px bg-purple-950/60" />

                      <div className="min-w-0 pl-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Fondo
                          </h4>
                          <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-luxury-gold)]">
                            Fijación residual
                          </span>
                        </div>
                        <p className="mt-1.5 break-words text-xs font-light leading-relaxed text-gray-300">
                          {activePerfume.notes?.fondo}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-0 auto-rows-fr grid-cols-2 gap-3.5">
                      <MetricCard
                        icon={activePerfume.metrics?.iconMomento}
                        label="Momento"
                        value={activePerfume.metrics?.momento}
                      />
                      <MetricCard
                        icon={activePerfume.metrics?.iconClima}
                        label="Clima ideal"
                        value={activePerfume.metrics?.clima}
                      />
                      <MetricCard
                        icon={activePerfume.metrics?.iconEstilo}
                        label="Estilo"
                        value={activePerfume.metrics?.estilo}
                      />
                      <MetricCard
                        icon={activePerfume.metrics?.iconProyeccion}
                        label="Proyección"
                        value={activePerfume.metrics?.proyeccion}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-purple-950 pt-5 sm:flex-row">
                  <p className="flex max-w-md items-start gap-1.5 text-center text-[11px] leading-relaxed text-gray-400 sm:text-left">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>
                      Al reservar, tu perfume queda guardado en el carrito para
                      enviarnos tu pedido por WhatsApp y coordinar entrega o
                      envío.
                    </span>
                  </p>

                  <button
                    id="add-to-cart-perfume-btn"
                    onClick={() => onAddToCart(activePerfume)}
                    className="w-full shrink-0 cursor-pointer rounded-xl border border-[var(--color-luxury-gold)]/20 bg-gradient-to-r from-purple-800 to-indigo-800 px-8 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] hover:text-purple-950 hover:shadow-[0_0_25px_rgba(110,68,178,0.3)] active:scale-[0.98] sm:w-auto"
                  >
                    Sumar a mi reserva
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  );
}

interface MetricCardProps {
  icon?: string;
  label: string;
  value?: string;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="flex min-h-[7.5rem] min-w-0 flex-col items-center justify-center rounded-xl border border-purple-950/40 bg-black/20 p-4 text-center transition-colors duration-300 hover:bg-black/35">
      <span className="shrink-0 text-3xl">{icon}</span>
      <span className="mt-2 text-xs font-bold uppercase tracking-wider text-white">
        {label}
      </span>
      <span className="mt-0.5 line-clamp-2 w-full break-words text-xs font-medium text-purple-300">
        {value}
      </span>
    </div>
  );
}

