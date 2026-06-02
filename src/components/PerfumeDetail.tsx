import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { Sparkles, Compass, ShieldCheck, HelpCircle } from 'lucide-react';

interface PerfumeDetailProps {
  perfumes: Product[];
  activePerfume: Product;
  onSelectPerfume: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export function PerfumeDetail({
  perfumes,
  activePerfume,
  onSelectPerfume,
  onAddToCart,
}: PerfumeDetailProps) {
  // Deposit 30%
  const deposit = activePerfume.price * 0.3;

  return (
    <section id="perfumeria" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
      {/* Selector de Perfumes (Left 4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1" id="perfume-sec-header">
          <h3 className="text-xs font-bold uppercase tracking-widest text-purple-300">
            Colección Árabe de Culto
          </h3>
          <span className="text-[10px] text-[var(--color-luxury-gold)] font-semibold uppercase tracking-wider bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
            Seña: 30%
          </span>
        </div>

        {perfumes.map((perfume) => {
          const isActive = perfume.id === activePerfume.id;
          return (
            <button
              key={perfume.id}
              id={`btn-${perfume.id}`}
              onClick={() => onSelectPerfume(perfume.id)}
              className={`w-full text-left p-4 rounded-xl glass-card transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex flex-col cursor-pointer border-l-4 ${
                isActive
                  ? 'border-[var(--color-luxury-gold)] bg-purple-950/40'
                  : 'border-transparent hover:border-purple-500/40'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div>
                  <span className={`text-[9px] uppercase font-bold tracking-widest block ${
                    perfume.id === 'yara' ? 'text-pink-400' :
                    perfume.id === 'asad' ? 'text-amber-500' :
                    perfume.id === 'valhalla' ? 'text-emerald-400' : 'text-orange-400'
                  }`}>
                    {perfume.brand}
                  </span>
                  <span className="font-luxury text-lg font-bold text-white block mt-0.5">
                    {perfume.name}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  isActive ? 'text-[var(--color-luxury-gold)] bg-[var(--color-luxury-gold)]/10' : 'text-gray-400 bg-white/5'
                }`}>
                  ${perfume.price.toLocaleString('es-AR')}
                </span>
              </div>
              <span className="text-xs text-gray-400 block mt-2 font-light">
                {perfume.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel Sensorial Educativo Dinámico (Right 8 columns) */}
      <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-[var(--color-luxury-gold)]/20 shadow-2xl relative overflow-hidden" id="perfume-sensorial-panel">
        
        {/* Ambient gold glow decoration */}
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePerfume.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Encabezado Dinámico */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-950 pb-6 mb-6">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                    {activePerfume.brand}
                  </span>
                  <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-white tracking-wide mt-1">
                    {activePerfume.name}
                  </h2>
                </div>
                <div className="text-left sm:text-right bg-[var(--color-luxury-gold)]/5 sm:bg-transparent p-3.5 sm:p-0 rounded-lg w-full sm:w-auto border border-[var(--color-luxury-gold)]/10 sm:border-none">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">
                    Reserva tu Joya (Seña 30%)
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[var(--color-luxury-gold)] tracking-wider block">
                    ${activePerfume.price.toLocaleString('es-AR')} ARS
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    (Sella el pedido con ${deposit.toLocaleString('es-AR')} ARS)
                  </span>
                </div>
              </div>

              {/* Cuadrante Educativo de Fragancia */}
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[var(--color-luxury-gold)] animate-spin-slow" />
                Desglose Técnico y Educación del Aroma
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pirámide del Sommelier */}
                <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-purple-950/80 relative">
                  <div className="absolute left-0 top-4 bottom-4 w-[2.5px] bg-gradient-to-b from-[var(--color-luxury-gold)] via-purple-600 to-indigo-400"></div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top / Notas de Salida</h4>
                      <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/15 px-1.5 py-0.5 rounded">
                        Primeros 15 min
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light">
                      {activePerfume.notes?.salida}
                    </p>
                  </div>
                  
                  <div className="h-[1px] bg-purple-950/60"></div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Corazón / Notas Medias</h4>
                      <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/15 px-1.5 py-0.5 rounded">
                        Dura 4-6 horas
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light">
                      {activePerfume.notes?.corazon}
                    </p>
                  </div>
                  
                  <div className="h-[1px] bg-purple-950/60"></div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fondo / Notas Base</h4>
                      <span className="text-[10px] text-[var(--color-luxury-gold)] font-semibold bg-yellow-500/15 px-1.5 py-0.5 rounded">
                        Fijación residual
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-light">
                      {activePerfume.notes?.fondo}
                    </p>
                  </div>
                </div>

                {/* Métricas e idoneidades del perfume */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                      {activePerfume.metrics?.iconMomento}
                    </span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Momento</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium">
                      {activePerfume.metrics?.momento}
                    </span>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                      {activePerfume.metrics?.iconClima}
                    </span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Clima Ideal</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium">
                      {activePerfume.metrics?.clima}
                    </span>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                      {activePerfume.metrics?.iconEstilo}
                    </span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Estilo</span>
                    <span className="text-xs text-purple-300 mt-0.5 font-medium">
                      {activePerfume.metrics?.estilo}
                    </span>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-purple-950/40 flex flex-col items-center justify-center text-center hover:bg-black/35 transition-all duration-300">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                      {activePerfume.metrics?.iconProyeccion}
                    </span>
                    <span className="text-xs font-bold text-white mt-2 uppercase tracking-wider">Estela</span>
                    <span className="text-xs text-[var(--color-luxury-gold)] font-bold mt-0.5">
                      {activePerfume.metrics?.proyeccion}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acción de Reserva o de Compra */}
            <div className="mt-8 pt-5 border-t border-purple-950 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-gray-400 text-center sm:text-left leading-relaxed max-w-md flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  * Al reservar, se añade a tu orden temporal. Puedes enviar tu carrito consolidado directamente a WhatsApp para agendar la entrega o coordinar despacho. Ya no tienes de qué preocuparte.
                </span>
              </p>
              <button
                id="add-to-cart-perfume-btn"
                onClick={() => onAddToCart(activePerfume)}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] text-white hover:text-purple-950 px-8 py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase border border-[var(--color-luxury-gold)]/20 hover:shadow-[0_0_25px_rgba(110,68,178,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center shrink-0"
              >
                Reservar Perfume
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
