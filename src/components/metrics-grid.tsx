import type { CurrentWeatherResponse } from '@/lib/types/weather.types';
import Card from './card';

export default function MetricsGrid({
  data,
}: {
  data: CurrentWeatherResponse;
}) {
  const visibilityKm = (data.visibility / 1000).toFixed(1);

  const items = [
    {
      label: 'Humidity',
      value: `${data.main.humidity}%`,
    },
    {
      label: 'Pressure',
      value: `${data.main.pressure} hPa`,
    },
    {
      label: 'Cloud cover',
      value: `${data.clouds.all}%`,
    },
    {
      label: 'Visibility',
      value: `${visibilityKm} km`,
    },
    {
      label: 'Low',
      value: `${Math.round(data.main.temp_min)}°`,
    },
    {
      label: 'High',
      value: `${Math.round(data.main.temp_max)}°`,
    },
  ];

  return (
    <Card title="Conditions">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        {items.map(item => (
          <div key={item.label}>
            <dt className="text-xs text-[var(--color-muted)]">{item.label}</dt>
            <dd className="mt-0.5 font-mono text-base font-medium text-[var(--color-text)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
