// Prueba este import específico si el general falla en Bun
import { createClient } from "@libsql/client"; 

const client = createClient({
  url: "file:mydatabase.db",
});

export default client
