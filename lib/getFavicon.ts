import * as cheerio from 'cheerio';

export async function getUrlMetadata(url: string) {
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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GeminiBot/1.0)' } 
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

    const hostname = new URL(url).hostname.replace('www.', '')

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

getUrlMetadata("https://youtube.com")
