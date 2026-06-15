import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import { requireApiKey } from './env';

export default async function fetchWeather(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${requireApiKey()}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as CurrentWeatherResponse;
}
