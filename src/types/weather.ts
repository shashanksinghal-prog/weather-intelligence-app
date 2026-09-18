/**
 * Weather Intelligence App Type Definitions
 */

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherRaw {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeatherRaw;
  daily: DailyForecastRaw;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  iconName: string;
  isRain: boolean;
  isSnow: boolean;
  isClear: boolean;
  isCloudy: boolean;
  isThunder: boolean;
  dayOrNightLabel: string;
}

export interface FormattedDayForecast {
  dateString: string; // The raw YYYY-MM-DD from API (e.g. "2026-09-08")
  isToday: boolean;
  weekdayShort: string; // e.g. "Tue"
  weekdayLong: string; // e.g. "Tuesday"
  displayDay: string; // "Today" or "Tue"
  monthDay: string; // "Sep 8"
  formattedFull: string; // "Tuesday, Sep 8, 2026"
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
}

export interface SmartRecommendation {
  type: 'rain' | 'heat' | 'wind' | 'pleasant';
  title: string;
  message: string;
  badge: string;
  urgency: 'high' | 'medium' | 'low' | 'neutral';
}

export interface WeatherData {
  city: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  cityTodayDate: string; // Single source of truth from daily.time[0]
  lastUpdatedTimestamp: string; // Device timestamp purely for UI refresh tracking
  current: {
    temp: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    isDay: number; // 1 = day, 0 = night
    condition: WeatherConditionInfo;
    dateString: string;
    formattedDate: string;
  };
  daily: FormattedDayForecast[];
  recommendation: SmartRecommendation;
  allRecommendations: SmartRecommendation[];
}
