import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { warframeAugmentEligibleInBuilder } from "@/lib/mods/warframe-augment-mods";
import type { Weapon } from "@/lib/types";

const furax = allMods.find((m) => m.id === "amalgam_furax_body_count")!;

function meleeProfile(id: string) {
  const weapon = { id, category: "melee", triggerType: "Melee", name: id } as Weapon;
  return getWeaponModProfile(weapon);
}

describe("Amalgam Furax Body Count eligibility + display", () => {
  it("does not appear in warframe builder slots", () => {
    expect(warframeAugmentEligibleInBuilder(furax, "warframe", "mesa_prime")).toBe(false);
  });

  it("equips on Furax / Furax Wraith / MK1-Furax melee", () => {
    for (const id of ["furia", "furia_wraith", "mk1_furax"]) {
      expect(
        modEligibleForWeaponSlot(furax, "melee", "melee", "regular", meleeProfile(id)),
      ).toBe(true);
    }
  });

  it("does not equip on unrelated melee", () => {
    expect(
      modEligibleForWeaponSlot(furax, "melee", "melee", "regular", meleeProfile("skana")),
    ).toBe(false);
  });

  it("shows blast/stagger radius meters instead of Ability Duration", () => {
    const lines = getModStatDisplayLines(furax, furax.maxRank).map((l) => l.atRank);
    expect(lines.some((l) => /\+15m Blast proc and stagger radius/i.test(l))).toBe(true);
    expect(lines.some((l) => /15s Duration/i.test(l) && !/Combo Duration/i.test(l))).toBe(false);
  });
});

describe("Tek Enhance set piece", () => {
  it("exists as companion Ability Duration piece", () => {
    const enhance = allMods.find((m) => m.id === "tek_enhance");
    expect(enhance).toBeDefined();
    expect(enhance!.category).toBe("companion");
    expect(enhance!.stats.abilityDuration).toBe(5);
  });
});
