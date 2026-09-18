import { WeatherConditionInfo, SmartRecommendation } from '../types/weather';

/**
 * Maps Open-Meteo WMO weather interpretation codes to human-readable labels,
 * classification flags, and day/night variations.
 * 
 * Note: isDay is strictly from current_weather.is_day (1 = day, 0 = night)
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return {
        code,
        label: isNight ? 'Clear Night' : 'Clear Sky',
        iconName: isNight ? 'Moon' : 'Sun',
        isRain: false,
        isSnow: false,
        isClear: true,
        isCloudy: false,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 1:
      return {
        code,
        label: isNight ? 'Mainly Clear Night' : 'Mainly Clear',
        iconName: isNight ? 'CloudMoon' : 'CloudSun',
        isRain: false,
        isSnow: false,
        isClear: true,
        isCloudy: false,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        iconName: isNight ? 'CloudMoon' : 'CloudSun',
        isRain: false,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        iconName: 'Cloud',
        isRain: false,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        iconName: 'CloudFog',
        isRain: false,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 55 ? 'Heavy Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Light Drizzle',
        iconName: 'CloudDrizzle',
        isRain: true,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        iconName: 'CloudSnow',
        isRain: true,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 65 ? 'Heavy Rain' : code === 63 ? 'Moderate Rain' : 'Slight Rain',
        iconName: 'CloudRain',
        isRain: true,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        iconName: 'CloudRain',
        isRain: true,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 75 ? 'Heavy Snow' : code === 73 ? 'Moderate Snow' : 'Slight Snow',
        iconName: 'CloudSnow',
        isRain: false,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        iconName: 'CloudSnow',
        isRain: false,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Showers' : code === 81 ? 'Moderate Showers' : 'Light Showers',
        iconName: 'CloudRain',
        isRain: true,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 85:
    case 86:
      return {
        code,
        label: code === 86 ? 'Heavy Snow Showers' : 'Snow Showers',
        iconName: 'CloudSnow',
        isRain: false,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        isRain: true,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: true,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        isRain: true,
        isSnow: true,
        isClear: false,
        isCloudy: true,
        isThunder: true,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
    default:
      return {
        code,
        label: 'Variable Clouds',
        iconName: 'Cloud',
        isRain: false,
        isSnow: false,
        isClear: false,
        isCloudy: true,
        isThunder: false,
        dayOrNightLabel: isNight ? 'Night' : 'Day',
      };
  }
}

/**
 * Checks if a WMO code corresponds to rainy/showery conditions
 */
export function isRainWeatherCode(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

/**
 * Generates conditional smart planning recommendations based on current and daily forecast:
 * 
 * Rules:
 * 1. If precipitation > 5mm or rain weathercode: "Rain expected—pack an umbrella!"
 * 2. If max temp > 30°C: "Hot weather ahead—stay hydrated and wear sunscreen."
 * 3. If wind speed > 25 km/h: "Breezy conditions—secure loose outdoor items."
 * 4. Otherwise: "Pleasant weather—great for outdoor activities!"
 */
export function generateSmartRecommendations(
  todayPrecip: number,
  todayWeatherCode: number,
  todayMaxTemp: number,
  currentWindSpeed: number,
  dailyPrecipitations: number[],
  dailyMaxTemps: number[],
  dailyWeatherCodes: number[]
): { primary: SmartRecommendation; all: SmartRecommendation[] } {
  const isRainCondition = todayPrecip > 5 || isRainWeatherCode(todayWeatherCode);
  const isHotCondition = todayMaxTemp > 30;
  const isWindyCondition = currentWindSpeed > 25;

  let primary: SmartRecommendation;

  if (isRainCondition) {
    primary = {
      type: 'rain',
      title: 'Rain Advisory',
      message: 'Rain expected—pack an umbrella!',
      badge: 'Precipitation Alert',
      urgency: 'high',
    };
  } else if (isHotCondition) {
    primary = {
      type: 'heat',
      title: 'High Heat Advisory',
      message: 'Hot weather ahead—stay hydrated and wear sunscreen.',
      badge: 'Heat Warning',
      urgency: 'high',
    };
  } else if (isWindyCondition) {
    primary = {
      type: 'wind',
      title: 'Wind Advisory',
      message: 'Breezy conditions—secure loose outdoor items.',
      badge: 'Breezy Outlook',
      urgency: 'medium',
    };
  } else {
    primary = {
      type: 'pleasant',
      title: 'Optimal Conditions',
      message: 'Pleasant weather—great for outdoor activities!',
      badge: 'Fair Weather',
      urgency: 'low',
    };
  }

  // Also build week outlook recommendations for the 7-day view
  const all: SmartRecommendation[] = [primary];

  // Check if upcoming days have high rain
  const upcomingRainIndex = dailyPrecipitations.findIndex((p, idx) => idx > 0 && (p > 5 || isRainWeatherCode(dailyWeatherCodes[idx])));
  if (upcomingRainIndex !== -1 && primary.type !== 'rain') {
    all.push({
      type: 'rain',
      title: 'Upcoming Rain',
      message: `Rain expected later this week (Day ${upcomingRainIndex + 1})—keep rain gear handy.`,
      badge: 'Mid-week Rain',
      urgency: 'medium',
    });
  }

  // Check if upcoming heatwave
  const upcomingHotIndex = dailyMaxTemps.findIndex((t, idx) => idx > 0 && t > 30);
  if (upcomingHotIndex !== -1 && primary.type !== 'heat') {
    all.push({
      type: 'heat',
      title: 'Upcoming Warm Spell',
      message: `Temperatures exceeding 30°C expected on upcoming days—plan outdoor workouts for early morning.`,
      badge: 'Heat Watch',
      urgency: 'medium',
    });
  }

  return { primary, all };
}
