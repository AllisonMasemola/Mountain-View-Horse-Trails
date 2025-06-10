import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "mountain_view_db",
});

export const db = drizzle({ client: poolConnection });

export async function main() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mountain_view_db",
  });
  const db = drizzle({ client: connection });
}
