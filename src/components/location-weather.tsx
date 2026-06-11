'use client';

import { useEffect, useState } from 'react';
import { CurrentWeatherResponse } from '@/lib/types/weather.types';

export default function LocationWeather({
  lat: latProp,
  lon: lonProp,
}: {
  lat?: number | string;
  lon?: number | string;
}) {
  const [data, setData] = useState<CurrentWeatherResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const K = 273.15;

  useEffect(() => {
    if (latProp != null && lonProp != null) {
      const controller = new AbortController();
      (async () => {
        try {
          const res = await fetch(
            `/api/weather?lat=${latProp}&lon=${lonProp}`,
            { cache: 'no-store', signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }
          const result = await res.json();
          setData(result);
        } catch (err) {
          if (controller.signal.aborted) {
            return;
          }
          setError(`Failed to fetch weather: ${err}`);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      })();
      return () => controller.abort();
    }

    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
            cache: 'no-store',
          });
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }
          const result = await res.json();
          setData(result);
          setLoading(false);
        } catch (err) {
          setError(`Failed to fetch weather: ${err}`);
        } finally {
          setLoading(false);
        }
      },
      geoErr => {
        setError(geoErr.message);
        setLoading(false);
      }
    );
  }, [latProp, lonProp]);

  if (!('geolocation' in navigator)) {
    return <p>Geolocation is not supported in this browser.</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <p>Name: {data?.name}</p>
      <p>
        Coordinates: {data?.coord.lat}, {data?.coord.lon}
      </p>
      {data && <p>Temp: {data?.main.temp - K} &deg;C </p>}
      {data && <p>Temp feel: {data?.main.feels_like - K} &deg;C</p>}
      <p>Humidity: {data?.main.humidity}</p>
      <p>Pressure: {data?.main.pressure}</p>
      {data && (
        <p>
          min / max temp: {data?.main.temp_min - K} &deg;C /{' '}
          {data?.main.temp_max - K} &deg;C
        </p>
      )}
      <p>GL: {data?.main.grnd_level}</p>
      <p>SL: {data?.main.sea_level}</p>
      <p>Cod: {data?.cod}</p>
      <p>Base: {data?.base}</p>
      <p>Clouds: {data?.clouds.all}</p>
      <p>Dt: {data?.dt}</p>
      <p>id {data?.id}</p>
      <p>Rain: {data?.rain?.['1h']}</p>
      <p>Snow: {data?.snow?.['1h']}</p>
    </div>
  );
}
