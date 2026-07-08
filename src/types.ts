export interface PerfumeNotes {
  salida: string;
  corazon: string;
  fondo: string;
}

export interface PerfumeMetrics {
  momento: string;
  iconMomento: string;
  clima: string;
  iconClima: string;
  estilo: string;
  iconEstilo: string;
  proyeccion: string;
  iconProyeccion: string;
}

export interface Product {
  id: string;
  sku: string;
  brand?: string;
  name: string;
  price: number;
  offerPrice?: number | null;
  stock?: number;
  isFlashOffer?: boolean;
  isFeatured?: boolean;
  category: 'Perfumería' | 'Bazar' | 'Tecno';
  description: string;
  shortDesc?: string;
  descripcion_corta?: string;
  perfil_olfativo?: string;
  genero?: string;
  momento_ideal?: string;
  estacion_ideal?: string;
  proyeccion?: string;
  character?: string;
  notes?: PerfumeNotes;
  metrics?: PerfumeMetrics;
  imageType: string;
  image?: string;
  images?: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
