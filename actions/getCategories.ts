'use server';
import client from '@/lib/db';

export interface Category {
  id: number;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const result = await client.execute(
    'SELECT id, name FROM categories ORDER BY name ASC'
  );
  return result.rows as unknown as Category[];
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  await client.execute({
    sql: 'INSERT OR IGNORE INTO categories (name) VALUES (?)',
    args: [trimmed],
  });
  const result = await client.execute({
    sql: 'SELECT id, name FROM categories WHERE name = ?',
    args: [trimmed],
  });
  return result.rows[0] as unknown as Category;
}
