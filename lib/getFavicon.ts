import * as cheerio from 'cheerio';

export async function getUrlMetadata(url: string) {
  // 1. Limpieza básica de la URL
  let targetUrl = url.trim();
  if (!targetUrl.startsWith("https")) {
    targetUrl = `https://${targetUrl}`;
  }

  console.log(targetUrl)

  try {
    // 2. Fetch con timeout para que no se cuelgue tu server
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 segundos max

    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
  } 
    });
    
    clearTimeout(timeout);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 3. Extraer Título (Prioridad: OG -> Title tag)
    const title = 
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

    console.log({title: title.trim(),
      favicon,
      ogImage: ogImage ? new URL(ogImage, targetUrl).href : null,
      url: targetUrl,
      description,
      hostname})

    return {
      title: title.trim(),
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

getUrlMetadata("https://reddit.com")
