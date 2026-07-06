import type { ChangeEvent } from 'react';

export interface PerfumeFilterValues {
  query: string;
  gender: 'todos' | 'masculino' | 'femenino' | 'unisex';
  profile: string;
  occasion: string;
  minPrice: string;
  maxPrice: string;
}

interface PerfumeFiltersProps {
  filters: PerfumeFilterValues;
  profiles: string[];
  occasions: string[];
  resultCount: number;
  totalCount: number;
  onChange: (filters: PerfumeFilterValues) => void;
  onClear: () => void;
}

const controlClassName =
  'h-11 w-full rounded-lg border border-purple-900/60 bg-black/30 px-3 text-sm text-gray-100 outline-none transition-colors focus:border-[var(--color-luxury-gold)]';

export function PerfumeFilters({
  filters,
  profiles,
  occasions,
  resultCount,
  totalCount,
  onChange,
  onClear,
}: PerfumeFiltersProps) {
  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.gender !== 'todos' ||
    filters.profile !== '' ||
    filters.occasion !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  function updateFilter<Key extends keyof PerfumeFilterValues>(
    key: Key,
    value: PerfumeFilterValues[Key],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  function handleInputChange(
    key: keyof Pick<
      PerfumeFilterValues,
      'query' | 'profile' | 'occasion' | 'minPrice' | 'maxPrice'
    >,
  ) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      updateFilter(key, event.target.value);
    };
  }

  return (
    <div className="rounded-xl border border-purple-900/40 bg-black/20 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">
            Encontrá tu perfume
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {resultCount} de {totalCount} productos
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="min-h-11 self-start rounded-lg px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-luxury-gold)] transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-gray-300">
            Buscar por nombre
          </span>
          <input
            type="search"
            value={filters.query}
            onChange={handleInputChange('query')}
            placeholder="Ej: Yara, Asad, 9PM..."
            className={controlClassName}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-gray-300">
            Orientación
          </span>
          <select
            value={filters.gender}
            onChange={(event) =>
              updateFilter(
                'gender',
                event.target.value as PerfumeFilterValues['gender'],
              )
            }
            className={controlClassName}
          >
            <option value="todos">Todos</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>
      </div>

      <details className="mt-3 rounded-lg border border-purple-900/40 bg-black/20">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 text-sm font-semibold text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-luxury-gold)]">
          <span>Más filtros</span>
          <span
            aria-hidden="true"
            className="text-lg leading-none text-[var(--color-luxury-gold)]"
          >
            ⌄
          </span>
        </summary>

        <div className="grid grid-cols-1 gap-3 border-t border-purple-900/40 p-3 sm:grid-cols-2 lg:grid-cols-3">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">
              Perfil / aroma
            </span>
            <select
              value={filters.profile}
              onChange={handleInputChange('profile')}
              className={controlClassName}
            >
              <option value="">Todos</option>
              {profiles.map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">
              Ocasión
            </span>
            <select
              value={filters.occasion}
              onChange={handleInputChange('occasion')}
              className={controlClassName}
            >
              <option value="">Todas</option>
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">
              Precio mínimo
            </span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.minPrice}
              onChange={handleInputChange('minPrice')}
              placeholder="Sin mínimo"
              className={controlClassName}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">
              Precio máximo
            </span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.maxPrice}
              onChange={handleInputChange('maxPrice')}
              placeholder="Sin límite"
              className={controlClassName}
            />
          </label>
        </div>
      </details>
    </div>
  );
}