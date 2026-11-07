import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolveSqliteDatabasePath } from "./sqlite-path";
import { ensureSqliteSchema } from "./sqlite-schema-repair";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const dbPath = resolveSqliteDatabasePath();
  ensureSqliteSchema(dbPath);
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

if (globalForPrisma.prisma) {
  ensureSqliteSchema();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
