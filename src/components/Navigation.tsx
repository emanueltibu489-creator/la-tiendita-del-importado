import { useState } from 'react';
import { Menu, X, ShoppingCart, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface NavigationProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSommelier: () => void;
}

export function Navigation({
  cartCount,
  onOpenCart,
  activeTab,
  onSelectTab,
  onOpenSommelier,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    
    // Smooth scroll to the target section
    const element = document.getElementById(tabId);
    if (element) {
      const headerOffset = 110; // offset of banner + nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* BARRA DE ANUNCIOS */}
      <div id="shipment-alert-bar" class="w-full bg-gradient-to-r from-purple-800 via-purple-950 to-indigo-950 text-white text-[11px] sm:text-xs font-medium py-2.5 px-4 text-center tracking-wider border-b border-purple-500/20 z-50 relative">
        <span class="inline-flex items-center gap-1.5 flex-wrap justify-center">
          <motion.span 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            📍
          </motion.span> 
          <span>Envíos <strong>GRATIS</strong> dentro de <span class="text-[var(--color-luxury-gold)] font-bold underline decoration-wavy">Cerrito</span>.</span>
          <span class="text-purple-300">|</span>
          <span>Resto del país coordinamos juntos tu despacho ideal.</span>
        </span>
      </div>

      {/* CABECERA COMPATIBLE CON VENTANAS MÓVILES */}
      <header id="app-header" className="w-full sticky top-0 z-40 glass-card border-b border-purple-950/50 transition-all duration-300 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Primario */}
          <a href="#" className="flex items-center group py-1" id="logo-main-link" title="La Tiendita del Importado">
            <BrandLogo className="h-10 sm:h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-[1.03]" />
          </a>

          {/* Categorías de Navegación (Escritorio) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-gray-400" id="desktop-nav">
            <button
              onClick={() => handleNavClick('perfumeria')}
              className={`pb-1 transition-all duration-200 cursor-pointer ${
                activeTab === 'perfumeria'
                  ? 'text-white border-b-2 border-[var(--color-luxury-gold)] font-bold'
                  : 'hover:text-white hover:border-b-2 hover:border-[var(--color-luxury-gold)]/40'
              }`}
            >
              Perfumería
            </button>
            <button
              onClick={() => handleNavClick('bazar')}
              className={`pb-1 transition-all duration-200 cursor-pointer ${
                activeTab === 'bazar'
                  ? 'text-white border-b-2 border-[var(--color-luxury-gold)] font-bold'
                  : 'hover:text-white hover:border-b-2 hover:border-[var(--color-luxury-gold)]/40'
              }`}
            >
              Mates y Bazar
            </button>
            <button
              onClick={() => handleNavClick('tecnologia')}
              className={`pb-1 transition-all duration-200 cursor-pointer ${
                activeTab === 'tecnologia'
                  ? 'text-white border-b-2 border-[var(--color-luxury-gold)] font-bold'
                  : 'hover:text-white hover:border-b-2 hover:border-[var(--color-luxury-gold)]/40'
              }`}
            >
              Tecnología
            </button>
            <button
              onClick={() => handleNavClick('guia')}
              className={`pb-1 transition-all duration-200 cursor-pointer ${
                activeTab === 'guia'
                  ? 'text-white border-b-2 border-[var(--color-luxury-gold)] font-bold'
                  : 'hover:text-white hover:border-b-2 hover:border-[var(--color-luxury-gold)]/40'
              }`}
            >
              Guía Olfativa
            </button>
          </nav>

          {/* Carrito de Compras & Triggers */}
          <div className="flex items-center gap-3">
            <button
              id="sommelier-consultation-nav"
              onClick={onOpenSommelier}
              className="bg-purple-900/30 hover:bg-[var(--color-luxury-gold)] hover:text-purple-950 font-bold hover:scale-[1.02] active:scale-[0.98] border border-[var(--color-luxury-gold)]/30 text-[10px] tracking-widest uppercase px-3 py-2 rounded-full text-[var(--color-luxury-gold)] transition-all cursor-pointer hidden md:flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Sommelier Virtual
            </button>

            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="p-2.5 rounded-full text-gray-300 hover:text-[var(--color-luxury-gold)] hover:bg-white/5 transition-all duration-300 relative cursor-pointer"
              aria-label="Abrir Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    id="cart-count-bubble"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-luxury-gold)] text-purple-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            {/* Botón menú móvil */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full md:hidden text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-purple-900/30 bg-[var(--color-luxury-purple-950)]/95 backdrop-blur-lg px-4 py-6 space-y-3"
            >
              <button
                onClick={() => handleNavClick('perfumeria')}
                className="w-full text-left block text-sm font-semibold tracking-wider text-white uppercase py-2.5 border-b border-purple-950 cursor-pointer"
              >
                Perfumería Fina
              </button>
              <button
                onClick={() => handleNavClick('bazar')}
                className="w-full text-left block text-sm font-semibold tracking-wider text-gray-300 uppercase py-2.5 border-b border-purple-950 cursor-pointer"
              >
                Mates y Bazar Premium
              </button>
              <button
                onClick={() => handleNavClick('tecnologia')}
                className="w-full text-left block text-sm font-semibold tracking-wider text-gray-300 uppercase py-2.5 border-b border-purple-950 cursor-pointer"
              >
                Tecnología Seleccionada
              </button>
              <button
                onClick={() => handleNavClick('guia')}
                className="w-full text-left block text-sm font-semibold tracking-wider text-gray-300 uppercase py-2.5 border-b border-purple-950 cursor-pointer"
              >
                Guía Olfativa
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSommelier();
                }}
                className="w-full bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] text-white hover:text-purple-950 block text-xs font-bold tracking-widest uppercase text-center py-3 rounded-xl border border-purple-700/40 relative cursor-pointer"
              >
                🔮 Diagnóstico de Sommelier
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
