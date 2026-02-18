'use server';
import { revalidatePath } from "next/cache";

import client from "@/lib/db"
import { getUrlMetadata } from "@/lib/getFavicon"

export async function CreateBookmark(url: string) {
  const sql = `INSERT INTO bookmarks (title, url, og_image, og_description) VALUES (?,?,?,?)`
  const { title, url: site, ogImage } = await getUrlMetadata(url)

  try {
    const result = await client.execute({
      sql, args: [title, site, ogImage, "abc"]
    })

    revalidatePath("/")

  } catch (error) {
    console.log("-----ERROR AL INSERTAR -----------------------------")
    console.error(error)
    console.log("-----------------------------------")
  }
}

export async function DeleteBookmark(id: number) {
  const sql = "DELETE FROM bookmarks WHERE id = ?"
  
  try {
    await client.execute({
      sql, args: [id]
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.log("-----ERROR AL ELIMINAR -----------------------------")
    console.error(error)
    console.log("-----------------------------------")
    
    return { success: false }
  }
}

export async function EditBookark({ customTitle, newUrl, id }: { customTitle: string, newUrl: string, id: number }) {
  const sql = `UPDATE bookmarks SET title = ?, url = ?, og_image = ? WHERE id = ?`

  try {
    const newMeta = await getUrlMetadata(newUrl.trim())
    
    await client.execute({
      sql,
      args: [customTitle ?? newMeta.title, newMeta.url, newMeta.ogImage, id]
    })

    console.log("EN EL SERVIDOR__________")

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.log("-----ERROR AL EDITAR -----------------------------")
    console.error(error)
    console.log("-----------------------------------")
    
    return { success: false }
  }

}
