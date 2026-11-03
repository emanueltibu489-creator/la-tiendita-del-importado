// El frasquito mascota de los reels, versión sommelier (moñito dorado, sonriendo).
// Dibujo vectorial: no depende de fotos externas y se ve nítido en cualquier tamaño.
export function Mascota({ className, floating = false }: { className?: string; floating?: boolean }) {
  return (
    <svg
      viewBox="10 36 230 300"
      role="img"
      aria-label="Mascota de La Tiendita: frasquito de perfume sommelier"
      className={`${className ?? ''} ${floating ? 'animate-[mascota-flotar_3.2s_ease-in-out_infinite] motion-reduce:animate-none' : ''}`}
    >
      <defs>
        <linearGradient id="mascota-oro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2cd" />
          <stop offset="0.45" stopColor="#d4af37" />
          <stop offset="1" stopColor="#9a6f0f" />
        </linearGradient>
      </defs>
      {/* piernas */}
      <g stroke="#f1e8ff" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M 98 288 L 94 322" />
        <path d="M 142 288 L 146 322" />
      </g>
      <ellipse cx="88" cy="324" rx="15" ry="7" fill="#f1e8ff" />
      <ellipse cx="152" cy="324" rx="15" ry="7" fill="#f1e8ff" />
      {/* brazos */}
      <path d="M 60 190 Q 36 206 22 232" stroke="#f1e8ff" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="236" r="10" fill="#f1e8ff" />
      <path d="M 180 190 Q 204 176 214 150" stroke="#f1e8ff" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="216" cy="146" r="10" fill="#f1e8ff" />
      {/* atomizador */}
      <path d="M 156 78 C 176 70, 190 64, 202 62" stroke="#d4af37" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="214" cy="60" rx="15" ry="19" fill="url(#mascota-oro)" stroke="#fff2cd" strokeWidth="3" />
      {/* cuello y tapa */}
      <rect x="100" y="100" width="40" height="30" rx="4" fill="#5b3ea3" stroke="#f1e8ff" strokeWidth="4" />
      <path d="M 86 62 L 154 62 L 162 102 L 78 102 Z" fill="url(#mascota-oro)" stroke="#fff2cd" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 104 62 L 100 102 M 136 62 L 140 102" stroke="#9a6f0f" strokeWidth="2.5" opacity="0.6" />
      <rect x="108" y="46" width="24" height="18" rx="5" fill="url(#mascota-oro)" stroke="#fff2cd" strokeWidth="3" />
      {/* cuerpo de vidrio violeta */}
      <path d="M 62 150 Q 62 128 84 126 L 156 126 Q 178 128 178 150 L 184 262 Q 184 292 154 294 L 86 294 Q 56 292 56 262 Z" fill="#7b55c9" stroke="#f1e8ff" strokeWidth="5" strokeLinejoin="round" />
      <path d="M 60 222 Q 120 206 180 222 L 182 262 Q 182 288 154 290 L 86 290 Q 58 288 58 262 Z" fill="#e2bf4f" opacity="0.38" />
      <path d="M 76 140 L 96 140 L 89 276 L 72 272 Z" fill="#c4b0f5" opacity="0.5" />
      {/* moñito de sommelier */}
      <path d="M 120 134 L 96 122 L 96 148 Z M 120 134 L 144 122 L 144 148 Z" fill="#e2bf4f" stroke="#fff2cd" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="120" cy="134" r="6" fill="#9a6f0f" />
      {/* cara */}
      <g stroke="#1b0f2e" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M 86 160 Q 100 154 112 160" />
        <path d="M 130 160 Q 142 154 156 160" />
      </g>
      <ellipse cx="100" cy="186" rx="15" ry="18" fill="#fff" />
      <ellipse cx="142" cy="186" rx="15" ry="18" fill="#fff" />
      <circle cx="102" cy="189" r="7.5" fill="#1b0f2e" />
      <circle cx="144" cy="189" r="7.5" fill="#1b0f2e" />
      <circle cx="105" cy="185" r="2.5" fill="#fff" />
      <circle cx="147" cy="185" r="2.5" fill="#fff" />
      <ellipse cx="84" cy="212" rx="10" ry="6" fill="#ff9ccf" opacity="0.45" />
      <ellipse cx="158" cy="212" rx="10" ry="6" fill="#ff9ccf" opacity="0.45" />
      <path d="M 104 222 Q 121 238 138 222" stroke="#1b0f2e" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
