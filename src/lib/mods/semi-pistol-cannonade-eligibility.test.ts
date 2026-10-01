import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

const cannonade = allMods.find((m) => m.id === "semi_pistol_cannonade")!;

function eligible(weaponId: string): boolean {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  return modEligibleForWeaponSlot(
    cannonade,
    "secondary",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

describe("Semi-Pistol Cannonade eligibility", () => {
  it("equips on Vesper 77 (wiki Semi-Auto)", () => {
    expect(allWeapons.find((w) => w.id === "vesper_77")!.triggerType).toBe("Semi");
    expect(eligible("vesper_77")).toBe(true);
  });

  it("equips on Lex / Lex Prime", () => {
    expect(eligible("lex")).toBe(true);
    expect(eligible("lex_prime")).toBe(true);
  });
});
