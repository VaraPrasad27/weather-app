/**
 * Throws if the OpenWeatherMap API key is not configured. Should be called
 * by every fetcher before constructing a request URL, so that a missing key
 * produces a clear, immediate error rather than an opaque "appid=undefined"
 * 401 from the upstream service.
 */
export function requireApiKey(): string {
  const key = process.env.OPEN_WEATHER_API_KEY;
  if (!key) {
    throw new Error(
      'OPEN_WEATHER_API_KEY is not configured. Set it in your .env file.'
    );
  }
  return key;
}
