import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  out: 'drizzle',
  schema: './src/db/schema.ts',
  dbCredentials: {
    accountId: "a26a722bd6408842de8098dadebaebe3",
    databaseId: "1bcd7691-54d4-4fee-b368-4c340a895021",
    token: "oMmVhkIcI30vCQGRmAc1tMXKeMew8ZBgP6-AghgK"
  }
})