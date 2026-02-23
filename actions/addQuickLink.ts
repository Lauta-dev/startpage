"use server";
import client from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionResult = { ok: true } | { ok: false; message: string };

/** Solo guarda en DB — la metadata ya viene del cliente */
export async function SaveQuickLink(data: { name: string; url: string; favicon: string | null }): Promise<ActionResult> {
  try {
    await client.execute({
      sql: "INSERT INTO quick_links (name, url, icon, position) VALUES (?, ?, ?, ?)",
      args: [data.name, data.url, data.favicon, 0],
    });
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("Error Al Insertar", e);
    return { ok: false, message: "Error al guardar en la base de datos" };
  }
}

// Legacy
async function AddQuickLink({ url }: { url: string }) {
  const { fetchMetadata } = await import('./fetchMetadata');
  const meta = await fetchMetadata(url);
  if (!meta.ok) return meta;
  return SaveQuickLink({ name: meta.title, url: meta.url, favicon: meta.favicon });
}

export default AddQuickLink;
