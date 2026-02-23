'use server';
import { revalidatePath } from 'next/cache';
import client from '@/lib/db';

export type ActionResult = { ok: true } | { ok: false; message: string };

/** Solo guarda en DB — la metadata ya viene del cliente */
export async function SaveBookmark(data: {
  title: string; url: string; ogImage: string | null;
  description: string; categoryId: number; categoryName: string;
}): Promise<ActionResult> {
  try {
    await client.execute({
      sql: `INSERT INTO bookmarks (title, url, og_image, og_description, category, category_id) VALUES (?,?,?,?,?,?)`,
      args: [data.title, data.url, data.ogImage, data.description, data.categoryName, data.categoryId],
    });
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    console.error('ERROR DB', e);
    return { ok: false, message: 'Error al guardar en la base de datos' };
  }
}

export async function UpdateBookmark(data: {
  id: number; title: string; url: string; ogImage: string | null;
  categoryId?: number; categoryName?: string;
}): Promise<ActionResult> {
  try {
    if (data.categoryId !== undefined && data.categoryName !== undefined) {
      await client.execute({
        sql: `UPDATE bookmarks SET title=?, url=?, og_image=?, category=?, category_id=? WHERE id=?`,
        args: [data.title, data.url, data.ogImage, data.categoryName, data.categoryId, data.id],
      });
    } else {
      await client.execute({
        sql: `UPDATE bookmarks SET title=?, url=?, og_image=? WHERE id=?`,
        args: [data.title, data.url, data.ogImage, data.id],
      });
    }
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    console.error('ERROR AL EDITAR', e);
    return { ok: false, message: 'Error al actualizar el bookmark' };
  }
}

export async function DeleteBookmark(id: number): Promise<ActionResult> {
  try {
    await client.execute({ sql: 'DELETE FROM bookmarks WHERE id = ?', args: [id] });
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, message: 'Error al eliminar el bookmark' };
  }
}

// Legacy — mantener para compatibilidad con otros componentes
export async function CreateBookmark(url: string, categoryId: number, categoryName: string) {
  const { fetchMetadata } = await import('./fetchMetadata');
  const meta = await fetchMetadata(url);
  if (!meta.ok) return { ok: false, message: meta.message };
  return SaveBookmark({ title: meta.title, url: meta.url, ogImage: meta.ogImage, description: meta.description, categoryId, categoryName });
}

export async function EditBookark(args: { customTitle: string; newUrl: string; id: number; categoryId?: number; categoryName?: string }) {
  const { fetchMetadata } = await import('./fetchMetadata');
  const meta = await fetchMetadata(args.newUrl);
  if (!meta.ok) return { ok: false, message: meta.message };
  return UpdateBookmark({ id: args.id, title: args.customTitle || meta.title, url: meta.url, ogImage: meta.ogImage, categoryId: args.categoryId, categoryName: args.categoryName });
}
