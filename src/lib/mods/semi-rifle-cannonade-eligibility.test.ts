import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

const cannonade = allMods.find((m) => m.id === "semi_rifle_cannonade")!;

function eligible(weaponId: string): boolean {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  return modEligibleForWeaponSlot(
    cannonade,
    "primary",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

describe("Semi-Rifle Cannonade on snipers", () => {
  it("equips on Rubico Prime and Vectis Prime", () => {
    expect(eligible("rubico_prime")).toBe(true);
    expect(eligible("vectis_prime")).toBe(true);
  });

  it("equips on other semi snipers", () => {
    expect(eligible("rubico")).toBe(true);
    expect(eligible("vectis")).toBe(true);
    expect(eligible("vulkar")).toBe(true);
  });

  it("does not equip on charge/auto sniper-class weapons", () => {
    expect(eligible("lanka")).toBe(false);
    expect(eligible("buzlok")).toBe(false);
  });
});
