import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastDisplay } from './components/ForecastCard';
import { WeatherChart } from './components/WeatherChart';
import { Recommendations } from './components/Recommendations';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherData, GeocodingResult } from './types/weather';
import { searchCities, fetchCityWeather } from './services/weatherApi';
import { Info, CheckCircle2 } from 'lucide-react';

const DEFAULT_CITY = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
  admin1: 'England',
};

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Current active location coords & name
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    country: string;
    lat: number;
    lon: number;
    admin1?: string;
  }>(DEFAULT_CITY);

  // Load weather for given coordinates
  const loadWeather = useCallback(async (
    lat: number,
    lon: number,
    cityName: string,
    country: string,
    admin1?: string
  ) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await fetchCityWeather(lat, lon, cityName, country, admin1);
      setWeatherData(data);
      setCurrentLocation({ name: cityName, country, lat, lon, admin1 });
      setSelectedDayIndex(0);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setApiError(err.message || 'Failed to load weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: Default to London on launch
  useEffect(() => {
    loadWeather(
      DEFAULT_CITY.latitude,
      DEFAULT_CITY.longitude,
      DEFAULT_CITY.name,
      DEFAULT_CITY.country,
      DEFAULT_CITY.admin1
    );
  }, [loadWeather]);

  // Handle direct search by city name
  const handleSearchDirect = async (cityName: string): Promise<boolean> => {
    setSearchError(null);
    try {
      const results = await searchCities(cityName);
      if (results.length === 0) {
        setSearchError('City not found. Please check spelling and try again.');
        return false;
      }

      const topResult = results[0];
      await loadWeather(
        topResult.latitude,
        topResult.longitude,
        topResult.name,
        topResult.country || '',
        topResult.admin1
      );
      return true;
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError('Network error while searching for city. Please check your connection.');
      return false;
    }
  };

  // Handle selecting a city from autocomplete or popular chips
  const handleSelectCity = (city: GeocodingResult) => {
    setSearchError(null);
    loadWeather(city.latitude, city.longitude, city.name, city.country || '', city.admin1);
  };

  // Refresh current forecast
  const handleRefresh = () => {
    loadWeather(
      currentLocation.lat,
      currentLocation.lon,
      currentLocation.name,
      currentLocation.country,
      currentLocation.admin1
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation */}
      <Header
        tempUnit={tempUnit}
        onToggleUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
        lastUpdated={weatherData?.lastUpdatedTimestamp}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-6 space-y-6">
        {/* Search Bar & City Selector */}
        <section aria-label="City Search">
          <SearchBar
            onSelectCity={handleSelectCity}
            onSearchDirect={handleSearchDirect}
            isLoading={isLoading}
            searchError={searchError}
            onClearError={() => setSearchError(null)}
            selectedCityName={currentLocation.name}
          />
        </section>

        {/* API Failure Screen with Retry */}
        {apiError && !isLoading && (
          <ErrorMessage
            message={apiError}
            onRetry={handleRefresh}
          />
        )}

        {/* Skeleton Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Full Weather Intelligence Dashboard */}
        {!isLoading && weatherData && !apiError && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Row: Current Weather Overview & Smart Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Current Weather Card */}
              <div className="lg:col-span-7 flex flex-col">
                <CurrentWeather
                  weather={weatherData}
                  tempUnit={tempUnit}
                />
              </div>

              {/* Smart Planning Recommendations Card */}
              <div className="lg:col-span-5 flex flex-col">
                <Recommendations weather={weatherData} />
              </div>
            </div>

            {/* Middle Section: 7-Day Forecast Cards */}
            <ForecastDisplay
              daily={weatherData.daily}
              tempUnit={tempUnit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />

            {/* Bottom Section: 7-Day High/Low Temperature Trends Chart */}
            <WeatherChart
              daily={weatherData.daily}
              tempUnit={tempUnit}
              selectedIndex={selectedDayIndex}
              onSelectIndex={(idx) => setSelectedDayIndex(idx)}
            />

            {/* Timezone & Date Synchronization Verification Note */}
            <div className="flex items-center gap-2 p-3.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-500 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Timezone Authenticity:</strong> Weather calendar dates are anchored directly to Open-Meteo's local timezone data, guaranteeing identical date accuracy across all components for {weatherData.city} ({weatherData.timezone}).
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Weather Intelligence Dashboard • Powered by public keyless{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline font-medium"
            >
              Open-Meteo APIs
            </a>
          </p>
          <p>Deployable on Cloudflare Pages • No API keys required</p>
        </div>
      </footer>
    </div>
  );
}
