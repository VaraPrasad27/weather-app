import type {
  AirPollutionResponse,
  AQILevel,
} from '@/lib/types/air-pollution.types';
import { AQI_LABELS } from '@/lib/types/air-pollution.types';
import Card from './card';

const AQI_DESCRIPTIONS: Record<AQILevel, string> = {
  1: 'Air quality is satisfactory; air pollution poses little or no risk.',
  2: 'Acceptable; some pollutants may be a concern for very sensitive people.',
  3: 'Members of sensitive groups may experience health effects.',
  4: 'Some members of the general public may experience health effects.',
  5: 'Health alert — emergency conditions affect the entire population.',
};

const AQI_COLORS: Record<AQILevel, string> = {
  1: 'bg-emerald-500',
  2: 'bg-lime-500',
  3: 'bg-amber-500',
  4: 'bg-orange-500',
  5: 'bg-rose-500',
};

export default function AirQualityCard({
  air,
  aqi,
}: {
  air: AirPollutionResponse;
  aqi: AQILevel;
}) {
  const c = air.list[0]?.components;
  const label = AQI_LABELS[aqi];

  const pollutants: { name: string; value?: number; unit: string }[] = [
    { name: 'PM2.5', value: c?.pm2_5, unit: 'μg/m³' },
    { name: 'PM10', value: c?.pm10, unit: 'μg/m³' },
    { name: 'O₃', value: c?.o3, unit: 'μg/m³' },
    { name: 'NO₂', value: c?.no2, unit: 'μg/m³' },
    { name: 'SO₂', value: c?.so2, unit: 'μg/m³' },
    { name: 'CO', value: c?.co, unit: 'μg/m³' },
  ];

  return (
    <Card title="Air quality" subtitle={`AQI ${aqi} · ${label}`}>
      <div className="grid gap-5 sm:grid-cols-[auto,1fr] sm:items-center">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block h-3 w-3 rounded-full ${AQI_COLORS[aqi]}`}
            aria-hidden="true"
          />
          <span className="font-mono text-3xl font-semibold">{aqi}</span>
          <span className="text-sm text-[var(--color-muted)]">/ 5</span>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          {AQI_DESCRIPTIONS[aqi]}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {pollutants.map(p => (
          <div
            key={p.name}
            className="rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface-3)]/50 p-2 text-center"
          >
            <dt className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              {p.name}
            </dt>
            <dd className="mt-0.5 font-mono text-sm">
              {p.value != null ? p.value.toFixed(1) : '—'}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
