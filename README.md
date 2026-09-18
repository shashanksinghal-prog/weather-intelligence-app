# Weather Intelligence Dashboard

A production-ready, responsive single-page Weather Intelligence application built with **React**, **Vite**, and **Tailwind CSS**. The application integrates public Open-Meteo APIs to deliver real-time weather analytics, multi-timezone date accuracy, dynamic 7-day temperature trends, and actionable activity recommendations without requiring any API keys.

---

## Features

- **Keyless Public API Integration**:
  - Uses Open-Meteo Geocoding API for global city search and coordinate extraction.
  - Uses Open-Meteo Forecast API for current weather and 7-day daily forecasts.
- **Strict Multi-Timezone Date Correctness**:
  - Employs a single source of truth (`daily.time[0]`) from Open-Meteo for the displayed city's current calendar date.
  - Guarantees identical date synchronization across the Current Weather card, 7-Day Forecast cards, and Temperature Trend Chart, preventing timezone skew between the user's device and distant locations (e.g., Tokyo, Sydney).
  - Determines day and night states strictly from Open-Meteo's `is_day` parameter (`1 = day`, `0 = night`).
- **Comprehensive Current Weather**:
  - Real-time temperature (°C and °F support), WMO condition descriptions with dynamic icons, wind speed (km/h), wind direction, and precipitation totals.
- **7-Day Forecast Cards**:
  - Daily high/low temperatures with visual temperature range bars, WMO weather condition icons, and precipitation summaries.
- **Dynamic 7-Day Temperature Trend Chart**:
  - Interactive SVG dual-curve chart illustrating 7-day high and low temperature trajectories.
  - Precipitation volume bars with interactive hover and click inspection for each day.
- **Smart Planning & Activity Recommendations**:
  - Conditional travel and activity tips based on forecast thresholds:
    - *Precipitation > 5mm or rain weathercode*: "Rain expected—pack an umbrella!"
    - *Max temperature > 30°C*: "Hot weather ahead—stay hydrated and wear sunscreen."
    - *Wind speed > 25 km/h*: "Breezy conditions—secure loose outdoor items."
    - *Otherwise*: "Pleasant weather—great for outdoor activities!"
  - Additional weekly planning insights (peak temperature, total rainfall, optimal outdoor windows).
- **Graceful Error Handling & Fallbacks**:
  - Inline alerts for non-existent cities ("City not found. Please check spelling and try again.").
  - Network error fallback screens with interactive retry actions.
  - Polished skeleton loaders during asynchronous data fetching.
- **Cloudflare Pages Deployment Ready**:
  - Includes `public/_redirects` rule (`/* /index.html 200`) for seamless client-side SPA routing without 404s upon page reload.

---

## Local Setup Instructions

### Prerequisites
- Node.js 18+ and npm installed on your machine.

### Installation & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   This compiles the optimized static assets into the `dist/` folder.

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## GitHub & Cloudflare Pages Deployment

This application is connected directly to GitHub from **Google AI Studio** and configured for automated deployment on **Cloudflare Pages**:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Root Directory**: `/`
- **SPA Routing**: Handled automatically via `public/_redirects` (`/* /index.html 200`) to guarantee error-free URL refreshes and client-side navigation.
- **Environment Variables**: None required! The application connects to unauthenticated, public Open-Meteo endpoints.
