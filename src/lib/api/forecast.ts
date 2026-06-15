import { ForecastResponse } from '@/lib/types/forecast.types';
import { requireApiKey } from './env';

export default async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${requireApiKey()}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch forecast: ${res.status} ${res.statusText}`
    );
  }

  return (await res.json()) as ForecastResponse;
}
