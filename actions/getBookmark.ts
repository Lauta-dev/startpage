import client from "@/lib/db";
import { Bookmark } from "@/types/bookmark";

export default async function getBookmarks() {
  const query = `
      SELECT id, title, url, og_image, og_description, og_title, category, created_at
      FROM bookmarks
      ORDER BY created_at DESC`;
  const result = await client.execute(query);
 
  const rows = result.rows.map(({
    id,
    title,
    url,
    category,
    og_image,
    og_description, og_title, created_at}) => ({
    id, title, url, image: og_image,
      desc: og_description, ogTitle: og_title, createdAt: created_at, category
  })) as unknown as Bookmark[]

  return rows
}
