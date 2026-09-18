import React from 'react';
import { SmartRecommendation, WeatherData } from '../types/weather';
import { Umbrella, SunMedium, Wind, Smile, Sparkles, CheckCircle2 } from 'lucide-react';

interface RecommendationsProps {
  weather: WeatherData;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ weather }) => {
  const { recommendation, allRecommendations, current, daily } = weather;
  const todayForecast = daily[0];

  const getRecommendationTheme = (type: SmartRecommendation['type']) => {
    switch (type) {
      case 'rain':
        return {
          icon: Umbrella,
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
          containerBg: 'bg-blue-50/70 border-blue-200/80',
          textColor: 'text-blue-900',
          accentColor: 'text-blue-600',
          subtext: `Today's rain forecast is ${todayForecast?.precipitation ?? 0} mm (${todayForecast?.condition.label || 'Wet'}).`,
        };
      case 'heat':
        return {
          icon: SunMedium,
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
          containerBg: 'bg-amber-50/70 border-amber-200/80',
          textColor: 'text-amber-950',
          accentColor: 'text-amber-600',
          subtext: `Today's high is expected to reach ${todayForecast?.maxTemp ?? current.temp}°C.`,
        };
      case 'wind':
        return {
          icon: Wind,
          badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
          containerBg: 'bg-teal-50/70 border-teal-200/80',
          textColor: 'text-teal-950',
          accentColor: 'text-teal-600',
          subtext: `Current wind speed is measured at ${current.windSpeed} km/h.`,
        };
      case 'pleasant':
      default:
        return {
          icon: Smile,
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          containerBg: 'bg-emerald-50/70 border-emerald-200/80',
          textColor: 'text-emerald-950',
          accentColor: 'text-emerald-600',
          subtext: `Mild conditions with ${current.temp}°C and light wind of ${current.windSpeed} km/h.`,
        };
    }
  };

  const currentTheme = getRecommendationTheme(recommendation.type);
  const PrimaryIcon = currentTheme.icon;

  return (
    <div
      id="smart-recommendations-card"
      className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 h-full flex flex-col justify-between flex-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Smart Planning Recommendations
          </h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Activity Intelligence
        </span>
      </div>

      {/* Primary Hero Recommendation */}
      <div
        id="primary-recommendation-box"
        className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentTheme.containerBg}`}
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl bg-white shadow-xs ${currentTheme.accentColor}`}>
            <PrimaryIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                id="recommendation-badge"
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${currentTheme.badgeBg}`}
              >
                {recommendation.badge}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                City Forecast Rule
              </span>
            </div>
            <p
              id="recommendation-message-text"
              className={`text-base font-bold tracking-tight ${currentTheme.textColor}`}
            >
              {recommendation.message}
            </p>
            <p className="text-xs text-slate-600 font-medium">
              {currentTheme.subtext}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Planning Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">
            Peak High This Week
          </span>
          <p className="text-sm font-bold text-slate-800">
            {Math.max(...daily.map((d) => d.maxTemp))}°C
          </p>
          <p className="text-slate-500 text-[11px]">
            {daily.find((d) => d.maxTemp === Math.max(...daily.map((x) => x.maxTemp)))?.displayDay || 'This week'}
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">
            Total Weekly Precipitation
          </span>
          <p className="text-sm font-bold text-slate-800">
            {daily.reduce((acc, d) => acc + d.precipitation, 0).toFixed(1)} mm
          </p>
          <p className="text-slate-500 text-[11px]">
            {daily.filter((d) => d.precipitation > 0).length} rainy day(s) forecasted
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">
            Best Outdoor Window
          </span>
          <p className="text-sm font-bold text-emerald-700">
            {daily.find((d) => d.precipitation === 0 && d.maxTemp <= 28)?.displayDay || 'Daily Openings'}
          </p>
          <p className="text-slate-500 text-[11px]">
            Lowest rain probability & comfortable temp
          </p>
        </div>
      </div>
    </div>
  );
};
