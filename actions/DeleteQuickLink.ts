"use server";

import client from "@/lib/db"
import { revalidatePath } from "next/cache";

async function RemoveQuickLink(id: number) {
  const sql = "DELETE FROM quick_links WHERE id = ?"

  try {
    const result = client.execute({
      sql,
      args: [id]
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

export default RemoveQuickLink
