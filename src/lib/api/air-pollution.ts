import { AirPollutionResponse } from '@/lib/types/air-pollution.types';

export default async function fetchAirPollution(
  lat: number,
  lon: number
): Promise<AirPollutionResponse> {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch air pollution: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<AirPollutionResponse>;
}
