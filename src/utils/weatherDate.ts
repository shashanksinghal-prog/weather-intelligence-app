/**
 * SINGLE SOURCE OF TRUTH FOR WEATHER DATE CALCULATIONS & FORMATTING
 * 
 * Critical mandate:
 * 1. Exactly ONE place in the codebase that calculates and formats dates for the displayed city.
 * 2. The single source of truth for the city's current date is daily.time[0] from Open-Meteo.
 * 3. Never use new Date() or the device local timezone to determine or display today's weather date.
 * 4. Dates are parsed via UTC calendar anchors (YYYY, MM, DD) to avoid any browser timezone skew.
 */

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

export interface FormattedDateResult {
  rawDate: string;        // "YYYY-MM-DD" e.g. "2026-09-08"
  isToday: boolean;        // true strictly if rawDate === cityTodayDate
  displayDay: string;     // "Today" if today, otherwise e.g. "Tue"
  weekdayShort: string;   // e.g. "Tue"
  weekdayLong: string;    // e.g. "Tuesday"
  monthDay: string;       // e.g. "Sep 8"
  formattedFull: string;  // e.g. "Tuesday, Sep 8, 2026"
  chartLabel: string;     // e.g. "Today" or "Tue 8"
}

/**
 * Extracts the single source of truth for the city's current date from the Forecast API daily.time array.
 */
export function getCityTodayDate(dailyTimes: string[]): string {
  if (!dailyTimes || dailyTimes.length === 0) {
    throw new Error('Forecast API did not return daily.time array');
  }
  return dailyTimes[0];
}

/**
 * The ONLY function in the codebase that parses and formats a weather date for display.
 * Every component (Current Weather card, 7-Day Forecast cards, Chart labels) uses the output of this function.
 * 
 * @param dateStr "YYYY-MM-DD" string from Open-Meteo
 * @param cityTodayDate "YYYY-MM-DD" string representing today in that city (daily.time[0])
 */
export function formatWeatherCalendarDate(dateStr: string, cityTodayDate: string): FormattedDateResult {
  if (!dateStr) {
    return {
      rawDate: '',
      isToday: false,
      displayDay: 'Unknown',
      weekdayShort: '---',
      weekdayLong: '---',
      monthDay: '---',
      formattedFull: '---',
      chartLabel: '---',
    };
  }

  // Parse YYYY-MM-DD without device timezone influence
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  // Use Date.UTC so the day of week and month match the city calendar date precisely
  const utcDate = new Date(Date.UTC(year, month, day));
  const dayOfWeekIndex = utcDate.getUTCDay();

  const isToday = dateStr === cityTodayDate;
  const weekdayShort = WEEKDAY_NAMES_SHORT[dayOfWeekIndex] || '';
  const weekdayLong = WEEKDAY_NAMES_LONG[dayOfWeekIndex] || '';
  const monthName = MONTH_NAMES_SHORT[month] || '';

  const displayDay = isToday ? 'Today' : weekdayShort;
  const monthDay = `${monthName} ${day}`;
  const formattedFull = `${weekdayLong}, ${monthName} ${day}, ${year}`;
  const chartLabel = isToday ? 'Today' : `${weekdayShort} ${day}`;

  return {
    rawDate: dateStr,
    isToday,
    displayDay,
    weekdayShort,
    weekdayLong,
    monthDay,
    formattedFull,
    chartLabel,
  };
}
