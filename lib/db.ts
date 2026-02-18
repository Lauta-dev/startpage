// Prueba este import específico si el general falla en Bun
import { createClient } from "@libsql/client"; 

const isDev = process.env.NODE_ENV === 'development';

const client = createClient({
  url: isDev ? "file:mydatabase.db" : process.env.TURSO_DATABASE_URL || "",
  authToken: isDev ? undefined : process.env.TURSO_AUTH_TOKEN || "",
});

export default client
