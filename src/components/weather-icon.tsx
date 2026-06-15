import type { WeatherCondition } from '@/lib/types/weather.types';

type IconProps = {
  condition?: WeatherCondition;
  className?: string;
};

/**
 * Renders an inline SVG icon that matches the OpenWeatherMap condition.
 * Falls back to a generic cloud if the id is unknown.
 */
export default function WeatherIcon({
  condition,
  className = 'h-10 w-10',
}: IconProps) {
  const id = condition?.id ?? 800;
  const isNight = condition?.icon?.endsWith('n') ?? false;

  // OWM group → icon
  if (id >= 200 && id < 300) {
    return <ThunderIcon className={className} />;
  }
  if (id >= 300 && id < 600) {
    return <RainIcon className={className} />;
  }
  if (id >= 600 && id < 700) {
    return <SnowIcon className={className} />;
  }
  if (id >= 700 && id < 800) {
    return <MistIcon className={className} />;
  }
  if (id === 800) {
    return isNight ? (
      <MoonIcon className={className} />
    ) : (
      <SunIcon className={className} />
    );
  }
  // 801–804: clouds
  return <CloudIcon className={className} />;
}

function baseProps(className: string) {
  return {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

function SunIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)} fill="currentColor" stroke="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CloudIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <path d="M17 18H7a4 4 0 0 1 0-8 6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 18z" />
    </svg>
  );
}

function RainIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <path d="M17 14H7a4 4 0 0 1 0-8 6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 14z" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
    </svg>
  );
}

function SnowIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <path d="M17 14H7a4 4 0 0 1 0-8 6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 14z" />
      <path d="M8 18h.01M12 18h.01M16 18h.01" strokeWidth={2.4} />
    </svg>
  );
}

function ThunderIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <path d="M17 14H7a4 4 0 0 1 0-8 6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 14z" />
      <path d="M12 15l-2 4h3l-1 3" />
    </svg>
  );
}

function MistIcon({ className }: { className: string }) {
  return (
    <svg {...baseProps(className)}>
      <path d="M3 8h13a3 3 0 1 0-3-3M3 14h17M3 18h12M3 11h18" />
    </svg>
  );
}
