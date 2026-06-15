import LocationWeather from '@/components/location-weather';
import SearchBar from '@/components/search-bar';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What&apos;s the weather like?
        </h2>
        <p className="max-w-md text-sm text-[var(--color-muted)]">
          Search for any city, or grant location access to see conditions where
          you are right now.
        </p>
        <SearchBar />
      </section>

      <LocationWeather />
    </div>
  );
}
