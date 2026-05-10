import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@/lib/db/schema";

const { Pool } = pg;

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return { pool, db: drizzle(pool, { schema }) };
}

let _pool: pg.Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

export function getPool(): pg.Pool {
  if (!_pool) {
    const instance = createDb();
    _pool = instance.pool;
    _db = instance.db;
  }
  return _pool!;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) {
      const instance = createDb();
      _pool = instance.pool;
      _db = instance.db;
    }
    return Reflect.get(_db!, prop);
  },
});

export * from "@/lib/db/schema";
