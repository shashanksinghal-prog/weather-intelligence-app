import React from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Wind, Droplets, ArrowUp, ArrowDown, Calendar, Compass, Sun, Moon } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  tempUnit?: 'C' | 'F';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  tempUnit = 'C',
}) => {
  const { current, city, country, admin1, timezone, cityTodayDate, daily } = weather;
  const todayForecast = daily[0];

  const displayTemp = (tempC: number) => {
    if (tempUnit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const isDaytime = current.isDay === 1;

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all h-full flex flex-col justify-between flex-1"
    >
      {/* Background ambient accent */}
      <div
        className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40 ${
          isDaytime ? 'bg-amber-100' : 'bg-indigo-100'
        }`}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Top Header: Location, Country, and Synchronized Date */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1
                id="current-weather-city"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
              >
                {city}
              </h1>
              <span className="text-lg font-medium text-slate-400">
                {country ? `${country}` : ''}
              </span>
            </div>
            {admin1 && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {admin1} • {timezone}
              </p>
            )}
          </div>

          {/* Single source of truth Date & Day/Night Indicator */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <div
              id="current-weather-date-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200/60 rounded-lg text-xs font-semibold text-slate-700"
              title="Calculated from Forecast API daily.time[0] single source of truth"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{todayForecast?.formattedFull || current.formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span
                id="day-night-indicator"
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDaytime
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}
              >
                {isDaytime ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-600" />
                    <span>Daytime</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-indigo-600" />
                    <span>Night</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Temperature, Weather Icon & Condition */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2">
          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
              <WeatherIcon
                iconName={current.condition.iconName}
                className="w-14 h-14 sm:w-16 sm:h-16"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  id="current-temperature-val"
                  className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900"
                >
                  {displayTemp(current.temp)}
                </span>
                <span className="text-2xl sm:text-3xl font-semibold text-slate-500">
                  °{tempUnit}
                </span>
              </div>
              <div
                id="current-weather-condition-label"
                className="text-base sm:text-lg font-medium text-slate-700 mt-0.5"
              >
                {current.condition.label}
              </div>
            </div>
          </div>

          {/* Today's Range: High / Low */}
          {todayForecast && (
            <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-start text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  <ArrowUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>High {displayTemp(todayForecast.maxTemp)}°{tempUnit}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                  <ArrowDown className="w-3.5 h-3.5 text-sky-500" />
                  <span>Low {displayTemp(todayForecast.minTemp)}°{tempUnit}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Day 1 of 7-Day Forecast
              </p>
            </div>
          )}
        </div>

        {/* Bottom Metrics: Wind Speed & Precipitation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="p-2 bg-white rounded-lg shadow-xs text-sky-600 border border-slate-100">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Wind Speed</p>
              <p id="current-windspeed-val" className="text-sm font-semibold text-slate-900">
                {current.windSpeed} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="p-2 bg-white rounded-lg shadow-xs text-blue-600 border border-slate-100">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Today's Precipitation</p>
              <p id="current-precipitation-val" className="text-sm font-semibold text-slate-900">
                {todayForecast ? `${todayForecast.precipitation} mm` : '0 mm'}
              </p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="p-2 bg-white rounded-lg shadow-xs text-indigo-600 border border-slate-100">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Wind Direction</p>
              <p className="text-sm font-semibold text-slate-900">
                {current.windDirection}° ({getCompassHeading(current.windDirection)})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCompassHeading(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}
