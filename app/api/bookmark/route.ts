import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || ""
});

async function getDisplayOrder(id: number) {
  const sql = "select COUNT(*) from bookmarks where category_id = ?"
  const resutl = await client.execute({sql, args: [id]})
  const f = resutl.rows[0][0] as number
  return f+1
}

import * as cheerio from 'cheerio';

async function getFavicon(url: string) {
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

export const GET = async () => {
    const query = `
      SELECT 
      c.id as category_id,
      c.name as category_name,
      b.id as bookmark_id,
      b.name as bookmark_name,
      b.icon as bookmark_icon,
      b.site as bookmark_site
    FROM categories c
    LEFT JOIN bookmarks b ON c.id = b.category_id
    ORDER BY c.display_order, b.display_order
  `;


  const result = await client.execute(query);
  
  // Transformar los resultados al formato del array original
  const categoriesMap = new Map();

  result.rows.forEach((row) => {
    if (!categoriesMap.has(row.category_id)) {
      categoriesMap.set(row.category_id, {
        category: row.category_name,
        id: row.category_id,
        links: []
      });
    }

    if (row.bookmark_id) {
      categoriesMap.get(row.category_id).links.push({
        name: row.bookmark_name,
        icon: row.bookmark_icon,
        site: row.bookmark_site
      });
    }
  });

  return NextResponse.json(Array.from(categoriesMap.values())); 
};

export const POST = async (req: Request) => {
  const data = await req.json()
  const {category, name, url} = data

  if (category == null || name == null || url == null) {
    return NextResponse.json({error: {
      category, name, url
    }})
  }
 
  // id, name, site, icon, display order
  const query = "INSERT INTO bookmarks (category_id, name, icon, site, display_order) VALUES (?, ?, ?, ?, ?)"
  const displayOrder = await getDisplayOrder(category)
  const icon = await getFavicon(`https://${url}`)
  
  const result = await client.execute({
    sql: query,
    args: [category, name,  icon, url, displayOrder]
  });

  return NextResponse.json(result)
}
