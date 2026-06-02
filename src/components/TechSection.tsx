import { Product } from '../types';
import { Smartphone, Music, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TechSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function TechSection({ products, onAddToCart }: TechSectionProps) {
  return (
    <section id="tecnologia" className="mt-20 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-purple-950 pb-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em]">
            Vanguardia
          </span>
          <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Tecnología & Hardware Especial
          </h2>
        </div>
        <p className="text-xs text-gray-400 max-w-sm mt-3 sm:mt-0 leading-relaxed font-light">
          Artículos electrónicos de alta demanda bajo auditoría y certificación técnica directa de marcas globales líderes.
        </p>
      </div>

      {/* Grilla de productos de tecnología */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            id={`tech-card-${product.id}`}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden border border-purple-900/30 flex flex-col md:flex-row group shadow-xl"
          >
            {/* Contenedor Visual de Producto */}
            <div className="p-6 md:w-1/2 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors shrink-0">
              {product.id === 'watch' && (
                <svg viewBox="0 0 100 100" className="h-32 fill-none stroke-[var(--color-luxury-gold)]" strokeWidth="2.5">
                  <rect x="25" y="15" width="50" height="70" rx="10" />
                  <circle cx="50" cy="50" r="20" stroke="#B79CED" />
                  <line x1="50" y1="15" x2="50" y2="25" />
                  <line x1="50" y1="75" x2="50" y2="85" />
                  <path d="M42,50 L48,53 L58,45" stroke="var(--color-luxury-gold)" strokeWidth="3" />
                </svg>
              )}
              {product.id === 'speaker' && (
                <svg viewBox="0 0 100 100" className="h-32 fill-none stroke-purple-400" strokeWidth="2.5">
                  <rect x="20" y="30" width="60" height="40" rx="8" />
                  <circle cx="35" cy="50" r="8" fill="rgba(110,68,178,0.2)" />
                  <circle cx="65" cy="50" r="8" fill="rgba(110,68,178,0.2)" />
                  <circle cx="50" cy="50" r="4" stroke="var(--color-luxury-gold)" />
                  <line x1="20" y1="40" x2="80" y2="40" />
                </svg>
              )}
            </div>

            {/* Contenido e Información */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#B79CED] block">
                  {product.badge}
                </span>
                <h4 className="font-luxury text-xl font-bold text-white mb-2.5 mt-1 group-hover:text-[var(--color-luxury-gold)] transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-purple-950/50">
                <span className="text-lg font-bold text-[var(--color-luxury-gold)] tracking-wide">
                  ${product.price.toLocaleString('es-AR')}
                </span>
                <button
                  id={`add-tech-${product.id}`}
                  onClick={() => onAddToCart(product)}
                  className="bg-purple-900/60 hover:bg-purple-700 text-white hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-purple-800/40 hover:border-purple-600 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>+ Agregar</span>
                  <ArrowRight className="w-3 h-3 text-[var(--color-luxury-gold)]" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
