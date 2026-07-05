import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { Compass, ShieldCheck } from 'lucide-react';
import { ProductGallery } from './ProductGallery';

interface PerfumeDetailProps {
  perfumes: Product[];
  activePerfume: Product;
  onSelectPerfume: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const BRAND_COLORS: Record<string, string> = {
  yara: 'text-pink-400',
  asad: 'text-amber-500',
  valhalla: 'text-emerald-400',
  khamrah: 'text-orange-400',
  '9pm-elixir': 'text-violet-400',
  supremacy: 'text-sky-400',
};

export function PerfumeDetail({
  perfumes,
  activePerfume,
  onSelectPerfume,
  onAddToCart,
}: PerfumeDetailProps) {
  const deposit = activePerfume.price * 0.3;
  const salidaText = activePerfume.notes?.salida?.trim() || '';
  const estiloRaw = (activePerfume.metrics?.estilo || '').toLowerCase();
  const momentoRaw = (activePerfume.metrics?.momento || '').toLowerCase();
  const climaRaw = (activePerfume.metrics?.clima || '').toLowerCase();
  const proyeccionRaw = (activePerfume.metrics?.proyeccion || '').toLowerCase();
  
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
    : estiloRaw
    ? estiloRaw
    : 'agradable y versátil';
  
  const momentoTexto = momentoRaw.includes('noche')
    ? 'para la noche, salidas o momentos donde querés destacar'
    : momentoRaw.includes('día') || momentoRaw.includes('diario') || momentoRaw.includes('oficina')
    ? 'para todos los días, oficina o salidas tranquilas'
    : momentoRaw.includes('versátil')
    ? 'para distintos momentos del día'
    : momentoRaw
    ? `para ${momentoRaw}`
    : 'para distintos momentos';
  
  const proyeccionTexto = proyeccionRaw.includes('alta') || proyeccionRaw.includes('fuerte')
    ? 'Tiene buena presencia y se hace notar.'
    : proyeccionRaw.includes('media') || proyeccionRaw.includes('moderada')
    ? 'Tiene una presencia equilibrada, sin resultar invasivo.'
    : proyeccionRaw.includes('suave') || proyeccionRaw.includes('baja')
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
  
  const perfumeShortDescription = `Un perfume ${estiloTexto}, ideal ${momentoTexto}. ${proyeccionTexto} ${climaTexto} ${salidaDescripcion}`
    .replace(/\s+/g, ' ')
    .trim();  
  return (
    <section id="perfumeria" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24 items-start min-w-0 overflow-x-hidden">
      {/* Selector de Perfumes (Left 4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-3 min-w-0 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
        <div className="flex items-center justify-between mb-1" id="perfume-sec-header">
          <h3 className="text-xs font-bold uppercase tracking-widest text-purple-300">
            Perfumes árabes seleccionados
          </h3>
          <span className="text-[10px] text-[var(--color-luxury-gold)] font-semibold uppercase tracking-wider bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
            Seña: 30%
          </span>
        </div>

        {perfumes.map((perfume) => {
          const isActive = perfume.id === activePerfume.id;
          const brandColor = BRAND_COLORS[perfume.id] ?? 'text-purple-400';
          return (
            <button
              key={perfume.id}
              id={`btn-${perfume.id}`}
              onClick={() => onSelectPerfume(perfume.id)}
              className={`w-full min-w-0 text-left p-4 rounded-xl glass-card transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex flex-col cursor-pointer border-l-4 overflow-hidden ${
                isActive
                  ? 'border-[var(--color-luxury-gold)] bg-purple-950/40'
                  : 'border-transparent hover:border-purple-500/40'
              }`}
            >
              <div className="flex justify-between items-start gap-3 w-full min-w-0">
                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] uppercase font-bold tracking-widest block truncate ${brandColor}`}>
                    {perfume.brand}
                  </span>
                  <span className="font-luxury text-base sm:text-lg font-bold text-white block mt-0.5 break-words line-clamp-2 leading-snug">
                    {perfume.name}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded shrink-0 whitespace-nowrap self-start ${
                    isActive
                      ? 'text-[var(--color-luxury-gold)] bg-[var(--color-luxury-gold)]/10'
                      : 'text-gray-400 bg-white/5'
                  }`}
                >
                  ${perfume.price.toLocaleString('es-AR')}
                </span>
              </div>
              <span className="text-xs text-gray-400 block mt-2 font-light break-words line-clamp-2">
                {perfume.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel Sensorial Educativo Dinámico (Right 8 columns) */}
      <div
        className="lg:col-span-8 min-w-0 glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-[var(--color-luxury-gold)]/20 shadow-2xl relative overflow-hidden"
        id="perfume-sensorial-panel"
      >
        {/* Ambient gold glow decoration */}
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePerfume.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between min-w-0"
          >
            <div className="min-w-0">
              {/* Encabezado Dinámico con imagen */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 border-b border-purple-950 pb-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  <ProductGallery perfume={activePerfume} />
                  <div className="flex-1 min-w-0">
                  <span
  translate="no"
  className="notranslate text-xs font-bold text-purple-400 uppercase tracking-widest block break-words"
>
  {activePerfume.brand}
</span>
<h2
  translate="no"
  className="notranslate font-luxury text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide mt-1 leading-snug break-words"
>
  {activePerfume.name}
</h2>
                    {activePerfume.badge && (
                      <span className="inline-block max-w-full mt-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-luxury-gold)] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full break-words">
                        {activePerfume.badge}
                      </span>
                    )}
  {perfumeShortDescription && (
  <p className="mt-3 text-sm text-gray-300 leading-relaxed font-light break-words line-clamp-3 max-w-xl">
    {perfumeShortDescription}
  </p>
)}
                  </div>
                </div>

                <div className="text-left md:text-right bg-[var(--color-luxury-gold)]/5 md:bg-transparent p-3.5 md:p-0 rounded-lg w-full md:w-auto md:min-w-[10.5rem] border border-[var(--color-luxury-gold)]/10 md:border-none shrink-0 self-start">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
                    Reserva con seña del 30%
                  </span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-luxury-gold)] tracking-wider block tabular-nums break-words">
                    ${activePerfume.price.toLocaleString('es-AR')} ARS
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 tabular-nums break-words">
                    Se reserva con ${deposit.toLocaleString('es-AR')} ARS
                  </span>
                </div>
              </div>

              {/* Cuadrante Educativo de Fragancia */}
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[var(--color-luxury-gold)] animate-spin-slow" />
                Perfil del perfume y cómo se siente
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                {/* Pirámide del Sommelier */}
                <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-purple-950/80 relative min-w-0 overflow-hidden">
                  <div className="absolute left-0 top-4 bottom-4 w-[2.5px] bg-gradient-to-b from-[var(--color-luxury-gold)] via-purple-600 to-indigo-400"></div>
                  <div className="min-w-0 pl-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider shrink-0">Salida</h4>
                      <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/15 px-1.5 py-0.5 rounded shrink-0">Primeros 15 min</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light break-words">{activePerfume.notes?.salida}</p>
                  </div>
                  <div className="h-[1px] bg-purple-950/60"></div>
                  <div className="min-w-0 pl-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider shrink-0">Corazón</h4>
                      <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/15 px-1.5 py-0.5 rounded shrink-0">Dura 4-6 horas</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light break-words">{activePerfume.notes?.corazon}</p>
                  </div>
                  <div className="h-[1px] bg-purple-950/60"></div>
                  <div className="min-w-0 pl-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider shrink-0">Fondo</h4>
                      <span className="text-[10px] text-[var(--color-luxury-gold)] font-semibold bg-yellow-500/15 px-1.5 py-0.5 rounded shrink-0">Fijación residual</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light break-words">{activePerfume.notes?.fondo}</p>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-3.5 auto-rows-fr min-w-0">
                  <div className="p-4 min-h-[7.5rem] min-w-0 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)] shrink-0">{activePerfume.metrics?.iconMomento}</span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Momento</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium break-words line-clamp-2 w-full">{activePerfume.metrics?.momento}</span>
                  </div>
                  <div className="p-4 min-h-[7.5rem] min-w-0 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)] shrink-0">{activePerfume.metrics?.iconClima}</span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Clima ideal</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium break-words line-clamp-2 w-full">{activePerfume.metrics?.clima}</span>
                  </div>
                  <div className="p-4 min-h-[7.5rem] min-w-0 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)] shrink-0">{activePerfume.metrics?.iconEstilo}</span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Estilo</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium break-words line-clamp-2 w-full">{activePerfume.metrics?.estilo}</span>
                  </div>
                  </div>
                </div>
              </div>
        

            {/* Acción de Reserva */}
            <div className="mt-8 pt-5 border-t border-purple-950 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-gray-400 text-center sm:text-left leading-relaxed max-w-md flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  * Al reservar, tu perfume queda guardado en el carrito para que puedas enviarnos tu pedido por WhatsApp y coordinar entrega o envío.
                </span>
              </p>
              <button
                id="add-to-cart-perfume-btn"
                onClick={() => onAddToCart(activePerfume)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] text-white hover:text-purple-950 px-8 py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase border border-[var(--color-luxury-gold)]/20 hover:shadow-[0_0_25px_rgba(110,68,178,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center shrink-0"
              >
                Sumar a mi reserva
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}