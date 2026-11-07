import { describe, expect, it } from "vitest";
import { allCompanions } from "@/data/companions";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import {
  getCompanionWeapons,
  modFitsCompanionWeapon,
  resolvePreferredCompanionForWeapon,
} from "@/lib/weapons/companion-weapons";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { searchBuildCatalog } from "@/lib/builds/build-search";
import { listDiscoverCatalogItems } from "@/lib/builds/discover-subtypes";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";
import { filterPickerMods } from "@/components/mod-picker-filter";
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

  it("includes Verglas and Verglas Prime on Sentinels & MOAs, and restricts Deconstructor to Helios", () => {
    const effective = getEffectiveWeapons();
    const nautilus = allCompanions.find((c) => c.id === "nautilus")!;
    const nautilusPrime = allCompanions.find((c) => c.id === "nautilus_prime")!;
    const helios = allCompanions.find((c) => c.id === "helios")!;
    const lambeo = allCompanions.find((c) => c.id === "lambeo")!;

    const nautilusWeapons = getCompanionWeapons(nautilus, effective).map((w) => w.id);
    expect(nautilusWeapons).toContain("verglas");
    expect(nautilusWeapons).toContain("verglas_prime");
    expect(nautilusWeapons).not.toContain("deconstructor");
    expect(nautilusWeapons).not.toContain("deconstructor_prime");

    const moaWeapons = getCompanionWeapons(lambeo, effective).map((w) => w.id);
    expect(moaWeapons).toContain("verglas");
    expect(moaWeapons).toContain("verglas_prime");
    expect(moaWeapons).not.toContain("deconstructor");

    const heliosWeapons = getCompanionWeapons(helios, effective).map((w) => w.id);
    expect(heliosWeapons).toContain("deconstructor");
    expect(heliosWeapons).toContain("deconstructor_prime");
    expect(heliosWeapons).toContain("verglas");

    const verglas = effective.find((w) => w.id === "verglas")!;
    const verglasPrime = effective.find((w) => w.id === "verglas_prime")!;
    const deconstructor = effective.find((w) => w.id === "deconstructor")!;
    expect(resolvePreferredCompanionForWeapon(verglas, allCompanions)?.id).toBe("nautilus");
    expect(resolvePreferredCompanionForWeapon(verglasPrime, allCompanions)?.id).toBe(nautilusPrime.id);
    expect(resolvePreferredCompanionForWeapon(deconstructor, allCompanions)?.id).toBe("helios");
  });

  it("surfaces Verglas and Verglas Prime across search and Discover weapon/companion sections", () => {
    const matches = searchBuildCatalog("verglas", 5);
    expect(matches.map((m) => m.name)).toEqual(["Verglas", "Verglas Prime"]);
    expect(matches[0]).toEqual({ id: "weapon:verglas", name: "Verglas", type: "companion" });
    expect(matches[1]).toEqual({ id: "weapon:verglas_prime", name: "Verglas Prime", type: "companion" });

    for (const [type, slot] of [
      ["weapon", "all"],
      ["weapon", "companion_weapon"],
      ["companion", "all"],
      ["companion", "companion_weapon"],
    ] as const) {
      const items = listDiscoverCatalogItems(type, slot);
      expect(items.some((i) => i.id === "weapon:verglas"), `${type}/${slot} verglas`).toBe(true);
      expect(items.some((i) => i.id === "weapon:verglas_prime"), `${type}/${slot} verglas_prime`).toBe(true);
    }

    const display = resolveBuildItemDisplay("companion", "weapon:verglas_prime");
    expect(display.itemName).toBe("Verglas Prime");
    expect(display.typeLabel).toBe("Companion");
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

    const rivenMod = byId.get("companion_weapon_riven_mod")!;
    expect(modFitsCompanionWeapon(rivenMod, verglas)).toBe(true);

    const pool = allMods.filter((m) => modFitsCompanionWeapon(m, verglas));
    expect(pool.some((m) => m.id === "companion_weapon_riven_mod")).toBe(true);

    const filtered = filterPickerMods({
      mods: pool,
      category: "_prefiltered",
      slotType: "regular",
      search: "",
      weaponCategory: verglas.category,
      weapon: verglas,
    });
    expect(filtered.some((m) => m.id === "companion_weapon_riven_mod")).toBe(true);
  });

  it("gives Sweeper shotgun mods and claws only claw mods", () => {
    const sweeper = allWeapons.find((w) => w.id === "sweeper")!;
    expect(modFitsCompanionWeapon(byId.get("enhanced_vitality")!, sweeper)).toBe(false);
    const shotgun = allMods.find((m) => m.category === "shotgun");
    expect(shotgun && modFitsCompanionWeapon(shotgun, sweeper)).toBe(true);

    const claws = beastClaws[0];
    expect(modFitsCompanionWeapon(byId.get("enhanced_vitality")!, claws)).toBe(false);
    expect(modFitsCompanionWeapon(byId.get("bite")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("bell_ringer")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("shock_collar")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("shocking_claws")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("burning_claws")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("chilling_claws")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("sepsis_claws")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("flame_gland")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("frost_jaw")!, claws)).toBe(true);
    expect(modFitsCompanionWeapon(byId.get("venom_teeth")!, claws)).toBe(true);
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
