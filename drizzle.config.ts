import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "mysql",
  schema: "./lib/db/schema.ts", 

  dbCredentials: {
    url: "mysql://root@localhost:3306/mountain_view_db",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
  },

  strict: true,
  verbose: true,
});