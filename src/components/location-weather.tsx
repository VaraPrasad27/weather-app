'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import type { ForecastResponse } from '@/lib/types/forecast.types';
import type {
  AirPollutionResponse,
  AQILevel,
} from '@/lib/types/air-pollution.types';
import CurrentWeatherCard from './current-weather-card';
import MetricsGrid from './metrics-grid';
import SunCard from './sun-card';
import WindCard from './wind-card';
import ForecastStrip from './forecast-strip';
import AirQualityCard from './air-quality-card';

type Coords = { lat: number; lon: number };

/**
 * We never actually fetch for these "empty" coordinates — they exist only
 * so we can compare against `loadedCoords` to detect first-load.
 */
const EMPTY_COORDS: Coords = { lat: NaN, lon: NaN };

export default function LocationWeather({
  lat: latProp,
  lon: lonProp,
}: {
  lat?: number | string;
  lon?: number | string;
}) {
  const [data, setData] = useState<CurrentWeatherResponse>();
  const [forecast, setForecast] = useState<ForecastResponse>();
  const [air, setAir] = useState<AirPollutionResponse>();
  const [loadedCoords, setLoadedCoords] = useState<Coords>(EMPTY_COORDS);
  const [error, setError] = useState<string>();

  const propCoords = useMemo<Coords | null>(() => {
    if (latProp == null || lonProp == null) return null;
    const lat = Number(latProp);
    const lon = Number(lonProp);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
  }, [latProp, lonProp]);

  const propCoordsInvalid =
    (latProp != null || lonProp != null) && propCoords == null;

  const geolocationAvailable = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return 'geolocation' in navigator;
  }, []);

  // Effect: fetch when prop coordinates are valid.
  useEffect(() => {
    if (!propCoords) return;
    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      try {
        const result = await fetchAll(propCoords, controller.signal);
        if (cancelled) return;
        setData(result.weather);
        setForecast(result.forecast);
        setAir(result.air);
        setLoadedCoords(propCoords);
      } catch (e) {
        if (cancelled) return;
        setError(errMessage(e));
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [propCoords]);

  // Effect: geolocation fallback.
  useEffect(() => {
    if (propCoords) return;
    if (!geolocationAvailable) return; // Surface the error in render instead.

    const controller = new AbortController();
    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      position => {
        if (cancelled) return;
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        void (async () => {
          try {
            const result = await fetchAll(coords, controller.signal);
            if (cancelled) return;
            setData(result.weather);
            setForecast(result.forecast);
            setAir(result.air);
            setLoadedCoords(coords);
          } catch (e) {
            if (cancelled) return;
            setError(errMessage(e));
          }
        })();
      },
      geoErr => {
        if (cancelled) return;
        setError(geoErr.message);
      },
      { timeout: 10_000 }
    );

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [propCoords, geolocationAvailable]);

  // ---- Render-time decision tree ----

  if (propCoordsInvalid) {
    return (
      <StatusPanel
        title="Invalid coordinates"
        subtitle="The location URL did not contain valid latitude and longitude."
        tone="error"
      />
    );
  }

  if (!propCoords && !geolocationAvailable) {
    return (
      <StatusPanel
        title="Geolocation unavailable"
        subtitle="Search for a city above to see its weather."
        tone="error"
      />
    );
  }

  if (error) {
    return (
      <StatusPanel title="Something went wrong" subtitle={error} tone="error" />
    );
  }

  // First-load UX: no data, no error.
  if (!data) {
    if (!propCoords && geolocationAvailable) {
      return (
        <StatusPanel
          title="Locating you…"
          subtitle="Allow location access to see local weather."
        />
      );
    }
    return <DashboardSkeleton />;
  }

  // If the loaded data is for different coordinates than what we should
  // be showing, show a skeleton during the transition.
  if (propCoords && !coordsEqual(loadedCoords, propCoords)) {
    return <DashboardSkeleton />;
  }

  const aqi: AQILevel | undefined = air?.list?.[0]?.main.aqi;

  return (
    <div className="grid gap-6">
      <CurrentWeatherCard data={data} />

      <div className="grid gap-6 md:grid-cols-3">
        <MetricsGrid data={data} />
        <WindCard data={data} />
        <SunCard data={data} />
      </div>

      {forecast && <ForecastStrip forecast={forecast} />}

      {air && aqi && <AirQualityCard air={air} aqi={aqi} />}
    </div>
  );
}

function coordsEqual(a: Coords, b: Coords): boolean {
  return a.lat === b.lat && a.lon === b.lon;
}

async function fetchAll(
  coords: Coords,
  signal: AbortSignal
): Promise<{
  weather: CurrentWeatherResponse;
  forecast: ForecastResponse | undefined;
  air: AirPollutionResponse | undefined;
}> {
  const [weatherRes, forecastRes, airRes] = await Promise.all([
    fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`, {
      cache: 'no-store',
      signal,
    }),
    fetch(`/api/forecast?lat=${coords.lat}&lon=${coords.lon}`, {
      cache: 'no-store',
      signal,
    }),
    fetch(`/api/air-pollution?lat=${coords.lat}&lon=${coords.lon}`, {
      cache: 'no-store',
      signal,
    }).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Server responded with ${weatherRes.status}`);
  }
  const weather = (await weatherRes.json()) as CurrentWeatherResponse;

  const forecast = forecastRes.ok
    ? ((await forecastRes.json()) as ForecastResponse)
    : undefined;
  const air =
    airRes && airRes.ok
      ? ((await airRes.json()) as AirPollutionResponse)
      : undefined;

  return { weather, forecast, air };
}

function errMessage(e: unknown): string {
  if (e instanceof Error) return `Failed to fetch weather: ${e.message}`;
  return `Failed to fetch weather: ${String(e)}`;
}

function StatusPanel({
  title,
  subtitle,
  tone = 'info',
}: {
  title: string;
  subtitle?: string;
  tone?: 'info' | 'error';
}) {
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        tone === 'error'
          ? 'border-red-500/30 bg-red-500/5 text-red-300'
          : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)]'
      }`}
    >
      <p className="text-lg font-semibold">{title}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="skeleton h-48 w-full rounded-2xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="skeleton h-56 rounded-2xl" />
        <div className="skeleton h-56 rounded-2xl" />
        <div className="skeleton h-56 rounded-2xl" />
      </div>
    </div>
  );
}
