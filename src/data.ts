import { Product } from './types';

export const PERFUMES: Product[] = [
  {
    id: 'asad',
    brand: 'Lattafa',
    name: 'Asad Elixir Premium',
    price: 75000,
    category: 'Perfumería',
    description: 'Carácter: Especiado, Cálido, Misterioso.',
    shortDesc: 'Un elixir especiado intenso, ideal para conquistar la noche.',
    character: 'Especiado, Cálido, Misterioso',
    imageType: 'asad',
    badge: 'Seña: 30%',
    notes: {
      salida: 'Pimienta negra, canela intensa y destellos limpios de cardamomo.',
      corazon: 'Esencia pura de lavanda refinada y acordes de patchouli orgánico.',
      fondo: 'Vainilla rica, ámbar gris profundo y maderas preciosas de oriente.',
    },
    metrics: {
      momento: 'Pura Noche',
      iconMomento: '🌙',
      clima: 'Otoño / Invierno',
      iconClima: '❄️',
      estilo: 'Formal / Citas',
      iconEstilo: '👔',
      proyeccion: 'Pesada (Modo Bestia)',
      iconProyeccion: '⏳',
    }
  },
  {
    id: 'yara',
    brand: 'Lattafa',
    name: 'Yara Eau de Parfum',
    price: 68000,
    category: 'Perfumería',
    description: 'Carácter: Dulce, Cremoso, Atalcado.',
    shortDesc: 'Una fragancia dulce gourmand, cremosa y sumamente envolvente.',
    character: 'Dulce, Cremoso, Atalcado',
    imageType: 'yara',
    badge: 'Seña: 30%',
    notes: {
      salida: 'Heliotropo dulce, acordes limpios de mandarina y orquídea salvaje.',
      corazon: 'Acorde gourmand tropical, frutas maduras y crema batida untuosa.',
      fondo: 'Vainilla Gourmand, sándalo sedoso y almizcle blanco de alta fijación.',
    },
    metrics: {
      momento: 'Día y Tarde',
      iconMomento: '🌆',
      clima: 'Primavera / Verano',
      iconClima: '☀️',
      estilo: 'Casual / Elegante',
      iconEstilo: '👜',
      proyeccion: 'Moderada (Estela Dulce)',
      iconProyeccion: '✨',
    }
  },
  {
    id: 'valhalla',
    brand: 'Rayhaan',
    name: 'Valhalla Imperium',
    price: 82000,
    category: 'Perfumería',
    description: 'Carácter: Fresco, Cítrico, Frutal Extremo.',
    shortDesc: 'Un perfume cítrico fresco con ráfagas frutales salvajes y magnéticas.',
    character: 'Fresco, Cítrico, Frutal Extremo',
    imageType: 'valhalla',
    badge: 'Seña: 30%',
    notes: {
      salida: 'Bergamota de Calabria, mango fresco y pomelo amargo vibrante.',
      corazon: 'Jengibre picante, dejos de violeta triturada y jazmín acuático.',
      fondo: 'Vetiver de Haití, madera de cedro blanco y ámbar seco radiante.',
    },
    metrics: {
      momento: 'Todo el Día',
      iconMomento: '☀️',
      clima: 'Caluroso / Templado',
      iconClima: '🌊',
      estilo: 'Deportivo / Casual',
      iconEstilo: '👟',
      proyeccion: 'Alta (Ráfaga Fresca)',
      iconProyeccion: '💨',
    }
  },
  {
    id: 'khamrah',
    brand: 'Lattafa',
    name: 'Khamrah Luxury',
    price: 89000,
    category: 'Perfumería',
    description: 'Carácter: Dulce Licoroso, Canela, Dátiles.',
    shortDesc: 'Una obra de arte licorosa y dulce con especias cálidas de oriente.',
    character: 'Dulce Licoroso, Canela, Dátiles',
    imageType: 'khamrah',
    badge: 'Seña: 30%',
    notes: {
      salida: 'Bergamota chispeante, dulce canela picante y nuez moscada intensa.',
      corazon: 'Dátiles dulces, praliné crujiente, nardos y lirio de los valles.',
      fondo: 'Haba tonka tostada, mirra fina, madera de ámbar, vainilla y benjuí.',
    },
    metrics: {
      momento: 'Atardecer / Noche',
      iconMomento: '🌌',
      clima: 'Climas Fríos / Templados',
      iconClima: '🍂',
      estilo: 'Gourmand / Distinguido',
      iconEstilo: '🧥',
      proyeccion: 'Pesada (Modo Bestia)',
      iconProyeccion: '⏳',
    }
  }
];

export const BAZAR: Product[] = [
  {
    id: 'termo',
    name: 'Termo Black Legendary 1.2L',
    price: 95000,
    category: 'Bazar',
    description: 'Doble capa de vacío. Mantiene bebidas calientes hasta por 40 horas. Acabado texturado negro mate anti-rasguños de nivel militar.',
    imageType: 'termo',
    badge: 'Inoxidable 18/8'
  },
  {
    id: 'mate',
    name: 'Mate Imperial de Caldén',
    price: 45000,
    category: 'Bazar',
    description: 'Tallado a mano en madera noble de Caldén, forrado en cuero genuino seleccionando texturas exclusivas con virola de alpaca cincelada.',
    imageType: 'mate',
    badge: 'Artesanal'
  },
  {
    id: 'tetera',
    name: 'Tetera de Vidrio Borosilicato',
    price: 38000,
    category: 'Bazar',
    description: 'Ideal para infusiones complejas. Soporta choque térmico extremo, incluye filtro de acero inoxidable y asa de madera natural fría al tacto.',
    imageType: 'tetera',
    badge: 'Set Completo'
  }
];

export const TECNO: Product[] = [
  {
    id: 'watch',
    brand: 'Amazfit',
    name: 'Amazfit Active Luxury',
    price: 165000,
    category: 'Tecno',
    description: 'Pantalla AMOLED cristalina de alta resolución, sensor biométrico de precisión médica, GPS integrado y autonomía extendida de 14 días.',
    imageType: 'watch',
    badge: 'Smartwatch'
  },
  {
    id: 'speaker',
    brand: 'Aura',
    name: 'Parlante Bluetooth Aura 6',
    price: 115000,
    category: 'Tecno',
    description: 'Graves profundos con radiadores pasivos duales, resistencia total al agua IPX7, ecualización por app y 12 horas de música continua.',
    imageType: 'speaker',
    badge: 'Sonido Hi-Fi'
  }
];

export const PRODUCTS: Product[] = [...PERFUMES, ...BAZAR, ...TECNO];
export const WHATSAPP_CONTACT = '5493434000000'; // Target whatsapp phone number
