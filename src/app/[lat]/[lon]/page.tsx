import LocationWeather from '@/components/location-weather';

export default async function Page({
  params,
}: {
  params: Promise<{ lat: number | string; lon: number | string }>;
}) {
  const { lat, lon } = await params;

  return (
    <div>
      <LocationWeather lat={lat} lon={lon} />
    </div>
  );
}
