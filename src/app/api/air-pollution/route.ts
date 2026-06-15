import { NextRequest } from 'next/server';
import fetchAirPollution from '@/lib/api/air-pollution';

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

  try {
    const data = await fetchAirPollution(lat, lon);
    return Response.json(data);
  } catch (e) {
    return Response.json(
      {
        error: e instanceof Error ? e.message : 'Failed to fetch air pollution',
      },
      { status: 502 }
    );
  }
}
