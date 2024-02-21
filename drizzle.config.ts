import type { Config } from "drizzle-kit";

export default {
  schema: "./app/.server/db/schema.ts",
  driver: "d1",
  out: "migrations",
  dbCredentials: {
    wranglerConfigPath: "wrangler.toml",
    dbName: "dev-qr-test",
  },
} satisfies Config;
