import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/drizzle/schema.ts",
  out: "./src/db/drizzle",
});
