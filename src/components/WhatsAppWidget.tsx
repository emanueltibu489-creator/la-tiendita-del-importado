import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/business";

const options = [
  {
    emoji: "🛍️",
    label: "Quiero comprar un perfume",
    msg: "Hola La Tiendita del Importado, quiero comprar un perfume.",
  },
  {
    emoji: "📦",
    label: "Consultar perfume sin stock",
    msg: "Hola, quiero consultar por un perfume que no está en stock.",
  },
  {
    emoji: "🕌",
    label: "Cotizar fragancia por encargo",
    msg: "Hola, quiero cotizar una fragancia por encargo.",
  },
  {
    emoji: "❓",
    label: "Consulta general",
    msg: "Hola, tengo una consulta general.",
  },
];

const WHATSAPP_ICON_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}

// hidden: con el Sommelier o el carrito abiertos el botón se esconde para no taparlos
export default function WhatsAppWidget({ hidden = false }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowLabel(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // El menú se cierra al tocar afuera o con Escape
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-[78px] right-4 z-[1000] sm:bottom-[120px] sm:right-6 flex flex-col items-end gap-3"
    >
      {open && (
        <div
          id="whatsapp-menu"
          className="w-[min(18rem,calc(100vw-3rem))] origin-bottom-right overflow-hidden rounded-2xl border border-[var(--color-luxury-gold)]/50 bg-[var(--color-luxury-purple-950)]/95 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#128C7E] to-[#25D366] px-4 py-3 text-white">
            <WhatsAppIcon className="h-6 w-6 shrink-0" />
            <div className="min-w-0">
              <p className="font-luxury text-lg font-bold leading-none">La Tiendita del Importado</p>
              <p className="mt-1 text-[11px] font-semibold opacity-90">¿En qué te ayudamos?</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 p-2.5">
            {options.map((o) => (
              <a
                key={o.label}
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(o.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-xl border border-purple-900/40 bg-black/30 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#25D366]/60 hover:bg-[#25D366]/10 active:scale-[0.98]"
              >
                <span aria-hidden="true" className="text-base">{o.emoji}</span>
                <span className="min-w-0 flex-1">{o.label}</span>
                <span aria-hidden="true" className="text-[var(--color-luxury-gold)]">›</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {showLabel && !open && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setShowLabel(false);
            }}
            className="rounded-full border border-[var(--color-luxury-gold)]/50 bg-black/85 px-3 py-1.5 text-[11px] font-bold text-white sm:px-3.5 sm:py-2 sm:text-xs shadow-2xl backdrop-blur-md"
          >
            ¿Te ayudamos a elegir? 💬
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setShowLabel(false);
          }}
          aria-label={open ? "Cerrar menú de WhatsApp" : "Abrir chat de WhatsApp"}
          aria-expanded={open}
          aria-controls="whatsapp-menu"
          className="relative flex h-[50px] w-[50px] items-center sm:h-[60px] sm:w-[60px] justify-center rounded-full bg-gradient-to-br from-[#2BE071] to-[#128C7E] text-white shadow-[0_6px_24px_rgba(37,211,102,0.5)] ring-2 ring-[var(--color-luxury-gold)]/80 ring-offset-2 ring-offset-black/40 transition-transform hover:scale-105 active:scale-95"
        >
          {/* Onda suave para llamar la atención; se apaga si el usuario pidió menos movimiento */}
          {!open && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping [animation-duration:2.4s] motion-reduce:hidden"
            />
          )}
          {open ? (
            <X className="relative h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
          ) : (
            <WhatsAppIcon className="relative h-[25px] w-[25px] sm:h-[30px] sm:w-[30px]" />
          )}
        </button>
      </div>
    </div>
  );
}
