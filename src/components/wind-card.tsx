import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import Card from './card';

export default function WindCard({ data }: { data: CurrentWeatherResponse }) {
  const deg = data.wind.deg;
  const direction = formatDirection(deg);

  return (
    <Card title="Wind">
      <div className="flex items-center gap-5">
        <WindCompass deg={deg} />
        <div className="space-y-1 text-sm">
          <p className="font-mono text-2xl font-semibold">
            {data.wind.speed.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">
              m/s
            </span>
          </p>
          <p className="text-[var(--color-muted)]">
            {direction} · {deg}°
          </p>
          {data.wind.gust != null && (
            <p className="text-xs text-[var(--color-muted)]">
              Gusts {data.wind.gust.toFixed(1)} m/s
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function WindCompass({ deg }: { deg: number }) {
  // SVG arrow rotated to point in the wind direction (meteorological
  // "from" convention: 0° = North means the wind is coming *from* the north,
  // so the arrow points northward).
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg
        viewBox="0 0 80 80"
        className="h-full w-full text-[var(--color-border)]"
      >
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="6"
          x2="40"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="66"
          x2="40"
          y2="74"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="6"
          y1="40"
          x2="14"
          y2="40"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="66"
          y1="40"
          x2="74"
          y2="40"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="40" y="4" textAnchor="middle" fontSize="8" fill="currentColor">
          N
        </text>
      </svg>
      <svg
        viewBox="0 0 80 80"
        className="absolute inset-0 h-full w-full text-[var(--color-brand-400)] transition-transform duration-500"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <path d="M40 14 L46 38 L40 32 L34 38 Z" fill="currentColor" />
        <line
          x1="40"
          y1="32"
          x2="40"
          y2="62"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function formatDirection(deg: number): string {
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(deg / 45) % 8;
  return points[idx];
}
