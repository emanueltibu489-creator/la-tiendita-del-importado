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
  brand?: string;
  name: string;
  price: number;
  category: 'Perfumería' | 'Bazar' | 'Tecno';
  description: string;
  shortDesc?: string;
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
