import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../config/business';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (sku: string, factor: number) => void;
  onRemoveItem: (sku: string) => void;
  onClearCart: () => void;
  selectedPaymentType: 'seña' | 'total';
  onPaymentTypeChange: (type: 'seña' | 'total') => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedPaymentType,
  onPaymentTypeChange,
}: CartSidebarProps) {
  // Calculations
  const productsSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalAmount = productsSubtotal;
  const señaRequiredAmount = Math.round(totalAmount * 0.3);

  const amountToPayToday =
    selectedPaymentType === 'seña' ? señaRequiredAmount : totalAmount;

  // Compile and export to WhatsApp format
  const exportToWhatsApp = () => {
    if (cartItems.length === 0) return;

    const messageLines = [
      '✨ *NUEVO PEDIDO - LA TIENDITA DEL IMPORTADO* ✨',
      '',
      'Hola, quiero consultar por el siguiente pedido:',
      '-----------------------------------------',
    ];

    cartItems.forEach((item) => {
      const subtotal = item.product.price * item.quantity;
      messageLines.push(
        `▪️ *${item.product.name}*`,
        `   SKU: ${item.product.sku}`,
        `   Cantidad: ${item.quantity}`,
        `   Precio unitario: $${item.product.price.toLocaleString('es-AR')} ARS`,
        `   Subtotal: $${subtotal.toLocaleString('es-AR')} ARS`,
        '',
      );
    });

    messageLines.push(
      '-----------------------------------------',
      '📍 *Envío:* Coordinar despacho (Gratis en Cerrito)',
      `💳 *Esquema de pago:* ${
        selectedPaymentType === 'seña' ? 'Señar el 30%' : 'Pago total'
      }`,
      '',
    );

    if (selectedPaymentType === 'seña') {
      messageLines.push(
        `💵 *Monto total del pedido:* $${totalAmount.toLocaleString('es-AR')} ARS`,
        `💰 *Seña del 30%:* *$${señaRequiredAmount.toLocaleString('es-AR')} ARS*`,
        '_(El resto se abona contra entrega o despacho)_',
      );
    } else {
      messageLines.push(
        `💰 *Total a abonar:* *$${totalAmount.toLocaleString('es-AR')} ARS*`,
      );
    }

    messageLines.push(
      '',
      '💬 _Por favor, confirmen disponibilidad y datos de pago. ¡Muchas gracias!_',
    );

    const message = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const hasItems = cartItems.length > 0;

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div
        id="cart-sidebar"
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[var(--color-luxury-purple-950)]/98 border-l border-purple-900/30 z-50 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl`}
      >
        {/* Cabecera del Carrito */}
        <div className="p-5 border-b border-purple-950 flex justify-between items-center bg-purple-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[var(--color-luxury-gold)]" />
            <h3 className="font-luxury text-xl font-bold text-white tracking-wide">
              Tu Reserva
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {hasItems && (
              <button
                onClick={onClearCart}
                className="text-[10px] text-red-300 hover:text-red-200 transition-colors cursor-pointer font-semibold"
              >
                Vaciar reserva
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        {/* Lista dinámica de items */}
        <div id="cart-items-container" className="p-5 flex-1 overflow-y-auto space-y-4">
          <>
            {!hasItems ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-4"
              >
                <span className="text-4xl block filter drop-shadow-md">✨</span>
                <p className="text-xs text-gray-400 font-light">
                  Tu carrito de reserva está vacío.
                </p>
                <button
                  onClick={onClose}
                  className="text-[10px] text-purple-300 hover:text-[var(--color-luxury-gold)] uppercase tracking-wider font-bold underline cursor-pointer"
                >
                  ¡Descubre e inicia tu viaje olfativo!
                </button>
              </motion.div>
            ) : (
              cartItems.map((item) => {
                const itemSubtotal = item.product.price * item.quantity;
                const reachedStockLimit =
                  typeof item.product.stock === 'number' &&
                  item.quantity >= item.product.stock;
                return (
                  <motion.div
                    key={item.product.sku}
                    id={`cart-item-${item.product.sku}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center bg-purple-950/25 p-3.5 rounded-xl border border-purple-900/40 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-[#B79CED] tracking-wider block">
                        {item.product.category}
                      </span>
                      <h4
                        className="notranslate text-xs font-semibold text-white truncate mt-0.5"
                        translate="no"
                      >
                        {item.product.name}
                      </h4>
                      <span className="text-xs font-bold text-[var(--color-luxury-gold)] block mt-1">
                        ${itemSubtotal.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.sku, -1)}
                        className="w-6 h-6 rounded bg-purple-900/30 hover:bg-purple-900/70 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-white font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.sku, 1)}
                        disabled={reachedStockLimit}
                        title={reachedStockLimit ? 'Stock máximo disponible' : 'Agregar una unidad'}
                        className="w-6 h-6 rounded bg-purple-900/30 hover:bg-purple-900/70 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.sku)}
                        className="w-6 h-6 rounded text-red-300 hover:text-red-200 hover:bg-red-950/40 flex items-center justify-center transition-all cursor-pointer"
                        aria-label={`Quitar ${item.product.name} de la reserva`}
                        title="Quitar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </>
        </div>

        {/* Pie de carrito */}
        {hasItems && (
          <div className="p-5 border-t border-purple-950 bg-purple-950/20 space-y-4 shrink-0">
            {/* Modalidad Seña vs Total */}
            <div className="space-y-2 bg-black/45 p-3 rounded-lg border border-purple-900/40">
              <div className="flex items-center justify-between text-xs gap-2">
                <label htmlFor="opcion-seña" className="text-gray-300 font-light shrink-0">
                  ¿Cómo prefieres abonar?
                </label>
                <select
                  id="opcion-seña"
                  value={selectedPaymentType}
                  onChange={(e) =>
                    onPaymentTypeChange(e.target.value as 'seña' | 'total')
                  }
                  className="bg-[var(--color-luxury-purple-950)] text-[var(--color-luxury-gold)] border border-purple-900/55 text-[10px] font-bold rounded p-1.5 focus:outline-none"
                >
                  <option value="seña">Señar el 30% del Pedido</option>
                  <option value="total">Pagar Total Completo</option>
                </select>
              </div>
              <p className="text-[9.5px] text-gray-400 leading-normal font-light">
                * La seña del 30% garantiza la importación y reserva del artículo. El resto se salda al momento de la entrega o despacho.
              </p>
            </div>

            {/* Resumen Financiero */}
            <div className="space-y-1.5 pt-2 border-t border-purple-900/30">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Productos:</span>
                <span id="cart-subtotal" className="text-gray-300 font-medium">
                  ${totalAmount.toLocaleString('es-AR')} ARS
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Envío (Cerrito):</span>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                  ¡GRATIS!
                </span>
              </div>
              
              {selectedPaymentType === 'seña' && (
                <div id="resumen-seña-row" className="flex justify-between text-xs text-[#B79CED]">
                  <span>Seña Mínima Requerida (30%):</span>
                  <span id="cart-seña-requerida" className="font-semibold">
                    ${señaRequiredAmount.toLocaleString('es-AR')} ARS
                  </span>
                </div>
              )}

              <div className="flex justify-between items-end pt-3 border-t border-purple-900/50">
                <span className="font-luxury text-lg font-bold text-white tracking-wide">
                  Monto a pagar hoy:
                </span>
                <span id="cart-total" className="text-2xl font-bold text-[var(--color-luxury-gold)] tracking-wider">
                  ${amountToPayToday.toLocaleString('es-AR')} ARS
                </span>
              </div>
            </div>

            {/* Confirmación WhatsApp */}
            <button
              onClick={exportToWhatsApp}
              className="w-full bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] text-white hover:text-purple-950 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase border border-[var(--color-luxury-gold)]/25 shadow-lg hover:shadow-[0_0_20px_rgba(110,68,178,0.4)] transition-all cursor-pointer text-center"
            >
              Confirmar Reserva por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
