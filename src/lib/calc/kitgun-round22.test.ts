import { describe, it, expect } from "vitest";
import { allMods } from "@/data/mods";
import { kitgunChambers, kitgunGrips, kitgunLoaders, buildKitgun, kitgunWeaponClass } from "@/data/modular-weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { applyAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { allWeapons } from "@/data/weapons";

// Hand-worked checks for the Round 22 kitgun fixes. Source: wiki.warframe.com Module:Weapons/data/modular
// (per-slot trigger, multishot, AmmoCost, ForcedProcs, tags), Module:Modular/data (grip tables) and the
// Tombfinger page (grip charge times / charged explosion). Verified 2026-10-27.
const mm = new Map(allMods.map((m) => [m.id, m]));
const ch = (id: string) => kitgunChambers.find((c) => c.id === `${id}_chamber`)!;
const gr = (id: string) => kitgunGrips.find((g) => g.id === `grip_${id}`)!;
const zip = kitgunLoaders.find((l) => l.id === "loader_zip")!;
const kit = (c: string, g: string) => buildKitgun(ch(c), gr(g), zip);
const calc = (w: ReturnType<typeof kit>) => calculateWeaponBuild(w, [], mm);

const PRIMARY_GRIPS = ["brash", "palmaris", "shrewd", "steadyslam", "tremor"];
const SECONDARY_GRIPS = ["gibber", "ramble", "ulnaris", "lovetap", "haymaker"];

describe("Round 22: per-slot trigger (all 12 chamber x slot records)", () => {
  const expected: Record<string, [string, string]> = {
    // chamber: [secondary, primary]
    catchmoon: ["Semi-Auto", "Auto"],
    sporelacer: ["Semi-Auto", "Auto"],
    tombfinger: ["Semi-Auto", "Charge"],
    rattleguts: ["Auto", "Auto"],
    gaze: ["Held", "Held"],
    vermisplicer: ["Held", "Held"],
  };
  for (const [c, [sec, pri]] of Object.entries(expected)) {
    it(`${c}: secondary ${sec}, primary ${pri}`, () => {
      for (const g of SECONDARY_GRIPS) expect(kit(c, g).triggerType, `${c}/${g}`).toBe(sec);
      for (const g of PRIMARY_GRIPS) expect(kit(c, g).triggerType, `${c}/${g}`).toBe(pri);
    });
  }
});

describe("Round 22: beam kitguns (Gaze / Vermisplicer)", () => {
  it("primary fire rate is 12 on every primary grip (wiki Module:Modular/data), same as secondary", () => {
    for (const c of ["gaze", "vermisplicer"]) {
      for (const g of PRIMARY_GRIPS) expect(kit(c, g).fireRate, `${c}/${g}`).toBe(12);
      for (const g of SECONDARY_GRIPS) expect(kit(c, g).fireRate, `${c}/${g}`).toBe(12);
    }
  });

  it("ammo cost is 0.5 per tick for beams in both slots, 1 for everything else", () => {
    for (const c of kitgunChambers) for (const g of kitgunGrips) {
      const w = buildKitgun(c, g, zip);
      const beam = c.id === "gaze_chamber" || c.id === "vermisplicer_chamber";
      expect(w.ammoCost ?? 1, `${c.id}/${g.id}`).toBe(beam ? 0.5 : 1);
    }
  });

  it("Gaze Brash unmodded burst DPS = 29 dmg x 12 ticks/s x (1 + 0.25 CC x (2.0 - 1)) = 435", () => {
    const w = kit("gaze", "brash");
    expect(w.damage).toBe(29);
    expect(calc(w).burstDps).toBeCloseTo(29 * 12 * 1.25, 1);
  });

  it("0.5 ammo/tick doubles Gaze's sustained window: 23 mag / (12 x 0.5) = 3.833 s of fire", () => {
    const w = kit("gaze", "brash");
    expect(w.magazine).toBe(23);
    const s = calc(w);
    const fireTime = 23 / (12 * 0.5);
    // sustained = burst x fireTime / (fireTime + reload 0.9) (Zip loader)
    expect(s.sustainedDps).toBeCloseTo(s.burstDps * (fireTime / (fireTime + zip.reloadTime)), 0);
  });

  it("Vermisplicer innate multishot 5 applies to the secondary only", () => {
    for (const g of SECONDARY_GRIPS) expect(kit("vermisplicer", g).multishot, g).toBe(5);
    for (const g of PRIMARY_GRIPS) expect(kit("vermisplicer", g).multishot, g).toBe(1);
    for (const c of kitgunChambers) {
      if (c.id === "vermisplicer_chamber") continue;
      for (const g of kitgunGrips) expect(buildKitgun(c, g, zip).multishot, `${c.id}/${g.id}`).toBe(1);
    }
  });

  it("Vermisplicer Haymaker secondary: 18 x 12 x 1.25 crit x 5 tendrils = 1350 burst", () => {
    const w = kit("vermisplicer", "haymaker");
    expect(w.damage).toBe(18);
    expect(calc(w).burstDps).toBeCloseTo(18 * 12 * 1.25 * 5, 0);
  });
});

