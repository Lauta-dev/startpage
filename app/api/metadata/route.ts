import { getUrlMetadata } from '@/lib/getFavicon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
  }

  const metadata = await getUrlMetadata(url);
  return NextResponse.json(metadata);
}
