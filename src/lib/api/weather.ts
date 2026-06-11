import type { CurrentWeatherResponse } from '@/lib/types/weather.types';

export default async function fetchWeather(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<CurrentWeatherResponse>;
}