describe("Round 22: forced procs (modelled like other weapons' forcedProcs)", () => {
  it("Catchmoon and Tombfinger force Impact in both slots; no other chamber does", () => {
    for (const c of kitgunChambers) for (const g of kitgunGrips) {
      const w = buildKitgun(c, g, zip);
      const forced = c.id === "catchmoon_chamber" || c.id === "tombfinger_chamber";
      expect(w.forcedProcs ?? [], `${c.id}/${g.id}`).toEqual(forced ? ["impact"] : []);
    }
  });

  it("a forced Impact proc is added to the status list at 100% chance and adds no damage", () => {
    const withForced = calc(kit("catchmoon", "gibber"));
    const impact = withForced.statusProcs.filter((p) => p.type === "impact" && p.chance === 1);
    expect(impact.length).toBe(1);
    const stripped = { ...kit("catchmoon", "gibber"), forcedProcs: undefined };
    expect(calc(stripped as ReturnType<typeof kit>).burstDps).toBeCloseTo(withForced.burstDps, 6);
  });
});

describe("Round 22: Tombfinger primary charge (wiki grip notes)", () => {
  const rows: Array<[string, number, number]> = [
    // grip, charge time (s), charged explosion (Radiation)
    ["brash", 0.5, 412],
    ["palmaris", 0.5, 417],
    ["shrewd", 0.8, 422],
    ["steadyslam", 1.1, 461],
    ["tremor", 1.4, 490],
  ];
  for (const [g, chargeTime, aoe] of rows) {
    it(`${g}: ${chargeTime}s charge, ${aoe} Radiation explosion, 6.2 m with 70% falloff`, () => {
      const w = kit("tombfinger", g);
      expect(w.chargeTime).toBe(chargeTime);
      expect(w.chargeMode).toBe("standard");
      expect(w.radialAttacks).toHaveLength(1);
      const r = w.radialAttacks![0];
      expect(r.radiation).toBe(aoe);
      expect(r.totalDamage).toBe(aoe);
      expect(r.radius).toBe(6.2);
      expect(r.falloffReduction).toBe(0.7);
      // effective fire rate = 1 / (chargeTime + 1 / fireRate)
      const s = calc(w);
      expect(s.effectiveFireRate).toBeCloseTo(1 / (chargeTime + 1 / w.fireRate), 3);
    });
  }

  it("Brash unmodded: EFR = 1/(0.5 + 1/3.77) = 1.3068, radial avg = 412 x (1 - 0.7/2) = 267.8", () => {
    const w = kit("tombfinger", "brash");
    expect(w.fireRate).toBe(3.77);
    const s = calc(w);
    expect(s.effectiveFireRate).toBeCloseTo(1.3068, 3);
    const rad = s.radialAttacks![0];
    expect(rad.avgDamage).toBeCloseTo(267.8, 1);
    const avgCrit = 1 + s.criticalChance * (s.criticalMultiplier - 1);
    expect(rad.burstDps).toBeCloseTo(267.8 * (1 / (0.5 + 1 / 3.77)) * avgCrit, 0);
  });

  it("Tremor is the slowest: EFR = 1/(1.4 + 1/2.13) = 0.5349", () => {
    expect(calc(kit("tombfinger", "tremor")).effectiveFireRate).toBeCloseTo(0.5349, 3);
  });

  it("quick shot (alternate mode) is an instant tap: no charge delay, no charged explosion, table fire rate", () => {
    const w = kit("tombfinger", "brash");
    const quick = applyAlternateMode(w, 0);
    expect(quick.chargeTime).toBe(0);
    expect(quick.radialAttacks).toEqual([]);
    expect(calc(quick).effectiveFireRate).toBeCloseTo(3.77, 3);
  });

  it("secondary Tombfinger has no charge or radial; other chambers have none in either slot", () => {
    for (const g of SECONDARY_GRIPS) {
      const w = kit("tombfinger", g);
      expect(w.chargeTime, g).toBeUndefined();
      expect(w.radialAttacks, g).toBeUndefined();
    }
    for (const c of kitgunChambers) {
      if (c.id === "tombfinger_chamber") continue;
      for (const g of kitgunGrips) expect(buildKitgun(c, g, zip).radialAttacks, `${c.id}/${g.id}`).toBeUndefined();
    }
  });

  it("Tombfinger AOE tag is applied in both slots (wiki chamber tags: PROJECTILE, AOE, MODULAR_GUN, SEMI_AUTO)", () => {
    for (const g of kitgunGrips) {
      const tags = getWeaponModProfile(kit("tombfinger", g.id.replace("grip_", ""))).tags;
      expect(tags.has("AOE"), g.id).toBe(true);
      expect(tags.has("MODULAR_GUN"), g.id).toBe(true);
    }
  });
});

describe("Round 22: riven pool (wiki 'Pistol / Kitgun')", () => {
  it("every built kitgun, primary or secondary, uses the Pistol riven type", () => {
    for (const c of kitgunChambers) for (const g of kitgunGrips) {
      expect(getRivenWeaponType(buildKitgun(c, g, zip)), `${c.id}/${g.id}`).toBe("Pistol");
    }
  });

  it("ordinary rifles / shotguns / pistols keep their own riven pools", () => {
    const type = (id: string) => getRivenWeaponType(allWeapons.find((w) => w.id === id)!);
    expect(type("rubico")).toBe("Rifle");
    expect(type("strun")).toBe("Shotgun");
    expect(type("lex")).toBe("Pistol");
  });

  it("kitgunWeaponClass labels the mod class (separate from the riven pool)", () => {
    expect(kitgunWeaponClass(kit("sporelacer", "brash"))).toBe("Shotgun");
    expect(kitgunWeaponClass(kit("catchmoon", "brash"))).toBe("Shotgun");
    expect(kitgunWeaponClass(kit("tombfinger", "brash"))).toBe("Rifle");
    expect(kitgunWeaponClass(kit("catchmoon", "gibber"))).toBe("Pistol");
  });
});
