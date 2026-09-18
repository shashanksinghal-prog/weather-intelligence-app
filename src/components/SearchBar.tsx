import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, AlertCircle } from 'lucide-react';
import { GeocodingResult } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
  onSearchDirect: (cityName: string) => Promise<boolean>;
  isLoading: boolean;
  searchError: string | null;
  onClearError: () => void;
  selectedCityName: string;
}

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onSearchDirect,
  isLoading,
  searchError,
  onClearError,
  selectedCityName,
}) => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    onClearError();
    setIsSubmitting(true);
    await onSearchDirect(trimmed);
    setIsSubmitting(false);
  };

  const handleClear = () => {
    setQuery('');
    onClearError();
    inputRef.current?.focus();
  };

  const handlePopularCityClick = (city: typeof POPULAR_CITIES[0]) => {
    onClearError();
    setQuery(city.name);
    onSelectCity({
      id: Math.floor(city.lat * 1000 + city.lon),
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lon,
    });
  };

  return (
    <div id="search-container" className="w-full max-w-4xl mx-auto space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (searchError) onClearError();
            }}
            placeholder="Search city by name (e.g., London, Tokyo, Sydney)..."
            disabled={isLoading || isSubmitting}
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm transition-all text-base"
          />
          {query && (
            <button
              id="btn-clear-search"
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="btn-search-submit"
          type="submit"
          disabled={isLoading || isSubmitting || !query.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium rounded-xl shadow-sm transition-all text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.99] shrink-0"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Inline Error Alert if city is not found or API fails */}
      {searchError && (
        <div
          id="search-error-alert"
          role="alert"
          className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{searchError}</span>
        </div>
      )}

      {/* Popular Cities Quick Select */}
      <div className="flex items-center flex-wrap gap-1.5 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          Popular Cities:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = selectedCityName.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              id={`quick-city-${city.name.toLowerCase()}`}
              type="button"
              onClick={() => handlePopularCityClick(city)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                isSelected
                  ? 'bg-sky-100 text-sky-800 border border-sky-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
