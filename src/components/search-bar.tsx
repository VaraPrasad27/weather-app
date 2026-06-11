'use client';

import { useEffect, useState } from 'react';
import { GeocodingResponse } from '@/lib/types/geocoding.types';
import Link from 'next/link';

export default function SearchBar() {
  const [data, setData] = useState<GeocodingResponse>();
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed === '') {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(undefined);
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

  function handleChange(value: string) {
    setName(value);
    if (value.trim() === '') {
      setData(undefined);
      setError(undefined);
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        placeholder={'Search...'}
        onChange={e => handleChange(e.target.value)}
      />
      {error && <p>Error: {error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && trimmed !== '' && data?.length === 0 && (
        <p>No matches</p>
      )}
      <div>
        {data?.map(location => (
          <Link
            className="cursor-pointer block justify-items-center w-50"
            key={`${location.lat},${location.lon}`}
            href={`/${location.lat}/${location.lon}`}
          >
            <p>
              {location.name}, {location.country}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
