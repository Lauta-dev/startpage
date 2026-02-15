import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: "libsql://booksmarkslist-vercel-icfg-6ejx1ba0hvb5q9dgvqtqmx7r.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzExOTY1NjYsImlkIjoiMmZkYzYyZWMtY2ViNy00ZmRmLWJiYWYtNzVjN2IxYTkxMTNjIiwicmlkIjoiYTRmMDMxZDMtYzJjOC00MWMxLTgyZWUtZGMyOWUxNTAzODgxIn0.ZM_K_TGrJcHvwBHFq-DvWN-Xr7CyaC9k1ug7RrHxkRVQGmAyhYWthvpZXoYOoQFAapv7fR3Z3OuG50mdCw7GBw"
});

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
