import { NextRequest } from 'next/server';
import fetchForecast from '@/lib/api/forecast';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json(
      { error: 'lat and lon query params are required and must be numbers' },
      { status: 400 }
    );
  }

  const data = await fetchForecast(lat, lon);
  return Response.json(data);
}
