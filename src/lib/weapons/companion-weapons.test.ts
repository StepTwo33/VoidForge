import { describe, expect, it } from "vitest";
import { allCompanions } from "@/data/companions";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import { getCompanionWeapons, modFitsCompanionWeapon } from "@/lib/weapons/companion-weapons";
import type { Weapon } from "@/lib/types";

const beastClaws: Weapon[] = [
  {
    id: "vizier_claws",
    name: "Vizier Claws",
    category: "beast_claw",
    companionType: "predasite",
    damage: 100,
    fireRate: 1,
    criticalChance: 0.1,
    criticalMultiplier: 2,
    statusChance: 0.1,
    triggerType: "Melee",
  },
  {
    id: "pharaoh_claws",
    name: "Pharaoh Claws",
    category: "beast_claw",
    companionType: "predasite",
    damage: 100,
    fireRate: 1,
    criticalChance: 0.1,
    criticalMultiplier: 2,
    statusChance: 0.1,
    triggerType: "Melee",
  },
  {
    id: "medjay_claws",
    name: "Medjay Claws",
    category: "beast_claw",
    companionType: "predasite",
    damage: 100,
    fireRate: 1,
    criticalChance: 0.1,
    criticalMultiplier: 2,
    statusChance: 0.1,
    triggerType: "Melee",
  },
];

describe("getCompanionWeapons", () => {
  it("returns only the matching predasite claws per breed", () => {
    const vizier = allCompanions.find((c) => c.id === "vizier_predasite")!;
    const pharaoh = allCompanions.find((c) => c.id === "pharaoh_predasite")!;
    const medjay = allCompanions.find((c) => c.id === "medjay_predasite")!;

    expect(getCompanionWeapons(vizier, beastClaws).map((w) => w.id)).toEqual(["vizier_claws"]);
    expect(getCompanionWeapons(pharaoh, beastClaws).map((w) => w.id)).toEqual(["pharaoh_claws"]);
    expect(getCompanionWeapons(medjay, beastClaws).map((w) => w.id)).toEqual(["medjay_claws"]);
  });
});

describe("companion weapon mod pool", () => {
  const byId = new Map(allMods.map((m) => [m.id, m]));

  it("gives Verglas rifle mods, not companion health or bonds", () => {
    const verglas = allWeapons.find((w) => w.id === "verglas")!;
    expect(modFitsCompanionWeapon(byId.get("enhanced_vitality")!, verglas)).toBe(false);
    expect(modFitsCompanionWeapon(byId.get("aerial_bond")!, verglas)).toBe(false);
    expect(modFitsCompanionWeapon(byId.get("guardian")!, verglas)).toBe(false);
    expect(modFitsCompanionWeapon(byId.get("fired_up")!, verglas)).toBe(true);
    const rifle = allMods.find((m) => m.category === "rifle" && m.subCategory !== "riven");
    expect(rifle && modFitsCompanionWeapon(rifle, verglas)).toBe(true);
  });

  it("gives Sweeper shotgun mods and claws only claw mods", () => {
    const sweeper = allWeapons.find((w) => w.id === "sweeper")!;
    expect(modFitsCompanionWeapon(byId.get("enhanced_vitality")!, sweeper)).toBe(false);
    const shotgun = allMods.find((m) => m.category === "shotgun");
    expect(shotgun && modFitsCompanionWeapon(shotgun, sweeper)).toBe(true);

    const claws = beastClaws[0];
    expect(modFitsCompanionWeapon(byId.get("enhanced_vitality")!, claws)).toBe(false);
    expect(modFitsCompanionWeapon(byId.get("claw_bite")!, claws)).toBe(true);
  });
});

describe("Hysterical Assault", () => {
  it("is a warframe Exilus mod", () => {
    expect(isWarframeExilusMod(byIdUnsafe())).toBe(true);
  });
});

function byIdUnsafe() {
  const mod = allMods.find((m) => m.id === "hysterical_assault");
  if (!mod) throw new Error("missing hysterical_assault");
  return mod;
}
