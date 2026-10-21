import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { allMods } from "@/data/mods";
import { warframesMap } from "@/data/warframes";
import { allHelminthAbilities } from "@/data/helminth";
import { allCompanions } from "@/data/companions";
import { calculateWarframeBuild, calculateWeaponBuild } from "@/lib/calc/calculator";

// Values from wiki Module:Weapons/data, Module:Ability/data, Module:Mods/data,
// Module:Warframes/data and Module:Companions/data (checked 2026-10-14).
const mm = new Map(allMods.map((m) => [m.id, m]));
const w = (id: string) => allWeapons.find((x) => x.id === id)!;

describe("accuracy-4 weapon data", () => {
  it.each([
    ["scourge", 2.5], ["scourge_prime", 2.2], ["javlok", 1.9], ["tenet_plinx", 1.3],
    ["kuva_kraken", 1.5], ["efv_8_mars", 1.7], ["nagantaka", 2.3], ["nagantaka_prime", 2.3],
    ["tenet_tetra", 2.2], ["zenith", 1.6], ["ferrox", 1.8], ["tenet_ferrox", 1.8],
    ["catabolyst", 1.7], ["coda_catabolyst", 1.7], ["riot_848", 1.2],
  ] as const)("%s reload %s", (id, rl) => expect(w(id).reloadTime).toBe(rl));

  it("crit / status / fire rate match the attack VF models", () => {
    expect(w("lanka").criticalChance).toBe(0.25); // Charged Shot
    expect(w("kuva_hind").criticalChance).toBe(0.21); // Auto mode
    expect(w("drakgoon").criticalChance).toBe(0.075); // Charged Shot
    expect(w("kuva_drakgoon").criticalChance).toBe(0.21); // Charged Shot
    expect(w("rakta_ballistica").statusChance).toBe(0.05); // Burst Shot
    expect(w("aksondol").fireRate).toBe(4);
    expect(w("ripkas").fireRate).toBe(0.883);
  });

  it("Sirocco deals Void, not Tau", () => {
    const s = calculateWeaponBuild(w("sirocco"), [], mm);
    expect(s.elements).toEqual([{ type: "void", value: 2000 }]);
  });

  it("no-magazine exalted weapons", () => {
    for (const id of ["regulators", "regulators_prime", "grimoire"]) expect(w(id).magazine).toBe(0);
  });
});

describe("accuracy-4 other data", () => {
  it("ability costs", () => {
    expect(warframesMap.get("banshee")!.abilities[3].energyCost).toBe(75);
    expect(warframesMap.get("titania")!.abilities[1].energyCost).toBe(25);
    const h = (n: string) => allHelminthAbilities.find((x) => x.name === n)!.energyCost;
    expect([h("Eclipse"), h("Larva"), h("Roar"), h("Warcry")]).toEqual([25, 25, 75, 75]);
  });
  it("Primed Streamline is not in the catalog (wiki.warframe.com: Retrieved Content, unavailable)", () => {
    expect(mm.get("primed_streamline")).toBeUndefined();
  });
  it("Narin rank-30 energy 290, Adarza shield 230", () => {
    expect(calculateWarframeBuild(warframesMap.get("narin")!, [], mm).baseEnergy).toBe(290);
    expect(allCompanions.find((c) => c.id === "adarza")!.shield).toBe(230);
  });
});
