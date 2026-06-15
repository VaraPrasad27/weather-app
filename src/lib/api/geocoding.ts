import type { GeocodingResponse } from '@/lib/types/geocoding.types';

export default async function fetchGeocode(
  location_name: string,
  limit: number
): Promise<GeocodingResponse> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location_name}&limit=${limit}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const res = await fetch(url, {});

  if (!res.ok) {
    throw new Error(
      `Failed to fetch location: ${res.status} ${res.statusText}`
    );
  }

  return (await res.json()) as GeocodingResponse;
}
