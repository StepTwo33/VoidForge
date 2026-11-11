/**
 * Sirocco vs wiki.warframe.com/w/Sirocco + /w/Amp (Fandom agrees): it is an Amp, and "All Amps possess
 * two Arcane Enhancement slots" (Amp Arcanes) — no Primary arcane slot. Module:Weapons/data/modular
 * Normal Attack: 2000 Void, 40% crit ×2, 20% status, fire rate 3, magazine 10, reload 2.
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";

describe("Sirocco", () => {
  const sirocco = allWeapons.find((w) => w.id === "sirocco")!;

  it("has two Amp Arcane slots and no Primary arcane slot", () => {
    expect(sirocco.hasPrimaryArcaneSlot).toBe(false);
    expect(sirocco.hasSecondaryArcaneSlot).toBe(false);
    const cfg = getWeaponArcanes(sirocco);
    expect(cfg.slots).toBe(2);
    expect(cfg.label).toBe("Amp Arcane");
  });

  it("uses the wiki Normal Attack stats", () => {
    expect(sirocco).toMatchObject({
      category: "amp",
      void: 2000,
      criticalChance: 0.4,
      criticalMultiplier: 2,
      statusChance: 0.2,
      fireRate: 3,
      magazine: 10,
      reloadTime: 2,
      modSlots: 0,
    });
  });
});
