import client from "@/lib/db";
import { Bookmark } from "@/lib/types";

export default async function getBookmarks() {
  const query = `SELECT id, url AS site, title, og_image FROM bookmarks`;
  const result = await client.execute(query);

  const rows = result.rows.map(({ id, title, site, og_image }) => ({
    id, title, site, ogImage: og_image
  })) as unknown as Bookmark[]

  return rows
}
