import client from "@/lib/db";

// types.ts o arriba de tu función
interface QuickLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  position: number;
  created_at: string;
}

async function GetQuickLinks(): Promise<{ res: QuickLink[], error: any, result: any }> {
  const query = "select * from quick_links"

  try {
    const result = await client.execute(query)
    const rows = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      icon: row.icon,
      position: row.position,
      created_at: row.created_at?.toString(), // Mantené el nombre de la interfaz
    })) as QuickLink[];

    return {
      res: rows,
      error: {},
      result
    }
  } catch (error) {
    return {
      res: [],
      error: error,
      result: ""
    }
  }
}

export default GetQuickLinks
