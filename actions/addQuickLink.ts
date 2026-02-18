"use server";

import client from "@/lib/db"
import { getUrlMetadata } from "@/lib/getFavicon"
import { revalidatePath } from "next/cache";

async function AddQuickLink({url}: {url:string}) {
  const { title, url: site, favicon } = await getUrlMetadata(url)

  const sql = "INSERT INTO quick_links (name, url, icon, position) VALUES (?, ?, ?, ?)"

  try {
    const result = client.execute({
      sql,
      args: [title, site, favicon, 0]
    })
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error({
      title: "Error Al Insertar",
      error
    })
    return { success: false }
  }
}

export default AddQuickLink
