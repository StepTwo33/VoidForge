import { describe, expect, it } from "vitest";
import { allCompanions, companionsMap } from "@/data/companions";
import { customWeapons } from "@/data/custom-items";
import { allWeapons } from "@/data/weapons";
import { INNATE_POLARITIES } from "@/data/innate-polarities";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { companionHasFixedWeapon, resolveCompanionClawId } from "./companion-weapons";
import { findCompanionByLotusPath, findWeaponByLotusPath } from "@/lib/warframe-arsenal/lotus-resolve";

describe("Venari / Venari Prime companions", () => {
  it("are kavats with wiki stats (WFCD, fandom and wiki.warframe.com agree)", () => {
    expect(companionsMap.get("venari")).toMatchObject({ name: "Venari", type: "kavat", health: 900, shield: 0, armor: 350 });
    expect(companionsMap.get("venari_prime")).toMatchObject({ name: "Venari Prime", type: "kavat", health: 1050, shield: 0, armor: 450 });
    expect(allCompanions.filter((c) => c.id.startsWith("venari"))).toHaveLength(2);
  });

  it("get their own claws plus the posture slot like other kavats", () => {
    const venari = companionsMap.get("venari")!;
    const prime = companionsMap.get("venari_prime")!;
    expect(companionHasFixedWeapon(venari)).toBe(true);
    expect(resolveCompanionClawId(venari)).toBe("venari_claws");
    expect(resolveCompanionClawId(prime)).toBe("venari_prime_claws");
  });

  it("have default polarities penjaga, madurai, vazarin, naramon", () => {
    for (const id of ["venari", "venari_prime"]) {
      expect(INNATE_POLARITIES[`companion:${id}`]).toEqual({ slots: ["penjaga", "madurai", "vazarin", "naramon"] });
    }
  });

  it("Player Sync maps Venari's internal names", () => {
    expect(findCompanionByLotusPath("/Lotus/Powersuits/Khora/Kavat/KhoraKavatPowerSuit")?.id).toBe("venari");
    expect(findCompanionByLotusPath("/Lotus/Powersuits/Khora/Kavat/KhoraPrimeKavatPowerSuit")?.id).toBe("venari_prime");
  });
});

describe("Talons (thrown secondary)", () => {
  const talons = customWeapons.find((w) => w.id === "talons_thrown")!;

  it("was missing from the catalog and does not collide with Valkyr Talons", () => {
    expect(allWeapons.some((w) => w.name === "Talons")).toBe(false);
    expect(allWeapons.find((w) => w.id === "talons")?.name).toBe("Valkyr Talons");
    expect(talons).toMatchObject({ name: "Talons", category: "secondary", blast: 120, magazine: 4, criticalChance: 0.22, statusChance: 0.26 });
  });

  it("models both detonation modes", () => {
    expect(talons.defaultModeLabel).toBe("Mid-Flight Detonation");
    expect(talons.alternateModeStats).toMatchObject({ label: "Embedded Detonation", damage: 250, blast: 250, statusChance: 0.1 });
  });

  it("calculates bare stats", () => {
    const r = calculateWeaponBuild(enrichWeapon(talons), [], modsMap);
    expect(r.totalDamage).toBeCloseTo(120, 3);
    expect(r.criticalChance).toBeCloseTo(0.22, 6);
  });

  it("has Madurai, Madurai defaults and maps from Player Sync", () => {
    expect(INNATE_POLARITIES["weapon:talons_thrown"]).toEqual({ slots: ["madurai", "madurai"] });
    expect(findWeaponByLotusPath("/Lotus/Weapons/Tenno/ThrowingWeapons/U18ThrowingKnives/U18throwingknives")?.id).toBe("talons_thrown");
  });
});
