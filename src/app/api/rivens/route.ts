import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { clampRivenDrain, normalizeRivenPolarity, validateRivenStats } from "@/lib/riven/riven-validation";
import { allWeapons } from "@/data/weapons";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import {
  RIVEN_MOD_IDS,
  SAVED_RIVEN_NAME_MAX,
  parseSavedRivenRow,
  sanitizeRivenStats,
} from "@/lib/riven/saved-rivens";

const MAX_RIVENS_PER_USER = 500;

// GET /api/rivens?weaponId=braton — the signed-in user's saved rivens (Round 54).
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const weaponId = req.nextUrl.searchParams.get("weaponId");
  const rows = await prisma.savedRiven.findMany({
    where: { userId: session.user.id, ...(weaponId ? { weaponId } : {}) },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(rows.map(parseSavedRivenRow));
}

// POST /api/rivens — create, or update when `id` is the caller's riven.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = await req.text();
  if (raw.length > 10_000) {
    return NextResponse.json({ error: "Riven data too large" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const weaponId = typeof body.weaponId === "string" ? body.weaponId.trim() : "";
  const modId = typeof body.modId === "string" ? body.modId : "";
  const stats = sanitizeRivenStats(body.stats);
  if (!name || name.length > SAVED_RIVEN_NAME_MAX || !weaponId || weaponId.length > 120) {
    return NextResponse.json({ error: "Name and weapon are required" }, { status: 400 });
  }
  if (!(RIVEN_MOD_IDS as readonly string[]).includes(modId) || !stats) {
    return NextResponse.json({ error: "Invalid riven" }, { status: 400 });
  }
  // Same rules as the editor: the weapon must take this riven and the roll must be legal.
  const weapon = allWeapons.find((w) => w.id === weaponId);
  const type = weapon ? getRivenWeaponType(weapon) : null;
  if (!type || `riven_${type.toLowerCase()}` !== modId) {
    return NextResponse.json({ error: "This weapon does not take that riven" }, { status: 400 });
  }
  const check = validateRivenStats(stats, type.toLowerCase());
  if (!check.ok) {
    return NextResponse.json({ error: check.errors[0] ?? "Invalid riven" }, { status: 400 });
  }
  const data = {
    name,
    weaponId,
    modId,
    stats: JSON.stringify(stats),
    polarity: normalizeRivenPolarity(typeof body.polarity === "string" ? body.polarity : null),
    drain: clampRivenDrain(typeof body.drain === "number" ? body.drain : NaN),
  };

  if (typeof body.id === "string" && body.id) {
    const existing = await prisma.savedRiven.findUnique({ where: { id: body.id } });
    if (existing && existing.userId !== session.user.id) {
      return NextResponse.json({ error: "You do not own this riven" }, { status: 403 });
    }
    if (existing) {
      const updated = await prisma.savedRiven.update({ where: { id: body.id }, data });
      return NextResponse.json(parseSavedRivenRow(updated));
    }
  }

  const count = await prisma.savedRiven.count({ where: { userId: session.user.id } });
  if (count >= MAX_RIVENS_PER_USER) {
    return NextResponse.json({ error: "Riven library is full" }, { status: 400 });
  }
  const created = await prisma.savedRiven.create({ data: { ...data, userId: session.user.id } });
  return NextResponse.json(parseSavedRivenRow(created));
}
