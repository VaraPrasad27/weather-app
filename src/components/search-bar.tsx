'use client';

import { useEffect, useState } from 'react';
import { GeocodingResponse } from '@/lib/types/geocoding.types';
import Link from 'next/link';

export default function SearchBar() {
  const [data, setData] = useState<GeocodingResponse>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed === '') {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(undefined);
      setOpen(true);
      try {
        const res = await fetch(
          `/api/geocode?name=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) {
          throw new Error(`Server responded with ${res.statusText}`);
        }
        const result = (await res.json()) as GeocodingResponse;
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (e) {
        if (
          controller.signal.aborted ||
          (e instanceof DOMException && e.name === 'AbortError')
        ) {
          return;
        }
        setError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name]);

  const trimmed = name.trim();
  const hasQuery = trimmed !== '';
  const showResults = open && hasQuery;

  function handleChange(value: string) {
    setName(value);
    if (value.trim() === '') {
      setData(undefined);
      setError(undefined);
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <label className="sr-only" htmlFor="location-search">
        Search for a location
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-muted)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-3.5-3.5" />
        </svg>
      </div>
      <input
        id="location-search"
        type="search"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search for a city or place…"
        value={name}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => hasQuery && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-3 pl-11 pr-4 text-base text-[var(--color-text)] placeholder:text-[var(--color-muted)] shadow-lg shadow-black/20 outline-none transition focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-500)]/40"
      />

      {showResults && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-2xl shadow-black/40">
          {loading && (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="p-4 text-sm text-red-400">Error: {error}</p>
          )}

          {!loading && !error && hasQuery && data?.length === 0 && (
            <p className="p-4 text-sm text-[var(--color-muted)]">
              No matches for “{trimmed}”
            </p>
          )}

          {!loading && !error && data && data.length > 0 && (
            <ul className="divide-y divide-[var(--color-border)]/60">
              {data.map(location => (
                <li key={`${location.lat},${location.lon}`}>
                  <Link
                    href={`/${location.lat}/${location.lon}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-[var(--color-surface-3)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-text)]">
                        {location.name}
                        {location.state ? `, ${location.state}` : ''}
                      </p>
                      <p className="truncate text-xs text-[var(--color-muted)]">
                        {location.country}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-[var(--color-muted)]">
                      {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
