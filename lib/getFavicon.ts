import * as cheerio from 'cheerio';

async function getFavicon(url: string) {

  if (!url.startsWith("https://")){
    url = `https://${url}`
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscamos en las etiquetas link más comunes
    const icon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href');

    if (icon) {
      // Si la ruta es relativa (ej: /favicon.ico), la convertimos en absoluta
      return new URL(icon, url).href;
    }

    // Si no encuentra nada, fallback al favicon estándar
    return `${new URL(url).origin}/favicon.ico`;
  } catch (error) {
    console.log("[getFavicon] ", error)
    return "";
  }
}

export default getFavicon
