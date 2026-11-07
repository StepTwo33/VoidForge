import Database from "better-sqlite3";
import fs from "node:fs";
import { resolveSqliteDatabasePath } from "./sqlite-path";

interface ColumnSpec {
  name: string;
  alter: string;
}

const TABLE_COLUMNS: Record<string, ColumnSpec[]> = {
  User: [
    { name: "username", alter: 'ALTER TABLE "User" ADD COLUMN "username" TEXT' },
    { name: "bio", alter: 'ALTER TABLE "User" ADD COLUMN "bio" TEXT' },
    { name: "passwordHash", alter: 'ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT' },
    { name: "role", alter: `ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user'` },
    { name: "bannedAt", alter: 'ALTER TABLE "User" ADD COLUMN "bannedAt" DATETIME' },
    { name: "banReason", alter: 'ALTER TABLE "User" ADD COLUMN "banReason" TEXT' },
    { name: "supporterAt", alter: 'ALTER TABLE "User" ADD COLUMN "supporterAt" DATETIME' },
    {
      name: "newsletterOptIn",
      alter: 'ALTER TABLE "User" ADD COLUMN "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false',
    },
    {
      name: "createdAt",
      alter: 'ALTER TABLE "User" ADD COLUMN "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP',
    },
  ],
  Build: [
    {
      name: "description",
      alter: `ALTER TABLE "Build" ADD COLUMN "description" TEXT NOT NULL DEFAULT ''`,
    },
    {
      name: "isPublic",
      alter: 'ALTER TABLE "Build" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false',
    },
    {
      name: "itemId",
      alter: `ALTER TABLE "Build" ADD COLUMN "itemId" TEXT NOT NULL DEFAULT ''`,
    },
    {
      name: "upvoteCount",
      alter: 'ALTER TABLE "Build" ADD COLUMN "upvoteCount" INTEGER NOT NULL DEFAULT 0',
    },
    {
      name: "tags",
      alter: `ALTER TABLE "Build" ADD COLUMN "tags" TEXT NOT NULL DEFAULT '[]'`,
    },
  ],
  Report: [
    {
      name: "adminReply",
      alter: `ALTER TABLE "Report" ADD COLUMN "adminReply" TEXT NOT NULL DEFAULT ''`,
    },
    {
      name: "screenshots",
      alter: `ALTER TABLE "Report" ADD COLUMN "screenshots" TEXT NOT NULL DEFAULT '[]'`,
    },
  ],
  SiteUpdate: [
    {
      name: "featured",
      alter: 'ALTER TABLE "SiteUpdate" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false',
    },
  ],
};

const TABLES = [
  {
    name: "SavedRiven",
    requiresTable: "User",
    sql: `CREATE TABLE IF NOT EXISTS "SavedRiven" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "weaponId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "modId" TEXT NOT NULL,
      "stats" TEXT NOT NULL,
      "polarity" TEXT NOT NULL DEFAULT 'universal',
      "drain" INTEGER NOT NULL DEFAULT 10,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SavedRiven_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
  },
];

const INDEXES = [
  {
    name: "User_username_key",
    table: "User",
    sql: 'CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")',
  },
  {
    name: "Build_isPublic_idx",
    table: "Build",
    sql: 'CREATE INDEX IF NOT EXISTS "Build_isPublic_idx" ON "Build"("isPublic")',
  },
  {
    name: "SavedRiven_userId_idx",
    table: "SavedRiven",
    sql: 'CREATE INDEX IF NOT EXISTS "SavedRiven_userId_idx" ON "SavedRiven"("userId")',
  },
  {
    name: "SavedRiven_userId_weaponId_idx",
    table: "SavedRiven",
    sql: 'CREATE INDEX IF NOT EXISTS "SavedRiven_userId_weaponId_idx" ON "SavedRiven"("userId", "weaponId")',
  },
];

const repairedPaths = new Set<string>();

function tableExists(db: Database.Database, table: string): boolean {
  const row = db
    .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(table) as { ok?: number } | undefined;
  return row?.ok === 1;
}

function columnExists(db: Database.Database, table: string, column: string): boolean {
  const rows = db.prepare(`PRAGMA table_info("${table}")`).all() as Array<{ name: string }>;
  return rows.some((r) => r.name === column);
}

function indexExists(db: Database.Database, name: string): boolean {
  const row = db
    .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'index' AND name = ?")
    .get(name) as { ok?: number } | undefined;
  return row?.ok === 1;
}

/**
 * Idempotently aligns an existing SQLite database file with recent Prisma schema
 * additions (`Report.screenshots`, `Report.adminReply`, `SavedRiven`, `Build.tags`, etc.)
 * so runtime queries never 500 if `prisma migrate deploy` was skipped or blocked on deploy.
 */
export function ensureSqliteSchema(
  dbPath: string = resolveSqliteDatabasePath(),
  options?: { force?: boolean },
): number {
  if (!dbPath || dbPath === ":memory:") return 0;
  if (!options?.force && repairedPaths.has(dbPath)) return 0;
  if (!fs.existsSync(dbPath)) return 0;

  let db: Database.Database | undefined;
  let changes = 0;
  try {
    db = new Database(dbPath);
    const hasAnyAppTable = tableExists(db, "User") || tableExists(db, "Report") || tableExists(db, "Build");
    if (!hasAnyAppTable) {
      return 0;
    }

    for (const tbl of TABLES) {
      if (tbl.requiresTable && !tableExists(db, tbl.requiresTable)) continue;
      if (!tableExists(db, tbl.name)) {
        db.exec(tbl.sql);
        changes += 1;
      }
    }

    for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
      if (!tableExists(db, table)) continue;
      for (const col of columns) {
        if (!columnExists(db, table, col.name)) {
          db.exec(col.alter);
          changes += 1;
        }
      }
    }

    for (const idx of INDEXES) {
      if (tableExists(db, idx.table) && !indexExists(db, idx.name)) {
        db.exec(idx.sql);
        changes += 1;
      }
    }

    repairedPaths.add(dbPath);
    if (changes > 0) {
      console.info(`[sqlite-schema-repair] Applied ${changes} schema repair(s) on ${dbPath}`);
    }
    return changes;
  } catch (err) {
    console.warn(`[sqlite-schema-repair] Could not verify/repair ${dbPath}:`, err);
    return changes;
  } finally {
    try {
      db?.close();
    } catch {
      // ignore close errors
    }
  }
}

/**
 * Retries a Prisma query once after running `ensureSqliteSchema(..., { force: true })`
 * if SQLite reports a missing table or column (e.g. `Report.screenshots` or `SavedRiven`).
 */
export async function withSqliteSchemaRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/no such column|no such table|does not exist in the current database/i.test(msg)) {
      ensureSqliteSchema(undefined, { force: true });
      return await fn();
    }
    throw err;
  }
}
