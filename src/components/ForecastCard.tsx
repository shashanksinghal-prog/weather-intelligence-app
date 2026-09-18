import React from 'react';
import { FormattedDayForecast } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface ForecastDisplayProps {
  daily: FormattedDayForecast[];
  tempUnit?: 'C' | 'F';
  selectedDayIndex?: number;
  onSelectDay?: (index: number) => void;
}

export const ForecastDisplay: React.FC<ForecastDisplayProps> = ({
  daily,
  tempUnit = 'C',
  selectedDayIndex,
  onSelectDay,
}) => {
  const displayTemp = (tempC: number) => {
    if (tempUnit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  // Find overall min and max across all 7 days to proportionally render temperature bars
  const overallMin = Math.min(...daily.map((d) => d.minTemp));
  const overallMax = Math.max(...daily.map((d) => d.maxTemp));
  const tempSpan = Math.max(1, overallMax - overallMin);

  return (
    <div id="forecast-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          7-Day Forecast
        </h2>
        <span className="text-xs font-medium text-slate-500">
          Synchronized to local city dates
        </span>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on sm, 3 or 4 on md, 7 on xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {daily.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - overallMin) / tempSpan) * 100));
          const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((day.maxTemp - day.minTemp) / tempSpan) * 100));

          return (
            <div
              key={day.dateString}
              id={`forecast-card-${idx}`}
              onClick={() => onSelectDay?.(idx)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                day.isToday
                  ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-300/40 shadow-xs'
                  : isSelected
                  ? 'bg-slate-50 border-slate-300 shadow-xs'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      {day.displayDay}
                    </span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-white rounded">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {day.monthDay}
                  </span>
                </div>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center justify-center text-center">
                <WeatherIcon
                  iconName={day.condition.iconName}
                  className="w-9 h-9"
                />
                <span className="text-xs font-medium text-slate-600 mt-1 line-clamp-1">
                  {day.condition.label}
                </span>
              </div>

              {/* Temperatures: High and Low */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {displayTemp(day.maxTemp)}°{tempUnit}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {displayTemp(day.minTemp)}°{tempUnit}
                  </span>
                </div>

                {/* Visual Relative Range Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Precipitation */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Droplets className={`w-3 h-3 ${day.precipitation > 0 ? 'text-blue-500' : 'text-slate-300'}`} />
                    <span>Rain</span>
                  </span>
                  <span className={`font-medium ${day.precipitation > 5 ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>
                    {day.precipitation} mm
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
