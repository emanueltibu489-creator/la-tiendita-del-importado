import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Check, X, ArrowRight, ArrowLeft, Send, Compass, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface SommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Product[];
  onSelectPerfume: (sku: string) => void;
  onReplaceCartWithProduct: (product: Product) => void;
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const PREFERENCE_KEYWORDS: Record<string, string[]> = {
  intenso: ['intenso', 'especiado', 'amaderado', 'cuero', 'oriental', 'ambar', 'calido', 'oud', 'denso'],
  dulce: ['dulce', 'gourmand', 'cremoso', 'atalcado', 'vainilla', 'caramelo', 'praline'],
  fresco: ['fresco', 'citrico', 'acuatico', 'verde', 'frutal', 'energizante'],
  noche: ['noche', 'nocturno', 'evento', 'formal', 'cita', 'otono', 'invierno'],
  dia: ['dia', 'diario', 'casual', 'primavera', 'verano', 'templado'],
  alta: ['alta', 'intensa', 'pesada', 'bestia', 'fuerte'],
  moderada: ['moderada', 'suave', 'sutil', 'elegante'],
};

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getSearchableProductText(product: Product): string {
  return normalizeText([
    product.description,
    product.shortDesc,
    product.descripcion_corta,
    product.perfil_olfativo,
    product.momento_ideal,
    product.estacion_ideal,
    product.proyeccion,
    product.character,
    product.notes?.salida,
    product.notes?.corazon,
    product.notes?.fondo,
    product.metrics?.momento,
    product.metrics?.clima,
    product.metrics?.estilo,
    product.metrics?.proyeccion,
  ].filter(Boolean).join(' '));
}

type GenderPreference = 'masculino' | 'femenino' | 'unisex' | 'indiferente';

interface RecommendationResult {
  product: Product | null;
  alternatives: Product[];
  usedGenderFallback: boolean;
}

function normalizeProductGender(value?: string): Exclude<GenderPreference, 'indiferente'> | null {
  const normalized = normalizeText(value || '');

  if (normalized.includes('unisex')) return 'unisex';
  if (normalized.includes('masculino') || normalized.includes('hombre')) return 'masculino';
  if (normalized.includes('femenino') || normalized.includes('mujer')) return 'femenino';
  return null;
}

function rankProducts(products: Product[], answerValues: string[]): Product[] {
  return products
    .map((product, index) => {
      const searchableText = getSearchableProductText(product);
      const score = answerValues.reduce((total, answer) => {
        const keywords = PREFERENCE_KEYWORDS[answer] || [];
        return total + keywords.filter((keyword) => searchableText.includes(keyword)).length;
      }, 0);

      return { product, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ product }) => product);
}

function recommendAvailablePerfume(
  perfumes: Product[],
  answers: Record<string, string>,
): RecommendationResult {
  const availablePerfumes = perfumes.filter(
    (product) => product.sku.trim() && (product.stock ?? 0) > 0,
  );

  if (availablePerfumes.length === 0) {
    return { product: null, alternatives: [], usedGenderFallback: false };
  }

  const genderPreference = answers.step1 as GenderPreference;
  const exactGenderMatches = genderPreference === 'indiferente'
    ? availablePerfumes
    : availablePerfumes.filter(
        (product) => normalizeProductGender(product.genero) === genderPreference,
      );
  const usedGenderFallback =
    genderPreference !== 'indiferente' && exactGenderMatches.length === 0;
  const candidates = usedGenderFallback ? availablePerfumes : exactGenderMatches;
  const answerValues = [answers.step2, answers.step3, answers.step4].filter(Boolean);
  const rankedCandidates = rankProducts(candidates, answerValues);
  const bestProduct = rankedCandidates[0];
  const alternatives = rankedCandidates
    .filter((product) => product.sku !== bestProduct.sku)
    .slice(0, 2);

  if (alternatives.length < 2) {
    const fallbackAlternatives = rankProducts(availablePerfumes, answerValues)
      .filter(
        (product) =>
          product.sku !== bestProduct.sku &&
          !alternatives.some((alternative) => alternative.sku === product.sku),
      )
      .slice(0, 2 - alternatives.length);
    alternatives.push(...fallbackAlternatives);
  }

  return { product: bestProduct, alternatives, usedGenderFallback };
}

