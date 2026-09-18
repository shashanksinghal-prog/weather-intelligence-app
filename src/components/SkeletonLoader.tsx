import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div id="weather-skeleton-loader" className="space-y-6 animate-pulse">
      {/* Current weather card skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-32 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-36 bg-slate-100 rounded-md" />
        </div>

        <div className="flex items-center gap-6 py-4">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-12 w-28 bg-slate-200 rounded-lg" />
            <div className="h-5 w-40 bg-slate-100 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="col-span-2 sm:col-span-1 h-14 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Recommendations skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="h-5 w-48 bg-slate-200 rounded-md" />
        <div className="h-20 bg-slate-100 rounded-xl" />
      </div>

      {/* 7-Day Forecast skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-36 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-44 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="h-4 w-14 bg-slate-200 rounded" />
              <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto" />
              <div className="h-3 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 w-44 bg-slate-200 rounded-md" />
        <div className="h-48 bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
};
