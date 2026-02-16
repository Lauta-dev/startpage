import { createClient } from '@libsql/client';

// const client = createClient({
//   url: process.env.TURSO_DATABASE_URL || "",
//   authToken: process.env.TURSO_AUTH_TOKEN || ""
// });
const client = createClient({
  url: "file:./mydatabase.db",
});

export default client
