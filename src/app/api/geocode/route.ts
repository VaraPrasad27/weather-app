import { NextRequest } from 'next/server';
import fetchGeocode from '@/lib/api/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (name == '' || !name) {
    return Response.json(
      { error: 'Invalid name parameter or name is required' },
      { status: 400 }
    );
  }

  const data = await fetchGeocode(name, 5);
  return Response.json(data);
}
