import { ForecastResponse } from '@/lib/types/forecast.types';

export default async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch forecast: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<ForecastResponse>;
}
