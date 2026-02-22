import * as cheerio from 'cheerio';

function firstLatter(url:string) {
    const hn = new URL(url).hostname.replace("www.", '').split(".")[0]
    return hn[0].toUpperCase() + hn.slice(1)
}

export async function getUrlMetadataOriginal(url: string) {
  // 1. Limpieza básica de la URL
  let targetUrl = url.trim();
  if (!targetUrl.startsWith("https")) {
    targetUrl = `https://${targetUrl}`;
  }


  try {
    // 2. Fetch con timeout para que no se cuelgue tu server
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 segundos max

    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  } 
    });
    
    clearTimeout(timeout);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 3. Extraer Título (Prioridad: OG -> Title tag)
    let title = 
      $('meta[property="og:title"]').attr('content') || 
      $('title').text() || 
      new URL(targetUrl).hostname;

    // 4. Extraer Imagen OG (Banner)
    const ogImage = $('meta[property="og:image"]').attr('content');

    // 5. Extraer Favicon (Lógica mejorada)
    const iconHref = 
      $('link[rel="apple-touch-icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');

    const description = $('meta[name="description"]').attr('content') || "";

    const favicon = iconHref 
      ? new URL(iconHref, targetUrl).href 
      : `${new URL(targetUrl).origin}/favicon.ico`;

    const hostname = new URL(targetUrl).hostname.replace('www.', '')

    return {
      title: title.trim().startsWith("https://") ? firstLatter(url) : title.trim(),
      favicon,
      ogImage: ogImage ? new URL(ogImage, targetUrl).href : null,
      url: targetUrl,
      description,
      hostname
    };

  } catch (error) {
    console.error("[getUrlMetadata] Error:", targetUrl, error);
    // Fallback básico si falla el fetch
    return {
      title: new URL(targetUrl).hostname,
      favicon: `${new URL(targetUrl).origin}/favicon.ico`,
      ogImage: null,
      url: targetUrl
    };
  }
}

export async function getUrlMetadata(url: string) {
  try {
    const res = await fetch(`https://api.urlmeta.org/meta?url=${encodeURIComponent(url)}`, {
      headers: {
        Authorization: `Basic ${process.env.URL_META_API}`
      },
    });
    const data = await res.json();

    console.log({data})

    // { data: { result: { status: 'OK' }, meta: { site: {}, title: '' } } }

    if (data.result?.status === 'OK') {
      return {
        title: data.meta?.title || firstLatter(url),
        favicon: `${new URL(url).origin}/favicon.ico`,
        ogImage: data.meta?.image || null,
        url,
        description: data.meta?.description || '',
        hostname: new URL(url).hostname.replace('www.', '')
      }
    }
    // si el status no es OK, cae al fallback
    return getUrlMetadataOriginal(url)
    
  } catch (error) {
    // si falla el fetch a urlmeta, cae al fallback
    return getUrlMetadataOriginal(url)
  }
}

getUrlMetadata("https://reddit.com")
