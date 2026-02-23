import client from "@/lib/db";
import { Bookmark } from "@/types/bookmark";

export default async function getBookmarks(): Promise<Bookmark[]> {
  const query = `
    SELECT id, title, url, og_image, og_description, og_title, category, category_id, created_at
    FROM bookmarks
    ORDER BY created_at DESC
  `;

  const result = await client.execute(query);

  return result.rows.map(row => ({
    id:          Number(row.id),
    title:       String(row.title ?? ''),
    url:         String(row.url ?? ''),
    image:       row.og_image        ? String(row.og_image)        : null,
    desc:        row.og_description  ? String(row.og_description)  : null,
    ogTitle:     row.og_title        ? String(row.og_title)        : null,
    category:    String(row.category ?? ''),
    category_id: row.category_id     ? Number(row.category_id)     : null,
    createdAt:   String(row.created_at ?? ''),
  }));
}
