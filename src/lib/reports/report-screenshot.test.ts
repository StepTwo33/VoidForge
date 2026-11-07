import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { NextRequest } from "next/server";
import {
  isValidScreenshotMagicBytes,
  saveReportScreenshotFile,
  removeReportScreenshotFile,
  reportScreenshotUploadDir,
} from "./report-screenshot-files";
import { POST as uploadRoute } from "@/app/api/reports/upload/route";
import { GET as serveRoute } from "@/app/api/uploads/reports/[filename]/route";
import { ensureSqliteSchema } from "@/lib/sqlite-schema-repair";
import Database from "better-sqlite3";

const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 1, 2, 3]);
const JPEG_HEADER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const GIF_HEADER = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 1, 0, 1, 0, 0x80, 0]);
const WEBP_HEADER = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x24, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
]);
const INVALID_HEADER = Buffer.from("Not a real image file at all");

let tmpRoot: string;

beforeEach(() => {
  tmpRoot = mkdtempSync(path.join(os.tmpdir(), "vf-report-ss-test-"));
  vi.spyOn(process, "cwd").mockReturnValue(tmpRoot);
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe("Report Screenshot Storage & Validation", () => {
  it("correctly identifies valid image magic bytes", () => {
    expect(isValidScreenshotMagicBytes(PNG_HEADER)).toBe(true);
    expect(isValidScreenshotMagicBytes(JPEG_HEADER)).toBe(true);
    expect(isValidScreenshotMagicBytes(GIF_HEADER)).toBe(true);
    expect(isValidScreenshotMagicBytes(WEBP_HEADER)).toBe(true);
    expect(isValidScreenshotMagicBytes(INVALID_HEADER)).toBe(false);
    expect(isValidScreenshotMagicBytes(Buffer.from([]))).toBe(false);
  });

  it("saves screenshot to disk and can remove it cleanly", async () => {
    const filename = await saveReportScreenshotFile("png", PNG_HEADER);
    expect(filename).toMatch(/^report_\d+_[a-f0-9]+\.png$/);

    const fullPath = path.join(reportScreenshotUploadDir(), filename);
    expect(existsSync(fullPath)).toBe(true);
    expect(readFileSync(fullPath)).toEqual(PNG_HEADER);

    await removeReportScreenshotFile(filename);
    expect(existsSync(fullPath)).toBe(false);
  });

  it("safely ignores removal of path traversal attempts", async () => {
    await expect(removeReportScreenshotFile("../secret.txt")).resolves.not.toThrow();
    await expect(removeReportScreenshotFile("..\\secret.txt")).resolves.not.toThrow();
  });
});

describe("Report Screenshot Upload & Serve API Routes", () => {
  it("uploads a valid PNG screenshot and serves it back with proper headers", async () => {
    const formData = new FormData();
    formData.append("file", new File([new Uint8Array(PNG_HEADER)], "screenshot.png", { type: "image/png" }));

    const req = new NextRequest("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadRoute(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.url).toMatch(/^\/api\/uploads\/reports\/report_\d+_[a-f0-9]+\.png$/);
    expect(json.filename).toBeDefined();

    // Verify serving the file back
    const serveReq = new NextRequest(`http://localhost${json.url}`);
    const serveRes = await serveRoute(serveReq, { params: Promise.resolve({ filename: json.filename }) });
    expect(serveRes.status).toBe(200);
    expect(serveRes.headers.get("content-type")).toBe("image/png");
    expect(serveRes.headers.get("cache-control")).toContain("public");
  });

  it("rejects non-image files with 400", async () => {
    const formData = new FormData();
    formData.append("file", new File([new Uint8Array(INVALID_HEADER)], "fake.png", { type: "image/png" }));

    const req = new NextRequest("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadRoute(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("valid image");
  });

  it("rejects invalid path traversal filenames on serve route with 400", async () => {
    const serveReq = new NextRequest("http://localhost/api/uploads/reports/..%2Fevil.png");
    const serveRes = await serveRoute(serveReq, { params: Promise.resolve({ filename: "../evil.png" }) });
    expect(serveRes.status).toBe(400);
  });

  it("returns 404 for non-existent screenshot", async () => {
    const serveReq = new NextRequest("http://localhost/api/uploads/reports/nonexistent.png");
    const serveRes = await serveRoute(serveReq, { params: Promise.resolve({ filename: "nonexistent.png" }) });
    expect(serveRes.status).toBe(404);
  });
});

describe("SQLite Report & SavedRiven auto-repair", () => {
  it("adds missing Report.screenshots / Report.adminReply columns and SavedRiven table while preserving existing reports", () => {
    const legacyDbPath = path.join(tmpRoot, "legacy.db");
    const db = new Database(legacyDbPath);
    db.exec(`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT,
        "email" TEXT
      );
      CREATE TABLE "Report" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "reporterName" TEXT NOT NULL DEFAULT 'Anonymous',
        "itemType" TEXT NOT NULL,
        "itemName" TEXT NOT NULL,
        "itemId" TEXT NOT NULL DEFAULT '',
        "issues" TEXT NOT NULL,
        "statDiscrepancies" TEXT NOT NULL DEFAULT '[]',
        "comment" TEXT NOT NULL DEFAULT '',
        "status" TEXT NOT NULL DEFAULT 'open',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const insert = db.prepare(
      `INSERT INTO "Report" ("id", "reporterName", "itemType", "itemName", "issues", "comment", "status")
       VALUES (?, ?, ?, ?, '{}', ?, 'open')`,
    );
    for (let i = 1; i <= 5; i++) {
      insert.run(`rep_${i}`, "Terkeon", "weapon", `Report ${i}`, `Comment ${i}`);
    }
    db.close();

    const applied = ensureSqliteSchema(legacyDbPath, { force: true });
    expect(applied).toBeGreaterThan(0);

    const verify = new Database(legacyDbPath, { readonly: true });
    const cols = (verify.prepare('PRAGMA table_info("Report")').all() as Array<{ name: string }>).map(
      (c) => c.name,
    );
    expect(cols).toContain("adminReply");
    expect(cols).toContain("screenshots");

    const rows = verify
      .prepare('SELECT id, itemName, adminReply, screenshots, status FROM "Report" ORDER BY id')
      .all() as Array<{ id: string; screenshots: string; adminReply: string; status: string }>;
    expect(rows).toHaveLength(5);
    expect(rows[0]!.screenshots).toBe("[]");
    expect(rows[0]!.adminReply).toBe("");

    const rivenTable = verify
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'SavedRiven'")
      .get() as { ok?: number } | undefined;
    expect(rivenTable?.ok).toBe(1);
    verify.close();

    // Idempotent second pass makes 0 changes
    expect(ensureSqliteSchema(legacyDbPath, { force: true })).toBe(0);
  });
});
