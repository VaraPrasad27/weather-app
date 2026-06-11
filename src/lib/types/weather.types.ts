/**
 * Geographic coordinates of the location.
 */
export interface Coord {
  /** Longitude */
  lon: number;
  /** Latitude */
  lat: number;
}

/**
 * A single weather condition entry.
 * The `weather` array can contain multiple conditions (e.g., rain + mist).
 */
export interface WeatherCondition {
  /** Weather condition ID (OpenWeatherMap internal code) */
  id: number;
  /** Group of weather parameters (e.g., "Rain", "Snow", "Clouds") */
  main: string;
  /** Human-readable description (e.g., "overcast clouds") */
  description: string;
  /** Icon code — use with https://openweathermap.org/img/wn/{icon}@2x.png */
  icon: string;
}

/**
 * Main atmospheric measurements.
 * All temperatures are in Kelvin by default (use `units` param to change).
 */
export interface MainWeather {
  /** Current temperature */
  temp: number;
  /** Human-perceived temperature */
  feels_like: number;
  /** Minimum observed temperature (within large cities/metro areas) */
  temp_min: number;
  /** Maximum observed temperature (within large cities/metro areas) */
  temp_max: number;
  /** Atmospheric pressure at sea level (hPa) */
  pressure: number;
  /** Humidity percentage (0–100) */
  humidity: number;
  /** Atmospheric pressure at sea level (hPa) — may equal `pressure` */
  sea_level?: number;
  /** Atmospheric pressure at ground level (hPa) */
  grnd_level?: number;
}

/**
 * Wind data.
 */
export interface Wind {
  /** Wind speed (m/s by default) */
  speed: number;
  /** Wind direction in meteorological degrees (0–360) */
  deg: number;
  /** Wind gust speed (m/s) — optional, not always present */
  gust?: number;
}

/**
 * Cloud coverage data.
 */
export interface Clouds {
  /** Cloudiness percentage (0–100) */
  all: number;
}

/**
 * Precipitation volume data (optional — only present when it's raining/snowing).
 */
export interface Precipitation {
  /** Volume for the last 1 hour (mm) */
  '1h'?: number;
  /** Volume for the last 3 hours (mm) */
  '3h'?: number;
}

/**
 * System metadata about the location (country, sunrise/sunset).
 */
export interface Sys {
  /** Internal OWM parameter — can be ignored */
  type?: number;
  /** Internal OWM ID — can be ignored */
  id?: number;
  /** ISO 3166-1 alpha-2 country code (e.g., "IN") */
  country: string;
  /** Sunrise time as a Unix UTC timestamp */
  sunrise: number;
  /** Sunset time as a Unix UTC timestamp */
  sunset: number;
}

/**
 * Full response from the OpenWeatherMap Current Weather API.
 * @see https://openweathermap.org/current
 */
export interface CurrentWeatherResponse {
  /** Geographic coordinates of the location */
  coord: Coord;
  /** Array of weather condition objects (usually one, sometimes more) */
  weather: WeatherCondition[];
  /** Internal parameter — data source (e.g., "stations") */
  base: string;
  /** Main atmospheric measurements */
  main: MainWeather;
  /** Visibility in metres (max 10,000) */
  visibility: number;
  /** Wind data */
  wind: Wind;
  /** Cloud coverage */
  clouds: Clouds;
  /** Rain volume (optional — only present when raining) */
  rain?: Precipitation;
  /** Snow volume (optional — only present when snowing) */
  snow?: Precipitation;
  /** Time of data calculation as a Unix UTC timestamp */
  dt: number;
  /** System metadata (country, sunrise, sunset) */
  sys: Sys;
  /** Timezone offset from UTC in seconds (e.g., 19800 = UTC+5:30) */
  timezone: number;
  /** City ID in OpenWeatherMap's database */
  id: number;
  /** City name */
  name: string;
  /** HTTP status code of the response (200 = success) */
  cod: number;
}
