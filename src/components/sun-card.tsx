import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import Card from './card';

export default function SunCard({ data }: { data: CurrentWeatherResponse }) {
  const sunrise = formatTime(data.sys.sunrise, data.timezone);
  const sunset = formatTime(data.sys.sunset, data.timezone);
  const daylight = computeDaylight(data.sys.sunrise, data.sys.sunset);

  return (
    <Card title="Sun">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-[var(--color-muted)]">Sunrise</p>
          <p className="mt-0.5 font-mono text-base">{sunrise}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">Sunset</p>
          <p className="mt-0.5 font-mono text-base">{sunset}</p>
        </div>
        <div className="col-span-2 mt-2">
          <DaylightBar
            sunrise={data.sys.sunrise}
            sunset={data.sys.sunset}
            now={data.dt}
          />
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Daylight: {daylight}
          </p>
        </div>
      </div>
    </Card>
  );
}

function DaylightBar({
  sunrise,
  sunset,
  now,
}: {
  sunrise: number;
  sunset: number;
  now: number;
}) {
  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(total, now - sunrise));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-brand-400)] to-amber-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function formatTime(unix: number, timezoneOffsetSeconds: number): string {
  const localMillis = (unix + timezoneOffsetSeconds) * 1000;
  return new Date(localMillis).toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function computeDaylight(sunrise: number, sunset: number): string {
  const seconds = sunset - sunrise;
  if (seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
