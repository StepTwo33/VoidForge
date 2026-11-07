#!/usr/bin/env node
/**
 * Align SQLite schema with prisma/schema.prisma when migrate history is ahead of the
 * actual database (no sqlite3 CLI required).
 *
 * Env: SQLITE_DATABASE_PATH and/or DATABASE_URL (set by start.sh).
 */
import Database from "better-sqlite3";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Load .env files when invoked standalone or from deploy.sh without pre-exported DATABASE_URL.
if (!process.env.SQLITE_DATABASE_PATH && !process.env.DATABASE_URL) {
  for (const envFile of [".env.production", ".env.local", ".env"]) {
    const full = path.join(root, envFile);
    if (existsSync(full)) {
      dotenv.config({ path: full, quiet: true });
    }
  }
}

/** Columns that may be missing if migrations were marked applied without running. */
const TABLE_COLUMNS = {
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

function resolveDbPath() {
  const explicit = process.env.SQLITE_DATABASE_PATH?.trim();
  if (explicit) return explicit;
  const raw = process.env.DATABASE_URL?.trim() || "file:./dev.db";
  const filePath = raw.startsWith("file:") ? raw.slice("file:".length) : raw;
  return path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath);
}

function tableExists(db, table) {
  return (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(table)?.ok === 1
  );
}

function columnExists(db, table, column) {
  const rows = db.prepare(`PRAGMA table_info("${table}")`).all();
  return rows.some((row) => row.name === column);
}

function indexExists(db, name) {
  return (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'index' AND name = ?")
      .get(name)?.ok === 1
  );
}

function ensureTable(db, { name, sql }) {
  if (tableExists(db, name)) return false;
  console.log(`[repair-db] Creating table ${name}…`);
  db.exec(sql);
  return true;
}

function ensureColumn(db, table, { name, alter }) {
  if (columnExists(db, table, name)) return false;
  console.log(`[repair-db] Adding ${table}.${name}…`);
  db.exec(alter);
  return true;
}

function ensureIndex(db, { name, sql }) {
  if (indexExists(db, name)) return false;
  console.log(`[repair-db] Creating index ${name}…`);
  db.exec(sql);
  return true;
}

const dbPath = resolveDbPath();
console.log(`[repair-db] ${dbPath}`);

if (!existsSync(dbPath)) {
  console.log("[repair-db] Database file not found yet — skipping.");
  process.exit(0);
}

let db;
try {
  db = new Database(dbPath);
} catch (err) {
  console.error("[repair-db] Failed to open database:", err);
  process.exit(1);
}

let changes = 0;

try {
  if (!tableExists(db, "User")) {
    console.log("[repair-db] User table not found — run Prisma migrations first.");
    process.exit(0);
  }

  const userCount = db.prepare('SELECT COUNT(*) AS n FROM "User"').get();
  console.log(`[repair-db] Users in database: ${userCount?.n ?? "?"}`);

  for (const tbl of TABLES) {
    if (ensureTable(db, tbl)) changes += 1;
  }

  for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
    if (!tableExists(db, table)) continue;
    for (const col of columns) {
      if (ensureColumn(db, table, col)) changes += 1;
    }
  }

  for (const idx of INDEXES) {
    if (tableExists(db, idx.table)) {
      if (ensureIndex(db, idx)) changes += 1;
    }
  }

  if (changes === 0) {
    console.log("[repair-db] Schema OK.");
  } else {
    console.log(`[repair-db] Applied ${changes} repair(s).`);
  }
} catch (err) {
  console.error("[repair-db] Schema repair failed:", err);
  process.exit(1);
} finally {
  db.close();
}
