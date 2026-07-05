import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Compass, Heart, GraduationCap, MapPin, AlertCircle } from 'lucide-react';

import { BAZAR, TECNO } from './data';
import { Product, CartItem } from './types';
import { getAvailablePerfumes } from './services/products';
// Modular Components
import { Navigation } from './components/Navigation';
import { PerfumeDetail } from './components/PerfumeDetail';
import { BazarSection } from './components/BazarSection';
import { TechSection } from './components/TechSection';
import { SommelierModal } from './components/SommelierModal';
import { CartSidebar } from './components/CartSidebar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { BrandEmblem } from './components/BrandLogo';
import WhatsAppWidget from "./components/WhatsAppWidget";
export default function App() {
  const [activeTab, setActiveTab] = useState('perfumeria');
  const [perfumes, setPerfumes] = useState<Product[]>([]);
  const [activePerfume, setActivePerfume] = useState<Product | null>(null);
  const [isLoadingPerfumes, setIsLoadingPerfumes] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'seña' | 'total'>('seña');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSommelierOpen, setIsSommelierOpen] = useState<boolean>(false);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.product.sku === product.sku);
    const hasStockLimit = typeof product.stock === 'number';

    if (hasStockLimit && product.stock <= 0) {
      addToast(`"${product.name}" no tiene stock disponible`, 'error');
      return;
    }

    if (existingItem && hasStockLimit && existingItem.quantity >= product.stock) {
      addToast(`Stock máximo disponible: ${product.stock}`, 'info');
      setIsCartOpen(true);
      return;
    }

    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.sku === product.sku);
      if (idx > -1) {
        const copy = [...prev];
        const nextQuantity = copy[idx].quantity + 1;
        copy[idx].quantity = hasStockLimit
          ? Math.min(nextQuantity, product.stock)
          : nextQuantity;
        return copy;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    addToast(`"${product.name}" añadido a tu reserva`, 'success');
    setIsCartOpen(true);
  };

  const replaceCartWithProduct = (product: Product) => {
    if (typeof product.stock === 'number' && product.stock <= 0) {
      addToast(`"${product.name}" no tiene stock disponible`, 'error');
      return;
    }

    setCartItems([{ product, quantity: 1 }]);
    addToast(`"${product.name}" reservado para consultar`, 'success');
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (sku: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.sku !== sku));
    addToast('Producto eliminado de tu reserva', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast('Reserva vaciada', 'info');
  };

  const handleUpdateQuantity = (sku: string, factor: number) => {
    const currentItem = cartItems.find((item) => item.product.sku === sku);

    if (
      currentItem &&
      factor > 0 &&
      typeof currentItem.product.stock === 'number' &&
      currentItem.quantity >= currentItem.product.stock
    ) {
      addToast(`Stock máximo disponible: ${currentItem.product.stock}`, 'info');
      return;
    }

    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.sku === sku);
      if (idx > -1) {
        const copy = [...prev];
        const stock = copy[idx].product.stock;
        const nextQuantity = copy[idx].quantity + factor;
        copy[idx].quantity =
          factor > 0 && typeof stock === 'number'
            ? Math.min(nextQuantity, stock)
            : nextQuantity;
        if (copy[idx].quantity <= 0) {
          copy.splice(idx, 1);
          addToast("Artículo eliminado de tu reserva", 'info');
        }
        return copy;
      }
      return prev;
    });
  };

  const handleSelectPerfumeId = (sku: string) => {
    const perf = perfumes.find((p) => p.sku === sku);
    if (perf) {
      setActivePerfume(perf);
    }
    };
    useEffect(() => {
      const loadPerfumes = async () => {
        setIsLoadingPerfumes(true);
        try {
          const availablePerfumes = await getAvailablePerfumes();
          const perfumesWithImages = availablePerfumes.filter((product) => product.image);

          setPerfumes(perfumesWithImages);

          if (perfumesWithImages.length > 0) {
            setActivePerfume(perfumesWithImages[0]);
          } else {
            setActivePerfume(null);
          }
        } catch (error) {
          console.error('Error cargando perfumes:', error);
          addToast('No se pudieron cargar los perfumes', 'error');
          setPerfumes([]);
          setActivePerfume(null);
        } finally {
          setIsLoadingPerfumes(false);
        }
      };
    
      loadPerfumes();
    }, []);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="text-gray-200 min-h-screen relative pb-20 antialiased overflow-x-hidden selection:bg-[var(--color-luxury-gold)]/30 selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[var(--color-luxury-purple-950)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(110,68,178,0.14)_0%,transparent_45%),radial-gradient(circle_at_90%_80%,rgba(212,175,55,0.07)_0%,transparent_48%)]" />

      {/* Navigation Header */}
      <Navigation
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSommelier={() => setIsSommelierOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Floating background ornament */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-800/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-slow" />

{/* INTRODUCCIÓN INSTITUCIONAL & EMBLEMA CIRCULAR */}
<section className="mb-14 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-[var(--color-luxury-purple-900)]/45 via-[var(--color-luxury-purple-950)] to-transparent p-6 sm:p-10 rounded-3xl border border-purple-900/30 shadow-2xl relative overflow-hidden group">
  
  {/* Subtle light streak pass */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-out" />

  {/* Segundo Emblema Circular */}
  <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 bg-gradient-to-tr from-[var(--color-luxury-purple-950)] to-purple-900/50 p-1.5 rounded-full shadow-2xl flex items-center justify-center border-2 border-[var(--color-luxury-gold)]/40 relative overflow-hidden group/emblem">
    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover/emblem:translate-y-0 transition-transform duration-500 pointer-events-none" />
    <BrandEmblem className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover/emblem:scale-[1.06]" />
  </div>

  <div className="text-center md:text-left" id="welcome-text-container">
    <span className="text-xs uppercase font-bold tracking-[0.34em] text-[var(--color-luxury-gold)] mb-2.5 block">
      SELECCIONADOS CON INTENCIÓN, TRAÍDOS PARA VOS
    </span>

    <h1 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-wide mb-4 leading-tight">
      Perfumes, regalos y productos importados que de verdad valen la pena
    </h1>

    <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-light mb-3">
      Acá encontrás fragancias árabes únicas, regalos que sorprenden en serio y productos elegidos para que no compres más de lo mismo.
    </p>

    <p className="text-xs sm:text-sm font-medium tracking-wide text-purple-200 mb-6">
      ¿Por dónde querés empezar?
    </p>

    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
      <button
        onClick={() => {
          const perfumesSection = document.getElementById('perfumeria');
          perfumesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="bg-[var(--color-luxury-gold)] hover:bg-white text-purple-950 font-bold text-[11px] tracking-widest uppercase py-3 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
      >
        Ver perfumes
      </button>

      <button
        onClick={() => setIsSommelierOpen(true)}
        className="border border-[var(--color-luxury-gold)]/40 hover:border-[var(--color-luxury-gold)] bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] tracking-widest uppercase py-3 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
      >
        Ayudame a elegir
      </button>
    </div>
  </div>
</section>

        {/* SECTION 1: PERFUMERÍA  Y CUADRANTE SENSORIAL */}
  {isLoadingPerfumes ? (
    <div className="text-center py-16 text-gray-400">
      Cargando perfumes...
    </div>
  ) : activePerfume ? (
    <PerfumeDetail
      perfumes={perfumes}
      activePerfume={activePerfume}
      onSelectPerfume={handleSelectPerfumeId}
      onAddToCart={handleAddToCart}
    />
  ) : (
    <div className="text-center py-16 text-gray-400">
      No hay perfumes disponibles en este momento.
    </div>
  )}

        {/* SECTION 2: GUÍA OLFATIVA Y SOMMELIER INTEGRADO */}
        <section id="guia" className="mt-20 border border-[var(--color-luxury-gold)]/25 bg-[radial-gradient(ellipse_at_bottom_left,rgba(110,68,178,0.12),transparent_40%)] p-8 rounded-2xl relative overflow-hidden scroll-mt-24 shadow-2xl">
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Consejos Técnicos de Educación - 9 Columnas */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] mb-2 block">
                  Guía Práctica de Uso
                </span>
                <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-white mb-4">
                  Cómo usar y conservar tus perfumes orientales
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5 bg-black/25 p-4 rounded-xl border border-purple-950/40 hover:bg-black/35 transition-colors">
                  <div className="text-xl">🌡️</div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Conservación Ideal</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Guárdalos siempre en su caja original, lejos del sol directo, la humedad constante del baño y los cambios bruscos de temperatura.
                  </p>
                </div>
                <div className="space-y-2.5 bg-black/25 p-4 rounded-xl border border-purple-950/40 hover:bg-black/35 transition-colors">
                  <div className="text-xl">🧴</div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Puntos de Pulso</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Aplica en muñecas, detrás de las orejas y en el cuello. No frotes tus muñecas; romperías las moléculas de salida reduciendo la duración.
                  </p>
                </div>
                <div className="space-y-2.5 bg-black/25 p-4 rounded-xl border border-purple-950/40 hover:bg-black/35 transition-colors">
                  <div className="text-xl">🧬</div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">La Regla de Fijación</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    La piel hidratada retiene mejor la fragancia. Aplica una crema neutra sin aroma antes de atomizar para maximizar la duración de la estela.
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta Especial de Recomiendo Sommelier - 4 Columnas */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#1e1135] to-[#3c2463] border border-[var(--color-luxury-gold)]/40 rounded-xl p-5 flex flex-col justify-between hover:border-[var(--color-luxury-gold)] transition-all duration-300 shadow-xl group relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-[var(--color-luxury-gold)]/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-800 flex items-center justify-center shadow-lg border border-[var(--color-luxury-gold)]/50 animate-pulse">
                    <span className="text-sm">🔮</span>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.15em]">
                    Asistente Virtual
                  </span>
                </div>
                <h4 className="font-luxury text-lg font-bold text-white mb-2">Sommelier de Fragancias</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-light mb-4">
                  ¿Aún tienes dudas sobre cuál es tu fragancia ideal? Nuestro consultor digital califica tu tipo de piel, clima y ocasión en solo 3 pasos rápidos.
                </p>
              </div>
              <button
                onClick={() => setIsSommelierOpen(true)}
                className="w-full bg-[var(--color-luxury-gold)] hover:bg-white text-purple-950 font-bold text-[10px] tracking-widest uppercase py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar Diagnóstico
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: BAZAR & MATES PREMIUM */}
        <BazarSection
          products={BAZAR}
          onAddToCart={handleAddToCart}
        />

        {/* SECTION 4: HARDWARE Y TECNOLOGÍA SELECCIONADA */}
        <TechSection
          products={TECNO}
          onAddToCart={handleAddToCart}
        />

      </main>

      {/* INTERFAZ FLOTANTE: SOMMELIER DE FRAGANCIAS - BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group">
        {/* Fast intuitive label always visible */}
        <div 
          onClick={() => setIsSommelierOpen(true)}
          className="bg-black/85 hover:bg-black border border-[var(--color-luxury-gold)]/45 text-[var(--color-luxury-gold)] text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 rounded-full shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 flex items-center gap-2 border-l-2 border-l-[var(--color-luxury-gold)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sommelier Virtual</span>
        </div>

        {/* Hover Tooltip description box */}
        <div className="absolute bottom-20 right-0 w-80 rounded-2xl glass-card border border-[var(--color-luxury-gold)]/40 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 origin-bottom-right overflow-hidden" id="tooltip-bubble-flotante">
          {/* Sommelier Banner Image inside explanation card */}
          <div className="h-28 w-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#140C22] to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=320&h=140" 
              alt="Mística de Perfumería" 
              className="w-full h-full object-cover filter brightness-[0.8]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-4 z-20">
              <span className="text-[9px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.2em]">Asesoramiento Experto</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mt-0.5">
                Alquimia Árabe de Lujo
              </h4>
            </div>
          </div>
          
          <div className="p-4 pt-1 bg-[#140C22]/95">
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              ¿Abrumado por tantas opciones? Encuentra tu perfume ideal. Haz clic aquí, cuéntanos qué impacto deseas causar o qué emociones buscas transmitir hoy, y nuestro sistema calibrará las notas recomendadas para tu piel.
            </p>
          </div>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-[#140C22] border-r border-b border-purple-950 rotate-45" />
        </div>

        {/* Floating Call trigger with real reference image */}
        <button
          onClick={() => setIsSommelierOpen(true)}
          className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgba(110,68,178,0.6)] border-2 border-[var(--color-luxury-gold)] hover:scale-110 hover:rotate-6 transition-all duration-300 overflow-hidden bg-purple-950 shrink-0"
          aria-label="Abrir Sommelier Virtual"
        >
          {/* Animated golden ring glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-luxury-gold)]/20 to-purple-500/20 animate-pulse" />
          
          {/* Reference Image for Sommelier */}
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=150&h=150" 
            alt="Sommelier de Fragancias" 
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />

          {/* Compass overlay in corner */}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--color-luxury-gold)] text-purple-950 flex items-center justify-center border border-purple-950 shadow-md">
            <Compass className="h-3 w-3 text-purple-950 font-bold" />
          </div>
        </button>
      </div>

            {/* REGISTRO BASE DE DATOS */}
            <section className="max-w-6xl mx-auto px-4 mt-20 mb-10">
        <div className="rounded-3xl border border-[var(--color-luxury-gold)]/20 bg-gradient-to-br from-[var(--color-luxury-purple-900)]/40 via-black/30 to-[var(--color-luxury-purple-950)]/70 p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[var(--color-luxury-gold)] block mb-3">
              Acceso preferencial
            </span>

            <h3 className="font-luxury text-2xl sm:text-3xl text-white font-semibold mb-3 leading-tight">
              Recibí novedades, reposiciones y beneficios exclusivos
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-xl">
              Dejanos tus datos y enterate antes que el resto cuando ingresen nuevas fragancias,
              reposiciones o promos especiales.
            </p>

            <form className="grid grid-cols-1 gap-4 max-w-xl">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-[var(--color-luxury-gold)]"
              />

              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-[var(--color-luxury-gold)]"
              />

              <input
                type="tel"
                placeholder="Tu WhatsApp (opcional)"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-[var(--color-luxury-gold)]"
              />

              <label className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
                <input type="checkbox" className="mt-1 accent-[var(--color-luxury-gold)]" />
                <span>
                  Acepto recibir novedades, reposiciones y comunicaciones comerciales por correo
                  electrónico o WhatsApp. Puedo darme de baja cuando quiera.
                </span>
              </label>

              <button
                type="submit"
                className="w-full sm:w-fit bg-[var(--color-luxury-gold)] hover:bg-white text-purple-950 font-bold text-[11px] tracking-widest uppercase py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Quiero enterarme primero
              </button>
            </form>
          </div>
        </div>

      {/* FOOTER - PIE DE PÁGINA */}
      <footer className="w-full bg-[var(--color-luxury-purple-950)] border-t border-purple-950/80 py-8 text-center text-xs text-gray-500 font-light mt-20" id="app-footer">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} La Tiendita del Importado. Todos los derechos reservados.</p>
          <p className="text-[10px] text-purple-400">Curaduría Sensorial de Lujo & Envíos Certificados</p>
        </div>
      </footer>
      </section>

      {/* MODAL CORES: SOMMELIER */}
      <AnimatePresence>
        {isSommelierOpen && (
          <SommelierModal
            isOpen={isSommelierOpen}
            onClose={() => setIsSommelierOpen(false)}
            perfumes={perfumes}
            onSelectPerfume={handleSelectPerfumeId}
            onReplaceCartWithProduct={replaceCartWithProduct}
            onAddToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CORES: CART */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        selectedPaymentType={selectedPaymentType}
        onPaymentTypeChange={setSelectedPaymentType}
      />

      {/* SYSTEM NOTIFICATIONS CONTAINER */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <WhatsAppWidget />
    </div>
  );
}
