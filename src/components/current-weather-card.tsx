import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import WeatherIcon from './weather-icon';

export default function CurrentWeatherCard({
  data,
}: {
  data: CurrentWeatherResponse;
}) {
  const condition = data.weather[0];
  const localTime = formatLocalTime(data.dt, data.timezone);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface-3)] p-6 shadow-xl shadow-black/30 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-muted)]">{localTime}</p>
          <h2 className="mt-1 truncate text-3xl font-semibold sm:text-4xl">
            {data.name}
            <span className="ml-2 text-base font-normal text-[var(--color-muted)]">
              {data.sys.country}
            </span>
          </h2>
          <p className="mt-1 text-sm capitalize text-[var(--color-muted)]">
            {condition?.description}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <WeatherIcon
            condition={condition}
            className="h-16 w-16 text-[var(--color-brand-400)]"
          />
          <div className="text-right">
            <p className="font-mono text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
              {Math.round(data.main.temp)}°
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Feels like {Math.round(data.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatLocalTime(unix: number, timezoneOffsetSeconds: number): string {
  // OpenWeatherMap returns `dt` in UTC seconds. The location's local time is
  // (dt + timezoneOffsetSeconds) in epoch-seconds. Using UTC rendering options
  // yields a stable local time regardless of the viewer's clock.
  const localMillis = (unix + timezoneOffsetSeconds) * 1000;
  return new Date(localMillis).toLocaleString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
