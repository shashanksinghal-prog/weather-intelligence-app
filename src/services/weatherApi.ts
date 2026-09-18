import {
  GeocodingResult,
  ForecastApiResponse,
  WeatherData,
  FormattedDayForecast,
} from '../types/weather';
import { getCityTodayDate, formatWeatherCalendarDate } from '../utils/weatherDate';
import { getWeatherCondition, generateSmartRecommendations } from '../utils/wmoCodes';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for cities matching the search query using Open-Meteo Geocoding API.
 * Returns empty array if no matches found.
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Location lookup failed with status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    country_code: item.country_code || '',
    admin1: item.admin1 || '',
    timezone: item.timezone || 'auto',
  }));
}

/**
 * Fetches current weather and 7-day forecast for given coordinates.
 * Normalized through single-source-of-truth date calculator.
 */
export async function fetchCityWeather(
  latitude: number,
  longitude: number,
  cityName: string,
  country: string,
  admin1?: string
): Promise<WeatherData> {
  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather forecast request failed with status: ${response.status}`);
  }

  const data: ForecastApiResponse = await response.json();

  if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
    throw new Error('Incomplete forecast data returned from service');
  }

  // CRITICAL: Single source of truth for the displayed city's current date
  const cityTodayDate = getCityTodayDate(data.daily.time);

  // Normalize 7-day forecast
  const dailyForecasts: FormattedDayForecast[] = data.daily.time.map((dateStr, index) => {
    const formattedDate = formatWeatherCalendarDate(dateStr, cityTodayDate);
    const code = data.daily.weathercode[index] ?? 0;
    const maxTemp = Math.round(data.daily.temperature_2m_max[index] ?? 0);
    const minTemp = Math.round(data.daily.temperature_2m_min[index] ?? 0);
    const precipitation = Number((data.daily.precipitation_sum[index] ?? 0).toFixed(1));

    return {
      dateString: dateStr,
      isToday: formattedDate.isToday,
      weekdayShort: formattedDate.weekdayShort,
      weekdayLong: formattedDate.weekdayLong,
      displayDay: formattedDate.displayDay,
      monthDay: formattedDate.monthDay,
      formattedFull: formattedDate.formattedFull,
      maxTemp,
      minTemp,
      precipitation,
      weatherCode: code,
      condition: getWeatherCondition(code, 1), // Day forecast overview
    };
  });

  // Current weather condition uses is_day directly from current_weather
  const currentCondition = getWeatherCondition(
    data.current_weather.weathercode,
    data.current_weather.is_day
  );

  const todayFormatted = formatWeatherCalendarDate(cityTodayDate, cityTodayDate);

  // Generate conditional smart planning recommendations
  const { primary, all } = generateSmartRecommendations(
    dailyForecasts[0]?.precipitation ?? 0,
    dailyForecasts[0]?.weatherCode ?? 0,
    dailyForecasts[0]?.maxTemp ?? 0,
    data.current_weather.windspeed ?? 0,
    dailyForecasts.map((d) => d.precipitation),
    dailyForecasts.map((d) => d.maxTemp),
    dailyForecasts.map((d) => d.weatherCode)
  );

  return {
    city: cityName,
    country: country,
    admin1: admin1,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    cityTodayDate: cityTodayDate,
    lastUpdatedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    current: {
      temp: Math.round(data.current_weather.temperature),
      windSpeed: Math.round(data.current_weather.windspeed),
      windDirection: Math.round(data.current_weather.winddirection),
      weatherCode: data.current_weather.weathercode,
      isDay: data.current_weather.is_day,
      condition: currentCondition,
      dateString: cityTodayDate,
      formattedDate: todayFormatted.formattedFull,
    },
    daily: dailyForecasts,
    recommendation: primary,
    allRecommendations: all,
  };
}
