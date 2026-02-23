'use server';
import { revalidatePath } from 'next/cache';
import client from '@/lib/db';
import { getUrlMetadata } from '@/lib/getFavicon';

export async function CreateBookmark(url: string, categoryId: number, categoryName: string) {
  let targetUrl = url.startsWith('https://') ? url : `https://${url}`;
  const { title, url: site, ogImage, description } = await getUrlMetadata(targetUrl);

  try {
    await client.execute({
      sql: `INSERT INTO bookmarks (title, url, og_image, og_description, category, category_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [title, site, ogImage, description || '', categoryName, categoryId],
    });
    revalidatePath('/');
  } catch (error) {
    console.error('ERROR AL INSERTAR', error);
  }
}

export async function DeleteBookmark(id: number) {
  try {
    await client.execute({ sql: 'DELETE FROM bookmarks WHERE id = ?', args: [id] });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('ERROR AL ELIMINAR', error);
    return { success: false };
  }
}

export async function EditBookark({
  customTitle,
  newUrl,
  id,
  categoryId,
  categoryName,
}: {
  customTitle: string;
  newUrl: string;
  id: number;
  categoryId?: number;
  categoryName?: string;
}) {
  try {
    const newMeta = await getUrlMetadata(newUrl.trim());

    if (categoryId !== undefined && categoryName !== undefined) {
      await client.execute({
        sql: `UPDATE bookmarks SET title = ?, url = ?, og_image = ?, category = ?, category_id = ? WHERE id = ?`,
        args: [customTitle ?? newMeta.title, newMeta.url, newMeta.ogImage, categoryName, categoryId, id],
      });
    } else {
      await client.execute({
        sql: `UPDATE bookmarks SET title = ?, url = ?, og_image = ? WHERE id = ?`,
        args: [customTitle ?? newMeta.title, newMeta.url, newMeta.ogImage, id],
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('ERROR AL EDITAR', error);
    return { success: false };
  }
}
