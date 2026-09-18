import React, { useState, useRef, useEffect } from 'react';
import { FormattedDayForecast } from '../types/weather';
import { Droplets, ArrowUp, ArrowDown } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

interface WeatherChartProps {
  daily: FormattedDayForecast[];
  tempUnit?: 'C' | 'F';
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  daily,
  tempUnit = 'C',
  selectedIndex = 0,
  onSelectIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ResizeObserver for responsive SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50) {
          setWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const displayTemp = (tempC: number) => {
    if (tempUnit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeDay = daily[activeIndex] || daily[0];

  const height = 220;
  const paddingX = 40;
  const paddingTop = 32;
  const paddingBottom = 48;

  const chartWidth = Math.max(280, width);
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  // Temperature ranges
  const maxTemps = daily.map((d) => displayTemp(d.maxTemp));
  const minTemps = daily.map((d) => displayTemp(d.minTemp));
  const precipValues = daily.map((d) => d.precipitation);

  const highestTemp = Math.max(...maxTemps);
  const lowestTemp = Math.min(...minTemps);
  const tempRange = Math.max(4, highestTemp - lowestTemp + 4); // buffer of 2 on top & bottom
  const maxPrecip = Math.max(1, ...precipValues);

  // Helper coordinate mapper
  const getX = (index: number) => {
    if (daily.length <= 1) return paddingX;
    return paddingX + (index / (daily.length - 1)) * innerWidth;
  };

  const getY = (tempVal: number) => {
    const fraction = (tempVal - (lowestTemp - 2)) / tempRange;
    return paddingTop + innerHeight - fraction * innerHeight;
  };

  // Generate SVG path points
  const highPoints = daily.map((d, i) => ({
    x: getX(i),
    y: getY(displayTemp(d.maxTemp)),
    temp: displayTemp(d.maxTemp),
  }));

  const lowPoints = daily.map((d, i) => ({
    x: getX(i),
    y: getY(displayTemp(d.minTemp)),
    temp: displayTemp(d.minTemp),
  }));

  // Build smooth path line
  const createPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, '');
  };

  const highLinePath = createPath(highPoints);
  const lowLinePath = createPath(lowPoints);

  // Shaded area path between high and low lines
  const areaPath = `${highLinePath} L ${lowPoints[lowPoints.length - 1].x} ${lowPoints[lowPoints.length - 1].y} ${createPath(
    [...lowPoints].reverse()
  ).replace(/^M/, 'L')} Z`;

  return (
    <div
      id="weather-trend-card"
      ref={containerRef}
      className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
    >
      {/* Card Header with Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            7-Day Temperature Trend
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Daily high and low progression with precipitation indicators
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600">High Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600">Low Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2.5 rounded-xs bg-blue-300" />
            <span className="text-slate-600">Rain (mm)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          id="trend-chart-svg"
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="overflow-visible"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.04" />
            </linearGradient>

            {/* High line gradient */}
            <linearGradient id="highLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            {/* Low line gradient */}
            <linearGradient id="lowLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={chartWidth - paddingX}
            y2={paddingTop}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + innerHeight / 2}
            x2={chartWidth - paddingX}
            y2={paddingTop + innerHeight / 2}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + innerHeight}
            x2={chartWidth - paddingX}
            y2={paddingTop + innerHeight}
            stroke="#e2e8f0"
          />

          {/* Precipitation Bars at bottom */}
          {daily.map((d, i) => {
            const x = getX(i);
            const barHeight = d.precipitation > 0 ? Math.max(3, (d.precipitation / maxPrecip) * 24) : 0;
            const barWidth = Math.min(16, innerWidth / 14);
            const isHighlighted = i === activeIndex;

            return (
              <g key={`bar-${i}`}>
                {barHeight > 0 && (
                  <rect
                    x={x - barWidth / 2}
                    y={paddingTop + innerHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx={2}
                    fill={isHighlighted ? '#2563eb' : '#93c5fd'}
                    opacity={isHighlighted ? 0.9 : 0.6}
                  />
                )}
              </g>
            );
          })}

          {/* Area between curves */}
          <path d={areaPath} fill="url(#tempAreaGradient)" />

          {/* High and Low lines */}
          <path
            d={highLinePath}
            fill="none"
            stroke="url(#highLineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <path
            d={lowLinePath}
            fill="none"
            stroke="url(#lowLineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Vertical Active Day Cursor */}
          {activeIndex !== null && (
            <line
              x1={getX(activeIndex)}
              y1={paddingTop - 10}
              x2={getX(activeIndex)}
              y2={paddingTop + innerHeight}
              stroke="#cbd5e1"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )}

          {/* High Points and Labels */}
          {highPoints.map((pt, i) => {
            const isHighlighted = i === activeIndex;
            return (
              <g key={`high-pt-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHighlighted ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#f43f5e"
                  strokeWidth={isHighlighted ? 2.5 : 2}
                />
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isHighlighted ? 'fill-rose-700 font-extrabold' : 'fill-slate-700'
                  }`}
                >
                  {pt.temp}°
                </text>
              </g>
            );
          })}

          {/* Low Points and Labels */}
          {lowPoints.map((pt, i) => {
            const isHighlighted = i === activeIndex;
            return (
              <g key={`low-pt-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHighlighted ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#0ea5e9"
                  strokeWidth={isHighlighted ? 2.5 : 2}
                />
                <text
                  x={pt.x}
                  y={pt.y + 14}
                  textAnchor="middle"
                  className={`text-[11px] font-medium ${
                    isHighlighted ? 'fill-sky-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {pt.temp}°
                </text>
              </g>
            );
          })}

          {/* Bottom Day Labels strictly from single-source date calculation */}
          {daily.map((d, i) => {
            const x = getX(i);
            const isHighlighted = i === activeIndex;

            return (
              <g
                key={`label-${i}`}
                className="cursor-pointer"
                onClick={() => onSelectIndex?.(i)}
              >
                {/* Day label: Today or Day + date */}
                <text
                  x={x}
                  y={height - 22}
                  textAnchor="middle"
                  className={`text-xs select-none transition-all ${
                    isHighlighted
                      ? 'fill-slate-900 font-bold text-[13px]'
                      : d.isToday
                      ? 'fill-sky-600 font-semibold'
                      : 'fill-slate-600 font-medium'
                  }`}
                >
                  {d.displayDay}
                </text>
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] select-none ${
                    isHighlighted ? 'fill-slate-700 font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {d.monthDay}
                </text>
              </g>
            );
          })}

          {/* Transparent Hover Hit Boxes for each day */}
          {daily.map((_, i) => {
            const widthPerSlice = innerWidth / (daily.length - 1);
            const xCenter = getX(i);
            const sliceLeft = i === 0 ? paddingX - 10 : xCenter - widthPerSlice / 2;
            const sliceWidth =
              i === 0 || i === daily.length - 1 ? widthPerSlice / 2 + 10 : widthPerSlice;

            return (
              <rect
                key={`hit-${i}`}
                x={sliceLeft}
                y={0}
                width={sliceWidth}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectIndex?.(i)}
              />
            );
          })}
        </svg>
      </div>

      {/* Selected / Hovered Day Quick Details Strip */}
      {activeDay && (
        <div
          id="chart-active-day-details"
          className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-100 rounded-xl text-xs"
        >
          <div className="flex items-center gap-2.5">
            <WeatherIcon iconName={activeDay.condition.iconName} className="w-5 h-5" />
            <span className="font-semibold text-slate-800">
              {activeDay.displayDay} ({activeDay.formattedFull})
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-600 font-medium">
              {activeDay.condition.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
              <ArrowUp className="w-3 h-3 text-rose-500" />
              High: {displayTemp(activeDay.maxTemp)}°{tempUnit}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-sky-600">
              <ArrowDown className="w-3 h-3 text-sky-500" />
              Low: {displayTemp(activeDay.minTemp)}°{tempUnit}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <Droplets className="w-3 h-3 text-blue-500" />
              {activeDay.precipitation} mm rain
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
