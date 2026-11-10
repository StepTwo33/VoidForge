import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { clampRivenDrain, normalizeRivenPolarity, validateRivenStats } from "@/lib/riven/riven-validation";
import { getRivenWeaponType, rivenModMatchesWeapon } from "@/lib/weapons/riven-weapon-type";
import {
  getRivenBaseWeapon,
  getRivenFamilyWeaponIds,
  resolveRivenWeapon,
} from "@/lib/weapons/riven-family";
import {
  RIVEN_MOD_IDS,
  SAVED_RIVEN_NAME_MAX,
  parseSavedRivenRow,
  sanitizeRivenMasteryRank,
  sanitizeRivenRerolls,
  sanitizeRivenStats,
} from "@/lib/riven/saved-rivens";
import { logServerError } from "@/lib/log-server-error";
import { withSqliteSchemaRetry } from "@/lib/sqlite-schema-repair";

const MAX_RIVENS_PER_USER = 500;

// GET /api/rivens?weaponId=braton — the signed-in user's saved rivens (Round 54).
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const weaponId = req.nextUrl.searchParams.get("weaponId");
    const familyIds = weaponId ? getRivenFamilyWeaponIds(weaponId) : null;
    const rows = await withSqliteSchemaRetry(() =>
      prisma.savedRiven.findMany({
        where: { userId: session.user.id, ...(familyIds ? { weaponId: { in: familyIds } } : {}) },
        orderBy: { updatedAt: "desc" },
      }),
    );
    return NextResponse.json(rows.map(parseSavedRivenRow));
  } catch (e) {
    logServerError("GET /api/rivens", e);
    return NextResponse.json({ error: "Failed to load saved rivens" }, { status: 500 });
  }
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
  const weapon = resolveRivenWeapon(weaponId);
  if (!weapon || !rivenModMatchesWeapon(modId, weapon)) {
    return NextResponse.json({ error: "This weapon does not take that riven" }, { status: 400 });
  }
  const checkPool = (getRivenWeaponType(weapon) ?? "Rifle").toLowerCase();
  const check = validateRivenStats(stats, checkPool);
  if (!check.ok) {
    return NextResponse.json({ error: check.errors[0] ?? "Invalid riven" }, { status: 400 });
  }
  const baseWeapon = getRivenBaseWeapon(weapon);
  const canonicalWeaponId = baseWeapon?.id ?? weapon.id;

  const data = {
    name,
    weaponId: canonicalWeaponId,
    modId,
    stats: JSON.stringify(stats),
    polarity: normalizeRivenPolarity(typeof body.polarity === "string" ? body.polarity : null),
    drain: clampRivenDrain(typeof body.drain === "number" ? body.drain : NaN),
    // Only written when sent, so an older client never blanks values another device stored.
    ...("rerolls" in body ? { rerolls: sanitizeRivenRerolls(body.rerolls) } : {}),
    ...("masteryRank" in body ? { masteryRank: sanitizeRivenMasteryRank(body.masteryRank) } : {}),
  };

  try {
    return await withSqliteSchemaRetry(async () => {
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
      const requestedId = typeof body.id === "string" ? body.id.trim() : "";
      const created = await prisma.savedRiven.create({
        data: {
          ...data,
          userId: session.user.id,
          ...(requestedId ? { id: requestedId } : {}),
        },
      });
      return NextResponse.json(parseSavedRivenRow(created));
    });
  } catch (e) {
    logServerError("POST /api/rivens", e);
    return NextResponse.json({ error: "Failed to save riven" }, { status: 500 });
  }
}
