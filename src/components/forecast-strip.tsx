import type {
  ForecastEntry,
  ForecastResponse,
} from '@/lib/types/forecast.types';
import Card from './card';
import WeatherIcon from './weather-icon';

export default function ForecastStrip({
  forecast,
}: {
  forecast: ForecastResponse;
}) {
  const days = groupByDay(forecast.list, forecast.city.timezone);

  return (
    <Card title="5-day forecast" subtitle="3-hour slots grouped by day">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {days.map(day => (
          <li
            key={day.dateLabel}
            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface-3)]/50 p-4 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              {day.dateLabel}
            </p>
            <WeatherIcon
              condition={day.representative.weather[0]}
              className="h-9 w-9 text-[var(--color-brand-400)]"
            />
            <p className="line-clamp-1 text-xs capitalize text-[var(--color-muted)]">
              {day.representative.weather[0]?.description}
            </p>
            <p className="font-mono text-sm">
              <span className="font-semibold text-[var(--color-text)]">
                {Math.round(day.max)}°
              </span>
              <span className="ml-1 text-[var(--color-muted)]">
                {Math.round(day.min)}°
              </span>
            </p>
            <p className="text-[10px] text-[var(--color-brand-200)]">
              {Math.round(day.maxPop * 100)}% rain
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

type DaySummary = {
  dateLabel: string;
  min: number;
  max: number;
  maxPop: number;
  representative: ForecastEntry;
};

function groupByDay(
  list: ForecastEntry[],
  timezoneOffsetSeconds: number
): DaySummary[] {
  const days: Record<string, DaySummary> = {};

  for (const entry of list) {
    const localDate = new Date((entry.dt + timezoneOffsetSeconds) * 1000);
    // Anchor to local "noon" so the day key matches the local date
    const key = localDate.toISOString().slice(0, 10);
    const label = localDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (!days[key]) {
      days[key] = {
        dateLabel: label,
        min: entry.main.temp,
        max: entry.main.temp,
        maxPop: entry.pop,
        representative: entry,
      };
    }

    const day = days[key];
    day.min = Math.min(day.min, entry.main.temp);
    day.max = Math.max(day.max, entry.main.temp);
    day.maxPop = Math.max(day.maxPop, entry.pop);

    // Prefer the entry closest to 12:00 local time as the day's icon source.
    const hour = localDate.getUTCHours();
    const currentHour = new Date(
      (day.representative.dt + timezoneOffsetSeconds) * 1000
    ).getUTCHours();
    if (Math.abs(hour - 12) < Math.abs(currentHour - 12)) {
      day.representative = entry;
    }
  }

  return Object.values(days).slice(0, 5);
}
