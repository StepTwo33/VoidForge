import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { verifyAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import {
  OVERRIDE_CATEGORIES,
  type DataOverride,
  type OverrideCategory,
} from "@/lib/overrides/data-overrides";
import { deepMergeOverrideFields } from "@/lib/overrides/override-merge";

const VALID_ACTIONS = new Set(["modify", "add", "remove"]);

function toPrismaJson(fields: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(fields)) as Prisma.InputJsonValue;
}

function isOverrideCategory(value: string): value is OverrideCategory {
  return (OVERRIDE_CATEGORIES as readonly string[]).includes(value);
}

function rowToOverride(row: {
  id: string;
  targetType: string;
  targetId: string;
  action: string;
  fields: unknown;
  note: string;
  updatedAt: Date;
  author: { username: string | null; name: string | null } | null;
}): DataOverride {
  const fields =
    row.fields && typeof row.fields === "object" && !Array.isArray(row.fields)
      ? (row.fields as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    targetType: row.targetType as OverrideCategory,
    targetId: row.targetId,
    action: row.action as DataOverride["action"],
    fields,
    note: row.note,
    timestamp: row.updatedAt.getTime(),
    updatedBy: row.author?.username || row.author?.name || undefined,
  };
}

const selectFields = {
  id: true,
  targetType: true,
  targetId: true,
  action: true,
  fields: true,
  note: true,
  updatedAt: true,
  author: { select: { username: true, name: true } },
} as const;

function parsePayload(body: unknown): Omit<DataOverride, "timestamp" | "updatedBy"> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const targetType = typeof b.targetType === "string" ? b.targetType : "";
  const targetId = typeof b.targetId === "string" ? b.targetId.trim() : "";
  const action = typeof b.action === "string" ? b.action : "";
  const note = typeof b.note === "string" ? b.note.trim() : "";
  const id = typeof b.id === "string" && b.id.trim() ? b.id.trim() : "";
  if (!isOverrideCategory(targetType) || !targetId || !VALID_ACTIONS.has(action) || !id) return null;
  const fields =
    b.fields && typeof b.fields === "object" && !Array.isArray(b.fields)
      ? (b.fields as Record<string, unknown>)
      : {};
  return { id, targetType, targetId, action: action as DataOverride["action"], fields, note };
}

// GET /api/data-overrides — shared list (public; applied site-wide in the client)
export async function GET() {
  const rows = await prisma.dataOverride.findMany({
    orderBy: { updatedAt: "desc" },
    select: selectFields,
  });
  return NextResponse.json({ overrides: rows.map(rowToOverride) });
}

// POST /api/data-overrides — upsert by target (staff only)
export async function POST(req: NextRequest) {
  const { isAdmin, userId } = await verifyAdmin();
  if (!isAdmin || !userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = parsePayload(json);
  if (!payload) {
    return NextResponse.json({ error: "Invalid override payload" }, { status: 400 });
  }

  const existing = await prisma.dataOverride.findUnique({
    where: {
      targetType_targetId: {
        targetType: payload.targetType,
        targetId: payload.targetId,
      },
    },
  });

  let mergedFields = payload.fields;
  if (existing && payload.action === "modify" && existing.action === "modify") {
    const prev =
      existing.fields && typeof existing.fields === "object" && !Array.isArray(existing.fields)
        ? (existing.fields as Record<string, unknown>)
        : {};
    mergedFields = deepMergeOverrideFields(prev, payload.fields);
  }

  const fieldsJson = toPrismaJson(payload.action === "remove" ? {} : mergedFields);

  const row = await prisma.dataOverride.upsert({
    where: {
      targetType_targetId: {
        targetType: payload.targetType,
        targetId: payload.targetId,
      },
    },
    create: {
      id: payload.id,
      targetType: payload.targetType,
      targetId: payload.targetId,
      action: payload.action,
      fields: fieldsJson,
      note: payload.note,
      authorId: userId,
    },
    update: {
      action: payload.action,
      fields: fieldsJson,
      note: payload.note,
      authorId: userId,
    },
    select: selectFields,
  });

  return NextResponse.json(rowToOverride(row));
}

// PUT /api/data-overrides — bulk import (staff only; skips existing targets)
export async function PUT(req: NextRequest) {
  const { isAdmin, userId } = await verifyAdmin();
  if (!isAdmin || !userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = Array.isArray(json)
    ? json
    : json && typeof json === "object" && Array.isArray((json as { overrides?: unknown }).overrides)
      ? (json as { overrides: unknown[] }).overrides
      : null;

  if (!incoming) {
    return NextResponse.json({ error: "Expected overrides array" }, { status: 400 });
  }

  let imported = 0;
  for (const item of incoming) {
    const payload = parsePayload(item);
    if (!payload) continue;

    const exists = await prisma.dataOverride.findUnique({
      where: {
        targetType_targetId: {
          targetType: payload.targetType,
          targetId: payload.targetId,
        },
      },
    });
    if (exists) continue;

    await prisma.dataOverride.create({
      data: {
        id: payload.id,
        targetType: payload.targetType,
        targetId: payload.targetId,
        action: payload.action,
        fields: toPrismaJson(payload.action === "remove" ? {} : payload.fields),
        note: payload.note,
        authorId: userId,
      },
    });
    imported++;
  }

  return NextResponse.json({ imported });
}

// DELETE /api/data-overrides — bulk delete by id (staff only)
export async function DELETE(req: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ids = Array.isArray((json as { ids?: unknown })?.ids)
    ? (json as { ids: unknown[] }).ids.filter((id): id is string => typeof id === "string" && id.length > 0)
    : null;

  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "Expected non-empty ids array" }, { status: 400 });
  }

  const result = await prisma.dataOverride.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ ok: true, deleted: result.count });
}
