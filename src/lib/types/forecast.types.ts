import type {
  Coord,
  WeatherCondition,
  Clouds,
  Wind,
  Precipitation,
} from './weather.types';

/**
 * Re-export shared types from the current weather module
 * so consumers can import everything from one place if needed.
 */
export type { Coord, WeatherCondition, Clouds, Wind, Precipitation };

// ---------------------------------------------------------------------------
// Forecast-specific extensions
// ---------------------------------------------------------------------------

/**
 * Main atmospheric measurements for a forecast slot.
 * Extends the current weather `main` block with `temp_kf` — an internal
 * OpenWeatherMap correction factor applied during interpolation.
 */
export interface ForecastMain {
  /** Temperature in Kelvin (default) */
  temp: number;
  /** Human-perceived temperature in Kelvin */
  feels_like: number;
  /** Minimum temperature in Kelvin for this 3-hour slot */
  temp_min: number;
  /** Maximum temperature in Kelvin for this 3-hour slot */
  temp_max: number;
  /** Atmospheric pressure at sea level (hPa) */
  pressure: number;
  /** Atmospheric pressure at sea level (hPa) */
  sea_level: number;
  /** Atmospheric pressure at ground level (hPa) */
  grnd_level: number;
  /** Humidity percentage (0–100) */
  humidity: number;
  /**
   * Internal temperature correction factor used by OWM during interpolation.
   * Not meaningful for display; safe to ignore.
   */
  temp_kf: number;
}

/**
 * Part-of-day indicator within a forecast slot's `sys` block.
 * "d" = daytime, "n" = night-time — useful for choosing day/night icons.
 */
export interface ForecastSys {
  /** Part of day: "d" (day) or "n" (night) */
  pod: 'd' | 'n';
}

/**
 * A single 3-hour forecast entry within the `list` array.
 */
export interface ForecastEntry {
  /** Forecast time as a Unix UTC timestamp */
  dt: number;
  /** Atmospheric measurements for this slot */
  main: ForecastMain;
  /** Weather condition(s) — usually one entry */
  weather: WeatherCondition[];
  /** Cloud coverage */
  clouds: Clouds;
  /** Wind data */
  wind: Wind;
  /** Visibility in metres (max 10,000) */
  visibility: number;
  /**
   * Probability of precipitation (0–1).
   * E.g., 0.97 means 97% chance of rain during this 3-hour window.
   */
  pop: number;
  /** Rain volume for the 3-hour window (optional — only present when raining) */
  rain?: Precipitation;
  /** Snow volume for the 3-hour window (optional — only present when snowing) */
  snow?: Precipitation;
  /** Part-of-day metadata */
  sys: ForecastSys;
  /** Human-readable UTC datetime string: "YYYY-MM-DD HH:MM:SS" */
  dt_txt: string;
}

/**
 * City metadata returned alongside the forecast list.
 */
export interface ForecastCity {
  /** City ID in OpenWeatherMap's database */
  id: number;
  /** City name */
  name: string;
  /** Geographic coordinates */
  coord: Coord;
  /** ISO 3166-1 alpha-2 country code */
  country: string;
  /** City population */
  population: number;
  /** Timezone offset from UTC in seconds (e.g., 19800 = UTC+5:30) */
  timezone: number;
  /** Sunrise time as a Unix UTC timestamp */
  sunrise: number;
  /** Sunset time as a Unix UTC timestamp */
  sunset: number;
}

/**
 * Full response from the OpenWeatherMap 5-day / 3-hour Forecast API.
 * Returns up to 40 entries (5 days × 8 slots per day).
 * @see https://openweathermap.org/forecast5
 */
export interface ForecastResponse {
  /**
   * Response status code as a string.
   * "200" = success. Note: this is a string, unlike `cod: number` in
   * the current weather response — a known OWM API inconsistency.
   */
  cod: string;
  /** Internal OWM parameter — always 0 on success */
  message: number;
  /** Number of forecast entries returned (max 40) */
  cnt: number;
  /** Array of 3-hour forecast slots */
  list: ForecastEntry[];
  /** Metadata about the queried city */
  city: ForecastCity;
}
