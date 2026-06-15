import LocationWeather from '@/components/location-weather';
import SearchBar from '@/components/search-bar';

export default async function Page({
  params,
}: {
  params: Promise<{ lat: number | string; lon: number | string }>;
}) {
  const { lat, lon } = await params;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4">
        <SearchBar />
      </section>
      <LocationWeather lat={lat} lon={lon} />
    </div>
  );
}
