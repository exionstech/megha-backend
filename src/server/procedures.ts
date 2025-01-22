import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { env } from "hono/adapter";
import { j } from "./__internals/j";

const extendedDatabaseMiddleware = j.middleware(async ({ c, next }) => {
  const variables = env(c);

  const pool = new Pool({
    connectionString: variables.DATABASE_URL,
  });

  const adapter = new PrismaNeon(pool);

  const db = new PrismaClient({
    adapter,
  });
  
  return await next({ db });
});

export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure.use(extendedDatabaseMiddleware);
