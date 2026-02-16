import { NextResponse } from 'next/server';
import client from '@/lib/db';
import getFavicon from '@/lib/getFavicon';

// --- DELETE: Eliminar un marcador ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Debe ser una Promesa en Next 15
) {

  const { id } = await params;
  try {
    await client.execute({
      sql: "DELETE FROM bookmarks WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}

// --- PUT: Editar un marcador ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // El ID viene de la URL
) {
  const { id } = await params; // Esperamos el ID de la URL
  const { name, site } = await req.json(); // El resto viene del body

  const icon = await getFavicon(site)

  // Aquí harías el UPDATE en la DB usando el ID de la URL
  try {
    await client.execute({
      sql: "UPDATE bookmarks SET name = ?, site = ?, icon = ? WHERE id = ?",
      args: [name, site, icon, id]
    });
    return NextResponse.json({ message: "Actualizado con éxito" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
