import React from 'react';

interface BrandProps {
  className?: string;
  classNameText?: string;
  showText?: boolean;
}

export function BrandLogo({ className = 'h-10 sm:h-14 w-auto', showText = true }: BrandProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 160"
      className={`${className} select-none`}
      fill="none"
      id="brand-logo-svg"
    >
      <defs>
        {/* Gradiante metálico dorado premium */}
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB33C" />
          <stop offset="25%" stopColor="#FFF2CD" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#704D02" />
        </linearGradient>

        {/* Gradiente para sombreado sutil */}
        <linearGradient id="gold-shimmer" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A660E" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA790E" />
        </linearGradient>

        {/* Sombra para efecto 3D */}
        <filter id="gold-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.75" />
        </filter>
        <filter id="cart-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* GRUPO LOGO COMPLETO */}
      <g filter="url(#gold-shadow)">
        {/* CARRO DE COMPRAS (Dorado metálico) */}
        <g id="shopping-cart-group" filter="url(#cart-glow)">
          {/* Letras LTI arriba del carro */}
          <text
            x="96"
            y="42"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="26"
            fill="url(#gold-gradient)"
            textAnchor="middle"
            letterSpacing="3"
            stroke="#5c4308"
            strokeWidth="0.5"
          >
            LTI
          </text>

          {/* Manija del carro */}
          <path
            d="M 28 52 C 34 46, 42 46, 44 52 L 52 74 L 56 84"
            stroke="url(#gold-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cesta del carro */}
          {/* Borde exterior grueso */}
          <path
            d="M 52 74 L 146 74 C 151 74, 154 77, 152 82 L 138 126 C 136 131, 131 133, 126 133 L 74 133 C 69 133, 64 129, 62 124 L 52 74 Z"
            stroke="url(#gold-gradient)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(15, 7, 30, 0.45)"
          />

          {/* Rejilla interior vertical */}
          <path
            d="M 72 74 L 84 133 M 92 74 L 102 133 M 112 74 L 118 133 M 132 74 L 130 115"
            stroke="url(#gold-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Rejilla interior horizontal */}
          <path
            d="M 57 89 L 147 89 M 60 104 L 143 104 M 64 118 L 136 118"
            stroke="url(#gold-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Soporte inferior de ruedas */}
          <path
            d="M 70 133 C 70 139, 130 139, 130 133"
            stroke="url(#gold-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Rueda trasera */}
          <circle
            cx="75"
            cy="145"
            r="9.5"
            fill="url(#gold-shimmer)"
            stroke="url(#gold-gradient)"
            strokeWidth="2.5"
          />
          <circle
            cx="75"
            cy="145"
            r="4"
            fill="#3d2703"
          />

          {/* Rueda delantera */}
          <circle
            cx="125"
            cy="145"
            r="9.5"
            fill="url(#gold-shimmer)"
            stroke="url(#gold-gradient)"
            strokeWidth="2.5"
          />
          <circle
            cx="125"
            cy="145"
            r="4"
            fill="#3d2703"
          />
        </g>

        {/* TEXTO DE MARCA (La Tiendita del Importado) */}
        {showText && (
          <g id="brand-text-group">
            {/* Texto Principal en una sola línea elegante, imitando al adjunto */}
            <text
              x="175"
              y="98"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="700"
              fontSize="34"
              fill="url(#gold-gradient)"
              letterSpacing="2.5"
              stroke="#4a3402"
              strokeWidth="0.5"
              className="tracking-wide"
            >
              La Tiendita del Importado
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

export function BrandEmblem({ className = 'w-full h-full p-2' }: BrandProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 180"
      className={`${className} select-none`}
      fill="none"
      id="brand-emblem-svg"
    >
      <defs>
        <linearGradient id="gold-grad-emblem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB33C" />
          <stop offset="25%" stopColor="#FFF2CD" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#704D02" />
        </linearGradient>
        <linearGradient id="gold-shimmer-emblem" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A660E" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA790E" />
        </linearGradient>
        <filter id="emblem-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      <g filter="url(#emblem-shadow)">
        {/* LTI */}
        <text
          x="90"
          y="38"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="24"
          fill="url(#gold-grad-emblem)"
          textAnchor="middle"
          letterSpacing="3"
          stroke="#5c4308"
          strokeWidth="0.5"
        >
          LTI
        </text>

        {/* Manija */}
        <path
          d="M 24 48 C 30 42, 38 42, 40 48 L 48 70 M 48 70 L 52 80"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cesta */}
        <path
          d="M 48 70 L 140 70 C 145 70, 148 73, 146 78 L 132 122 C 130 127, 125 129, 120 129 L 68 129 C 63 129, 58 125, 56 120 L 48 70 Z"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(20, 10, 35, 0.5)"
        />

        {/* Rejillas */}
        <path
          d="M 66 70 L 78 129 M 86 70 L 96 129 M 106 70 L 112 129 M 126 70 L 124 110"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 52 84 L 142 84 M 55 98 L 138 98 M 58 112 L 131 112"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Soporte ruedas */}
        <path
          d="M 64 129 C 64 135, 124 135, 124 129"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Ruedas */}
        <circle
          cx="70"
          cy="141"
          r="8.5"
          fill="url(#gold-shimmer-emblem)"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="2"
        />
        <circle
          cx="70"
          cy="141"
          r="3"
          fill="#3d2703"
        />

        <circle
          cx="118"
          cy="141"
          r="8.5"
          fill="url(#gold-shimmer-emblem)"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="2"
        />
        <circle
          cx="118"
          cy="141"
          r="3"
          fill="#3d2703"
        />

        {/* Texto circular o etiqueta abajo, si procede, o un arco brillante */}
        <path
          d="M 20 120 C 15 155, 165 155, 160 120"
          stroke="url(#gold-grad-emblem)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}
