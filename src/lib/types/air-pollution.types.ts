import type { Coord } from './weather.types';

export type { Coord };

// ---------------------------------------------------------------------------
// Air Quality Index
// ---------------------------------------------------------------------------

/**
 * Air Quality Index (AQI) scale used by OpenWeatherMap.
 * Based on the European Environment Agency (EEA) standard.
 *
 * | Value | Qualitative name |
 * |-------|-----------------|
 * |   1   | Good            |
 * |   2   | Fair            |
 * |   3   | Moderate        |
 * |   4   | Poor            |
 * |   5   | Very Poor       |
 */
export type AQILevel = 1 | 2 | 3 | 4 | 5;

/**
 * AQI wrapper object inside each pollution list entry.
 */
export interface AirQualityMain {
  /** Air Quality Index (1 = Good … 5 = Very Poor) */
  aqi: AQILevel;
}

// ---------------------------------------------------------------------------
// Pollutant components
// ---------------------------------------------------------------------------

/**
 * Concentrations of individual atmospheric pollutants.
 * All values are in micrograms per cubic metre (μg/m³).
 */
export interface AirComponents {
  /** Carbon monoxide (CO) — μg/m³ */
  co: number;
  /** Nitrogen monoxide (NO) — μg/m³ */
  no: number;
  /** Nitrogen dioxide (NO₂) — μg/m³ */
  no2: number;
  /** Ozone (O₃) — μg/m³ */
  o3: number;
  /** Sulphur dioxide (SO₂) — μg/m³ */
  so2: number;
  /** Fine particulate matter (PM2.5, diameter < 2.5 μm) — μg/m³ */
  pm2_5: number;
  /** Coarse particulate matter (PM10, diameter < 10 μm) — μg/m³ */
  pm10: number;
  /** Ammonia (NH₃) — μg/m³ */
  nh3: number;
}

// ---------------------------------------------------------------------------
// List entry & full response
// ---------------------------------------------------------------------------

/**
 * A single air pollution measurement entry.
 * The `/air_pollution` endpoint returns one entry; the `/air_pollution/history`
 * and `/air_pollution/forecast` endpoints return multiple entries in the list.
 */
export interface AirPollutionEntry {
  /** Air Quality Index data */
  main: AirQualityMain;
  /** Individual pollutant concentrations */
  components: AirComponents;
  /** Measurement time as a Unix UTC timestamp */
  dt: number;
}

/**
 * Full response from the OpenWeatherMap Air Pollution API.
 * Covers current (`/air_pollution`), forecast (`/air_pollution/forecast`),
 * and historical (`/air_pollution/history`) endpoints — all share this shape.
 *
 * @see https://openweathermap.org/api/air-pollution
 */
export interface AirPollutionResponse {
  /** Geographic coordinates of the queried location */
  coord: Coord;
  /**
   * Array of pollution entries.
   * - Current: always 1 entry.
   * - Forecast: up to 96 entries (4 days × 24 hours).
   * - History: varies based on the requested time range.
   */
  list: AirPollutionEntry[];
}

// ---------------------------------------------------------------------------
// Utility: human-readable AQI label
// ---------------------------------------------------------------------------

/**
 * Maps an AQI level to its qualitative label.
 *
 * @example
 * const label = AQI_LABELS[data.list[0].main.aqi]; // "Good"
 */
export const AQI_LABELS: Record<AQILevel, string> = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor',
} as const;
