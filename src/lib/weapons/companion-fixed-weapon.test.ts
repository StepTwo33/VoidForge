import { describe, expect, it } from "vitest";
import {
  COMPANION_WEAPON_POSTURE_SLOT_INDEX,
  COMPANION_WEAPON_REGULAR_SLOT_COUNT,
  companionHasFixedWeapon,
  isCompanionPostureMod,
} from "./companion-weapons";

describe("beast companion weapons (claws + posture)", () => {
  it("Kavats/Kubrows/Predasites/Vulpaphylas have built-in claws; robotic companions can change weapon", () => {
    for (const type of ["kavat", "kubrow", "predasite", "vulpaphyla"]) {
      expect(companionHasFixedWeapon({ type } as never)).toBe(true);
    }
    for (const type of ["sentinel", "moa", "hound"]) {
      expect(companionHasFixedWeapon({ type } as never)).toBe(false);
    }
    expect(companionHasFixedWeapon(null)).toBe(false);
  });

  it("posture slot sits after the 8 regular claw slots", () => {
    expect(COMPANION_WEAPON_REGULAR_SLOT_COUNT).toBe(8);
    expect(COMPANION_WEAPON_POSTURE_SLOT_INDEX).toBe(8);
  });

  it("recognises posture mods", () => {
    expect(isCompanionPostureMod({ id: "elusive_posture", name: "Elusive Posture" })).toBe(true);
    expect(isCompanionPostureMod({ id: "x", name: "Assassin Posture" })).toBe(true);
    expect(isCompanionPostureMod({ id: "bite", name: "Bite" })).toBe(false);
  });
});

describe("data coverage", async () => {
  const { allCompanions } = await import("@/data/companions");
  const { allMods } = await import("@/data/mods");
  const { getEffectiveWeapons } = await import("@/lib/weapons/effective-data");
  const allWeapons = getEffectiveWeapons();
  const { resolveCompanionClawId, resolveDefaultCompanionWeapon } = await import("./companion-weapons");

  it("every beast companion auto-resolves its built-in claws", () => {
    const missing = allCompanions
      .filter((c) => companionHasFixedWeapon(c))
      .filter((c) => {
        const id = resolveCompanionClawId(c);
        return !(id && allWeapons.some((w) => w.id === id)) && !resolveDefaultCompanionWeapon(c, allWeapons);
      })
      .map((c) => c.name);
    expect(missing).toEqual([]);
  });

  it("posture mods exist in the mod list", () => {
    expect(allMods.filter((m) => isCompanionPostureMod(m)).length).toBeGreaterThanOrEqual(5);
  });
});
