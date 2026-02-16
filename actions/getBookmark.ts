import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || ""
});

export default async function Aaa() {
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

  return Array.from(categoriesMap.values())
}
