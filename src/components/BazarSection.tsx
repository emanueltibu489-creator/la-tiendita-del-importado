import { Product } from '../types';
import { ShoppingBag, Award, Pocket, Wine } from 'lucide-react';
import { motion } from 'motion/react';

interface BazarSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function BazarSection({ products, onAddToCart }: BazarSectionProps) {
  return (
    <section id="bazar" className="mt-20 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-purple-950 pb-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em]">
            Estilo de Vida
          </span>
          <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Bazar & Mates Premium
          </h2>
        </div>
        <p className="text-xs text-gray-400 max-w-sm mt-3 sm:mt-0 leading-relaxed font-light">
          Artículos importados seleccionados meticulosamente para durar toda la vida con la más alta retención térmica y acabados finos.
        </p>
      </div>

      {/* Grilla de productos de bazar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            id={`bazar-card-${product.id}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="glass-card rounded-2xl overflow-hidden border border-purple-900/30 flex flex-col justify-between group shadow-xl"
          >
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-[var(--color-luxury-gold)]/10 border border-[var(--color-luxury-gold)]/30 text-[var(--color-luxury-gold)] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                {product.badge}
              </div>

              {/* Contenedor Visual de Producto */}
              <div className="h-44 w-full flex items-center justify-center bg-black/30 rounded-xl mb-4 group-hover:bg-black/40 transition-colors">
                {product.id === 'termo' && (
                  <svg viewBox="0 0 100 120" className="h-32 fill-none stroke-purple-400" strokeWidth="3">
                    <rect x="35" y="30" width="30" height="80" rx="4" />
                    <path d="M42,30 L42,15 L58,15 L58,30" />
                    <path d="M47,15 L47,8 L53,8 L53,15" />
                    <rect x="30" y="45" width="5" height="40" rx="1" />
                    <path d="M50,55 L50,85" stroke="var(--color-luxury-gold)" strokeDasharray="2,2" />
                  </svg>
                )}
                {product.id === 'mate' && (
                  <svg viewBox="0 0 100 120" className="h-32 fill-none stroke-[var(--color-luxury-gold)]" strokeWidth="3">
                    <path d="M30,35 C30,70 70,70 70,35 Z" fill="rgba(212,175,55,0.05)" />
                    <ellipse cx="50" cy="35" rx="20" ry="6" />
                    <rect x="42" y="25" width="16" height="10" rx="1" stroke="#B79CED" />
                    <path d="M50,70 L50,95 L65,95" />
                    <line x1="28" y1="95" x2="72" y2="95" stroke="#B79CED" />
                  </svg>
                )}
                {product.id === 'tetera' && (
                  <svg viewBox="0 0 100 120" className="h-32 fill-none stroke-purple-400" strokeWidth="3">
                    <circle cx="50" cy="65" r="30" />
                    <rect x="42" y="15" width="16" height="20" rx="3" />
                    <path d="M25,25 Q15,40 20,65" />
                    <path d="M50,25 L50,35" stroke="var(--color-luxury-gold)" />
                  </svg>
                )}
              </div>

              <h4 className="font-luxury text-xl font-bold text-white mb-1.5 group-hover:text-[var(--color-luxury-gold)] transition-colors">
                {product.name}
              </h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Acciones e Info de Precio */}
            <div className="p-6 pt-0 border-t border-purple-950/50 flex items-center justify-between">
              <span className="text-lg sm:text-xl font-bold text-[var(--color-luxury-gold)] tracking-wide">
                ${product.price.toLocaleString('es-AR')} ARS
              </span>
              <button
                id={`add-bazar-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="bg-purple-950/80 hover:bg-purple-800 text-xs font-semibold px-4 py-2 rounded-lg border border-purple-800/65 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group-hover:border-[var(--color-luxury-gold)]/40"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[var(--color-luxury-gold)]" />
                <span>+ Al Carrito</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
