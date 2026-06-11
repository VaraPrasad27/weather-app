import LocationWeather from '@/components/location-weather';
import SearchBar from '@/components/search-bar';

export default function Home() {
  return (
    <div>
      <SearchBar />
      <h1>Weather</h1>
      <LocationWeather />
    </div>
  );
}
