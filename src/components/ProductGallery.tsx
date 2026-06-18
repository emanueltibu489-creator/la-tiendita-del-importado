import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Product } from '../types';

const LOCAL_IMAGES: Record<string, string> = {
  asad: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  yara: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
  valhalla: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
  khamrah: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
};

function getPerfumeImage(perfume: Product): string {
  if (perfume.image) return perfume.image;
  return LOCAL_IMAGES[perfume.imageType] ?? 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80';
}

function getProductImages(perfume: Product): string[] {
  if (perfume.images && perfume.images.length > 0) return perfume.images;
  return [getPerfumeImage(perfume)];
}

interface ProductGalleryProps {
  perfume: Product;
}

export function ProductGallery({ perfume }: ProductGalleryProps) {
  const images = getProductImages(perfume);
  const hasMultiple = images.length > 1;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
    setLightboxIndex(0);
    setIsLightboxOpen(false);
  }, [perfume.id]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + images.length) % images.length);
      if (event.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

  const openLightbox = useCallback(() => {
    setLightboxIndex(selectedIndex);
    setIsLightboxOpen(true);
  }, [selectedIndex]);

  const goToPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  return (
    <>
      <div className="w-full sm:w-[11.5rem] md:w-[13rem] shrink-0">
        <button
          type="button"
          onClick={openLightbox}
          className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[var(--color-luxury-gold)]/30 shadow-lg bg-purple-950/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-luxury-gold)]/50"
          aria-label={`Ver imagen ampliada de ${perfume.name}`}
        >
          <img
            src={images[selectedIndex]}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-gray-200 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn className="w-3 h-3 text-[var(--color-luxury-gold)]" />
            Ampliar
          </div>
        </button>

        {hasMultiple && (
          <div className="flex gap-2 mt-2.5">
            {images.map((src, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={`${perfume.id}-thumb-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative flex-1 aspect-square rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-luxury-gold)]/50 ${
                    isSelected
                      ? 'border-[var(--color-luxury-gold)]/70 shadow-[0_0_12px_rgba(212,175,55,0.25)] ring-1 ring-[var(--color-luxury-gold)]/30'
                      : 'border-purple-900/50 opacity-70 hover:opacity-100 hover:border-purple-500/40'
                  }`}
                  aria-label={`Ver imagen ${index + 1} de ${perfume.name}`}
                  aria-current={isSelected ? 'true' : undefined}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 py-8"
              onClick={() => setIsLightboxOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={`Galería de ${perfume.name}`}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-gray-300 transition-colors hover:border-[var(--color-luxury-gold)]/40 hover:text-white cursor-pointer"
                aria-label="Cerrar galería"
              >
                <X className="w-5 h-5" />
              </button>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-3 sm:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-gray-300 transition-colors hover:border-[var(--color-luxury-gold)]/40 hover:text-white cursor-pointer"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-3 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/50 text-gray-300 transition-colors hover:border-[var(--color-luxury-gold)]/40 hover:text-white cursor-pointer"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative max-h-[80vh] max-w-4xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-2xl overflow-hidden border border-[var(--color-luxury-gold)]/20 shadow-2xl bg-purple-950/40">
                  <img
                    src={images[lightboxIndex]}
                    alt={`${perfume.name} — imagen ${lightboxIndex + 1}`}
                    className="max-h-[70vh] w-full object-contain"
                  />
                </div>

                {hasMultiple && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {images.map((_, index) => (
                        <button
                          key={`dot-${index}`}
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            index === lightboxIndex
                              ? 'w-6 bg-[var(--color-luxury-gold)]'
                              : 'w-1.5 bg-white/30 hover:bg-white/50'
                          }`}
                          aria-label={`Ir a imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                      {lightboxIndex + 1} / {images.length}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