export function SommelierModal({
  isOpen,
  onClose,
  perfumes,
  onSelectPerfume,
  onReplaceCartWithProduct,
  onAddToast,
}: SommelierModalProps) {
  const [activeTab, setActiveTab] = useState<'express' | 'ai'>('express');
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommended, setRecommended] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [recommendationNote, setRecommendationNote] = useState('');

  // Chat AI State
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const hasAvailablePerfumes = perfumes.some(
    (product) => product.sku.trim() && (product.stock ?? 0) > 0,
  );

  // Reset express test
  const resetExpressTest = () => {
    setStep(1);
    setAnswers({});
    setRecommended(null);
    setAlternatives([]);
    setRecommendationNote('');
  };

  const handleStepSelect = (stepNum: number, value: string) => {
    const updated = { ...answers, [`step${stepNum}`]: value };
    setAnswers(updated);

    if (stepNum < 4) {
      setStep(stepNum + 1);
    } else {
      const result = recommendAvailablePerfume(perfumes, updated);
      setRecommended(result.product);
      setAlternatives(result.alternatives);
      setRecommendationNote(
        result.usedGenderFallback
          ? 'No encontramos una coincidencia exacta con esa orientación entre los productos disponibles. Te mostramos la alternativa que mejor coincide con el resto de tus preferencias.'
          : '',
      );
      setStep(5);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await fetch('/api/sommelier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (response.ok) {
        setAiResponse(data.recommendation);
      } else {
        setAiResponse(data.error || 'Ocurrió un error al procesar el diagnóstico.');
      }
    } catch (err) {
      setAiResponse('Fallo de conexión. Por favor reintente en unos instantes.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleVerDetalles = () => {
    if (recommended) {
      onSelectPerfume(recommended.sku);
      onClose();
      document.getElementById('perfumeria')?.scrollIntoView({ behavior: 'smooth' });
      onAddToast(`Mostrando desglose de "${recommended.name}"`, 'info');
    }
  };

  const handleReservarRecomendado = () => {
    if (recommended) {
      onReplaceCartWithProduct(recommended);
      onClose();
    }
  };

  const handleVerAlternativa = (product: Product) => {
    onSelectPerfume(product.sku);
    onClose();
    document.getElementById('perfumeria')?.scrollIntoView({ behavior: 'smooth' });
    onAddToast(`Mostrando desglose de "${product.name}"`, 'info');
  };

  const handleVerCatalogo = () => {
    onClose();
    document.getElementById('perfumeria')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div id="modal-sommelier" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl glass-card rounded-2xl border border-[var(--color-luxury-gold)]/30 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-purple-950 flex justify-between items-center bg-purple-950/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--color-luxury-gold)]/50 shrink-0 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=70&h=70" 
                alt="Sommelier Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-luxury text-base sm:text-lg font-bold text-white tracking-wide">
              Sommelier de Fragancias
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold flex items-center gap-1"
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Tabs de Selección (AI o Heurístico) */}
        <div className="flex justify-center bg-purple-950/10 border-b border-purple-950 shrink-0 p-3.5 gap-2">
          <button
            onClick={() => setActiveTab('express')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'express'
                ? 'bg-[var(--color-luxury-gold)] text-purple-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Paso a Paso Express
          </button>
          <button
            onClick={() => {
              setActiveTab('ai');
              setAiResponse('');
              setQuery('');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-[var(--color-luxury-gold)] text-purple-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-purple-900/30'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Asesoría IA
          </button>
        </div>
        
        {/* Cuerpo del Modal con Banner de Referencia */}
        <div className="overflow-y-auto flex-1 flex flex-col" id="sommelier-modal-body-container">
          {step !== 5 && (
            <div className="h-28 w-full relative overflow-hidden shrink-0 border-b border-purple-950/40">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-luxury-purple-950)] via-[var(--color-luxury-purple-950)]/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600&h=200" 
                alt="Alta Perfumería" 
                className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2.5 left-6 z-20">
                <span className="text-[9px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.2em] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-900/40">
                  Asesoramiento Sensorial
                </span>
                <p className="text-[11px] text-gray-300 mt-1 font-light max-w-xs">
                  Dejate guiar por nuestro maestro perfumista y descubrí tu impronta ideal en stock.
                </p>
              </div>
            </div>
          )}
          
          <div className="p-6 flex-1">
            {activeTab === 'express' ? (
              hasAvailablePerfumes ? (
                <div>
                {/* Paso 1 */}
                {step === 1 && (
                  <div id="sommelier-step-1" className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                      <span>Paso 1 de 4</span>
                      <span className="text-[var(--color-luxury-gold)]">Orientación</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      ¿Qué tipo de perfume estás buscando?
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      <button
                        onClick={() => handleStepSelect(1, 'masculino')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Masculino
                      </button>
                      <button
                        onClick={() => handleStepSelect(1, 'femenino')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Femenino
                      </button>
                      <button
                        onClick={() => handleStepSelect(1, 'unisex')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Unisex
                      </button>
                      <button
                        onClick={() => handleStepSelect(1, 'indiferente')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Me da igual / sorprendeme
                      </button>
                    </div>
                  </div>
                )}

                {/* Paso 2 */}
                {step === 2 && (
                  <div id="sommelier-step-2" className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                      <span>Paso 2 de 4</span>
                      <span className="text-[var(--color-luxury-gold)]">Preferencia aromática</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      ¿Qué tipo de sensación olfativa buscas proyectar?
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      <button
                        onClick={() => handleStepSelect(2, 'intenso')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between group"
                      >
                        <span>🔥 Especiado, denso, seductor y misterioso</span>
                        <ArrowRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleStepSelect(2, 'dulce')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between group"
                      >
                        <span>🧁 Dulce gourmand, cremoso, envolvente y atalcado</span>
                        <ArrowRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleStepSelect(2, 'fresco')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between group"
                      >
                        <span>🌿 Cítrico, fresco, frutal y energizante</span>
                        <ArrowRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-4 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Regresar
                    </button>
                  </div>
                )}

                {/* Paso 3 */}
                {step === 3 && (
                  <div id="sommelier-step-3" className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                      <span>Paso 3 de 4</span>
                      <span className="text-[var(--color-luxury-gold)]">Momento y Clima</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      ¿En qué ocasiones tienes planeado usarlo preferentemente?
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      <button
                        onClick={() => handleStepSelect(3, 'noche')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        🌃 Principalmente de noche, eventos formales o citas especiales
                      </button>
                      <button
                        onClick={() => handleStepSelect(3, 'dia')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        ☀️ Versátil todo el día, salidas informales y climas templados
                      </button>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Regresar
                    </button>
                  </div>
                )}

                {/* Paso 4 */}
                {step === 4 && (
                  <div id="sommelier-step-4" className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                      <span>Paso 4 de 4</span>
                      <span className="text-[var(--color-luxury-gold)]">Proyección e Impacto</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      ¿Cuál es el nivel de impacto residual que buscas?
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      <button
                        onClick={() => handleStepSelect(4, 'alta')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        💥 Modo Bestia: Una estela inconfundible que se siente a distancia
                      </button>
                      <button
                        onClick={() => handleStepSelect(4, 'moderada')}
                        className="w-full p-4 text-left text-xs bg-white/5 hover:bg-purple-900/35 rounded-xl border border-purple-900/40 text-gray-300 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        ✨ Estela Elegante: Que se sienta al acercarse, sutil y refinado
                      </button>
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="mt-4 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Regresar
                    </button>
                  </div>
                )}

                {/* Paso Resultado */}
                {step === 5 && recommended && (
                  <div id="sommelier-resultado" className="space-y-4 text-center">
                    <span className="text-4xl block filter drop-shadow-md">🔮</span>
                    <span className="text-[10px] text-[var(--color-luxury-gold)] uppercase tracking-[0.2em] font-bold">
                      Diagnóstico Final del Sommelier
                    </span>
                    <h4 className="font-luxury text-2xl font-bold text-white mt-1">
                      Tu Fragancia Ideal es:
                    </h4>
                    {recommendationNote && (
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {recommendationNote}
                      </p>
                    )}
                    
                    {/* Tarjeta de Producto Recomendado */}
                    <div className="my-5 p-4 rounded-xl bg-purple-950/40 border border-[var(--color-luxury-gold)]/30 text-left relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-yellow-500/10 border border-yellow-500/20 text-[var(--color-luxury-gold)] text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                        Mejor coincidencia
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#B79CED]">
                        {recommended.brand}
                      </span>
                      <h5
                        className="notranslate font-luxury text-xl font-bold text-white mt-0.5"
                        translate="no"
                      >
                        {recommended.name}
                      </h5>
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed font-light">
                        {recommended.shortDesc}
                      </p>
                      
                      <div className="mt-3 flex justify-between items-center pt-3 border-t border-purple-900/40">
                        <span className="text-xs text-gray-400">Precio Sugerido:</span>
                        <span className="text-base font-bold text-[var(--color-luxury-gold)]">
                          ${recommended.price.toLocaleString('es-AR')} ARS
                        </span>
                      </div>
                    </div>

                    {/* Acciones de Recomendación */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <button
                        onClick={handleVerDetalles}
                        className="w-full sm:w-1/2 bg-purple-900/40 hover:bg-purple-950/60 text-white text-xs font-bold py-3 px-4 rounded-xl border border-purple-800/50 transition-all cursor-pointer text-center"
                      >
                        Ver Detalles Olfativos
                      </button>
                      <button
                        onClick={handleReservarRecomendado}
                        className="w-full sm:w-1/2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-gold)] text-white hover:text-purple-950 text-xs font-bold py-3 px-4 rounded-xl border border-[var(--color-luxury-gold)]/20 shadow-lg hover:shadow-[0_0_15px_rgba(110,68,178,0.3)] transition-all cursor-pointer text-center"
                      >
                        Reservar Ahora
                      </button>
                    </div>

                    {alternatives.length > 0 && (
                      <div className="pt-4 text-left space-y-3">
                        <h5 className="text-xs font-bold text-white">
                          También pueden gustarte
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {alternatives.map((product) => (
                            <div
                              key={product.sku}
                              className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40"
                            >
                              <span className="text-[9px] uppercase font-bold tracking-wider text-[#B79CED]">
                                {product.brand}
                              </span>
                              <h6
                                className="notranslate text-sm font-semibold text-white mt-0.5"
                                translate="no"
                              >
                                {product.name}
                              </h6>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {product.shortDesc || product.perfil_olfativo}
                              </p>
                              <button
                                onClick={() => handleVerAlternativa(product)}
                                className="mt-3 text-xs font-semibold text-[var(--color-luxury-gold)] hover:text-white transition-colors cursor-pointer"
                              >
                                Ver esta alternativa
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 flex flex-col items-center gap-2">
                      <button
                        onClick={handleVerCatalogo}
                        className="text-xs font-semibold text-[var(--color-luxury-gold)] hover:text-white underline tracking-wider cursor-pointer"
                      >
                        Ver catálogo completo
                      </button>
                      <button
                        onClick={resetExpressTest}
                        className="text-xs font-semibold text-purple-400 hover:text-white underline tracking-wider cursor-pointer font-sans"
                      >
                        Volver a empezar el test
                      </button>
                    </div>
                  </div>
                )}
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-[var(--color-luxury-gold)] mx-auto" />
                  <h4 className="text-sm font-bold text-white">
                    No hay perfumes disponibles en este momento
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Volvé a intentarlo más tarde o consultanos por WhatsApp.
                  </p>
                </div>
              )
            ) : (
              /* AI Tab: Chatbot or Consult query */
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 p-3 bg-purple-950/40 rounded-xl border border-purple-900/30">
                  <Brain className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0 animate-pulse" />
                  <p className="text-xs text-gray-300 leading-normal font-light">
                    Describe a la IA qué buscas hoy: un evento, estación, el tipo de notas (dulces, cítricas, especiadas), o tus gustos. Te recomendaremos la fragancia de nuestra carta que sea perfecta para ti con total asesoramiento.
                  </p>
                </div>

                <form onSubmit={handleAiSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: Busco un perfume súper seductor para citas de noche..."
                    className="flex-1 bg-black/40 border border-purple-950 rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[var(--color-luxury-gold)] transition-colors"
                    disabled={isAiLoading}
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !query.trim()}
                    className="bg-purple-900/60 hover:bg-[var(--color-luxury-gold)] hover:text-purple-950 rounded-xl px-4 py-3 flex items-center justify-center text-white cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold gap-1 shrink-0"
                  >
                    {isAiLoading ? (
                      <span className="w-4 h-4 border-2 border-t-transparent border-purple-400 rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Asesorar</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </form>

                <AnimatePresence mode="wait">
                  {aiResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-gray-300 font-light leading-relaxed space-y-4 max-h-[35vh] overflow-y-auto"
                    >
                      <div className="flex items-center gap-1 text-[10px] text-[var(--color-luxury-gold)] uppercase tracking-wider font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>Diagnóstico Olfativo Inteligente</span>
                      </div>
                      <p className="whitespace-pre-line">{aiResponse}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
