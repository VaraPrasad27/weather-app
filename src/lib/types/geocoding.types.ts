/**
 * Maps ISO 639-1 language codes to localized city name strings.
 * Keys are two-letter language codes (e.g., "en", "hi", "ja").
 * This type is intentionally flexible since the API can return
 * any language depending on available translations.
 */
export type LocalNames = {
  [languageCode: string]: string;
};

/**
 * Represents a single geocoding result from the OpenWeatherMap Geocoding API.
 * `local_names` is optional because some results (e.g., smaller localities)
 * may not include localized name data.
 */
export interface GeocodingResult {
  /** The primary name of the location (usually in the local language or English) */
  name: string;

  /** Localized names keyed by ISO 639-1 language code */
  local_names?: LocalNames;

  /** Latitude coordinate */
  lat: number;

  /** Longitude coordinate */
  lon: number;

  /** ISO 3166-1 alpha-2 country code (e.g., "IN", "PK") */
  country: string;

  /** State or province name */
  state: string;
}

/**
 * The full response from the Geocoding API endpoint.
 * Returns an array of matching locations — can be empty if no results found.
 */
export type GeocodingResponse = GeocodingResult[];
