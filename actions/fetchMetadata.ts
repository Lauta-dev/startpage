'use server';
import { getUrlMetadata } from '@/lib/getFavicon';

export type MetadataResult =
  | { ok: true; title: string; url: string; ogImage: string | null; description: string; favicon: string | null }
  | { ok: false; message: string };

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  const targetUrl = url.startsWith('https://') ? url : `https://${url}`;
  try {
    const meta = await getUrlMetadata(targetUrl);
    return {
      ok:          true,
      title:       meta.title ?? targetUrl,
      url:         meta.url   ?? targetUrl,
      ogImage:     (meta as any).ogImage ?? null,
      description: (meta as any).description ?? '',
      favicon:     meta.favicon ?? null,
    };
  } catch {
    return { ok: false, message: 'No se pudo obtener la metadata del sitio' };
  }
}
