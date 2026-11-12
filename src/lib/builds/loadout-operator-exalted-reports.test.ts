import { describe, it, expect } from "vitest";
import { modularBuildMatchesLoadoutSlot } from "@/lib/builds/modular-resolve";
import type { ModularBuildData, WeaponBuildData, CompanionBuildData } from "@/lib/builds/build-storage";
import {
  listSavedBuildsForSlot,
  isExaltedCompanionId,
} from "@/lib/builds/loadout-slot-helpers";
import { allWeapons } from "@/data/weapons";
import {
  computeLoadoutAbilityArmorStripPct,
  formatAbilityBuffDebuffBadge,
  getOperatorBuffAbilities,
  resolveAbilitiesWithHelminth,
  resolveWeaponExternalBuffs,
  weaponDamageBuffAbilities,
} from "@/lib/weapons/weapon-external-buffs";
import { getExaltedWeaponsForWarframe } from "@/lib/weapons/exalted-weapons";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { DEFAULT_SIM_PARAMS, Loadout, Weapon } from "@/lib/types";
import { headshotMultiplier } from "@/lib/calc/combat-multipliers";
import { weaponModCapacity } from "@/lib/weapons/weapon-progenitor";
import { encodeLoadoutShare, decodeLoadoutShare } from "@/lib/builds/loadout-share";
import { allWarframes } from "@/data/warframes";

describe("Community Reports Fixes: Amps, Exalted Slots, Operator & Necramechs", () => {
  describe("Report: Modular Amps in Weapon Slots", () => {
    it("disallows modular Amp builds in primary, secondary, and melee slots", () => {
      const ampData: ModularBuildData = {
        name: "177 Eidolon Amp",
        modularType: "amp",
        parts: { prism: "Raplak", scaffold: "Pencha", brace: "Certus" },
        isGilded: true,
      };

      expect(modularBuildMatchesLoadoutSlot(ampData, "primary")).toBe(false);
      expect(modularBuildMatchesLoadoutSlot(ampData, "secondary")).toBe(false);
      expect(modularBuildMatchesLoadoutSlot(ampData, "melee")).toBe(false);
    });

    it("allows modular Zaws in melee slot and Kitguns in primary/secondary slots", () => {
      const zawData: ModularBuildData = {
        name: "Plague Kripath Zaw",
        modularType: "zaw",
        parts: { strike: "zaw_plague_kripath", grip: "zaw_grip_laka", link: "zaw_link_ekwana_jai_2" },
        isGilded: true,
      };
      expect(modularBuildMatchesLoadoutSlot(zawData, "melee")).toBe(true);
      expect(modularBuildMatchesLoadoutSlot(zawData, "primary")).toBe(false);

      const kitgunData: ModularBuildData = {
        name: "Catchmoon Secondary",
        modularType: "kitgun",
        parts: { chamber: "catchmoon_chamber", grip: "grip_haymaker", loader: "loader_splat" },
        isGilded: true,
      };
      expect(modularBuildMatchesLoadoutSlot(kitgunData, "secondary")).toBe(true);
      expect(modularBuildMatchesLoadoutSlot(kitgunData, "melee")).toBe(false);
    });
  });

  describe("Report: Exalted weapons and companions in loadout slots", () => {
    it("identifies Venari and Venari Prime as exalted companions", () => {
      expect(isExaltedCompanionId("venari")).toBe(true);
      expect(isExaltedCompanionId("venari_prime")).toBe(true);
      expect(isExaltedCompanionId("smeeta_kavat")).toBe(false);
      expect(isExaltedCompanionId("carrier_prime")).toBe(false);
      expect(isExaltedCompanionId(undefined)).toBe(false);
    });

    it("filters exalted weapons from standard weapon saved builds", () => {
      const weaponsMap = new Map<string, Weapon>(allWeapons.map((w) => [w.id, w]));
      const exaltedIds = ["arquebex", "ironbride", "exalted_blade", "regulators", "dex_pixia"];

      for (const id of exaltedIds) {
        const w = weaponsMap.get(id);
        if (w) {
          expect(w.isExalted).toBe(true);
        }
      }

      // Catalog archgun/archmelee filtering verifies !w.isExalted
      const normalArchWeapons = allWeapons.filter(
        (w) => (w.category === "archgun" || w.category === "archmelee") && !w.isExalted,
      );
      expect(normalArchWeapons.some((w) => w.id === "arquebex")).toBe(false);
      expect(normalArchWeapons.some((w) => w.id === "ironbride")).toBe(false);
    });
  });

  describe("Report: Necramech Exalted Weapons (Voidrig Arquebex & Bonewidow Ironbride)", () => {
    it("maps Voidrig to Arquebex and Bonewidow to Ironbride", () => {
      const voidrigWeapons = getExaltedWeaponsForWarframe("voidrig", allWeapons);
      expect(voidrigWeapons.map((w) => w.id)).toContain("arquebex");

      const bonewidowWeapons = getExaltedWeaponsForWarframe("bonewidow", allWeapons);
      expect(bonewidowWeapons.map((w) => w.id)).toContain("ironbride");
    });
  });

  describe("Report: Operator Focus School Buffs in Loadout Simulation", () => {
    it("returns correct focus abilities for each school", () => {
      const madurai = getOperatorBuffAbilities("Madurai");
      expect(madurai.map((a) => a.name)).toEqual(["Void Strike", "Sling Strength"]);

      const unairu = getOperatorBuffAbilities("Unairu");
      expect(unairu.map((a) => a.name)).toEqual(["Caustic Strike"]);

      const zenurik = getOperatorBuffAbilities("Zenurik");
      expect(zenurik.map((a) => a.name)).toEqual(["Hardened Wellspring"]);

      const naramon = getOperatorBuffAbilities("Naramon");
      expect(naramon.map((a) => a.name)).toEqual(["Lethal Levitation"]);
    });

    it("formats Operator ability badges clearly", () => {
      expect(formatAbilityBuffDebuffBadge({ name: "Void Strike" }, 1)).toBe("+1000% dmg");
      expect(formatAbilityBuffDebuffBadge({ name: "Sling Strength" }, 1)).toBe("+40% STR");
      expect(formatAbilityBuffDebuffBadge({ name: "Caustic Strike" }, 1)).toBe("-100% armor");
      expect(formatAbilityBuffDebuffBadge({ name: "Hardened Wellspring" }, 1)).toBe("+20% STR");
      expect(formatAbilityBuffDebuffBadge({ name: "Lethal Levitation" }, 1)).toBe("+200% dmg");
    });

    it("resolves Caustic Strike 100% armor strip", () => {
      const strip = computeLoadoutAbilityArmorStripPct(undefined, 1, ["Caustic Strike"]);
      expect(strip).toBe(100);
    });

    it("resolves Madurai Void Strike +1000% damage, additive with Serration (wiki body), and excludes archguns", () => {
      const rifle = allWeapons.find((w) => w.id === "braton")!;
      const buffs = resolveWeaponExternalBuffs(
        rifle,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as never,
          warframeAbilities: [{ name: "Void Strike" } as never],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Void Strike"] },
      );

      const vs = buffs.find((b) => b.label.includes("Void Strike"));
      expect(vs).toBeDefined();
      expect(vs?.damageBonus).toBe(10.0);
      expect(vs?.damageMultBonus).toBeUndefined();

      // Archguns are excluded from Void Strike (per wiki)
      const archgun = allWeapons.find((w) => w.id === "imperator")!;
      const agBuffs = resolveWeaponExternalBuffs(
        archgun,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as never,
          warframeAbilities: [{ name: "Void Strike" } as never],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Void Strike"] },
      );
      expect(agBuffs.some((b) => b.label.includes("Void Strike"))).toBe(false);
    });

    it("resolves Naramon Lethal Levitation +200% base damage bonus", () => {
      const skana = allWeapons.find((w) => w.id === "skana")!;
      const meleeBuffs = resolveWeaponExternalBuffs(
        skana,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as never,
          warframeAbilities: [{ name: "Lethal Levitation" } as never],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Lethal Levitation"] },
      );

      const ll = meleeBuffs.find((b) => b.label.includes("Lethal Levitation"));
      expect(ll).toBeDefined();
      expect(ll?.damageBonus).toBe(2.0);

      // wiki.warframe.com/w/Focus/Naramon: "all equipped weapons (Primary, Secondary, Melee, Amp) as well
      // as Archguns and Exalted Weapons". Arch-melee is not listed; Ironbride is an Exalted Weapon.
      const llOn = (id: string) =>
        resolveWeaponExternalBuffs(
          allWeapons.find((w) => w.id === id)!,
          {
            warframeId: "excalibur",
            warframeStats: { abilityStrength: 1 } as never,
            warframeAbilities: [{ name: "Lethal Levitation" } as never],
          },
          { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Lethal Levitation"] },
        ).some((b) => b.label.includes("Lethal Levitation"));
      expect(llOn("braton")).toBe(true);
      expect(llOn("imperator")).toBe(true);
      expect(llOn("ironbride")).toBe(true);
      expect(llOn("kaszas")).toBe(false);
    });

    it("resolves Madurai Sling Strength (+40% STR) and Zenurik Hardened Wellspring (+20% STR)", () => {
      const loadout: Loadout = {
        id: "test",
        name: "Focus Test",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: {
          warframeId: "excalibur",
          mods: [],
          hasOrokinReactor: true,
          shards: [],
        },
        operatorBuild: {
          focusSchool: "Madurai",
        },
      };

      const base = calcLoadoutStats(loadout, { scenario: "paper" });
      expect(base.warframe?.stats.abilityStrength).toBe(1.0);

      const withSling = calcLoadoutStats(loadout, {
        scenario: "paper",
        simParams: { activeWeaponAbilityBuffs: ["Sling Strength"] },
      });
      expect(withSling.warframe?.stats.abilityStrength).toBeCloseTo(1.4, 2);

      const withWellspring = calcLoadoutStats(loadout, {
        scenario: "paper",
        simParams: { activeWeaponAbilityBuffs: ["Hardened Wellspring"] },
      });
      expect(withWellspring.warframe?.stats.abilityStrength).toBeCloseTo(1.2, 2);
    });
  });

  describe("Report: Exalted weapons innate Orokin Catalyst (60 capacity)", () => {
    it("innately grants 60 mod capacity to exalted weapons regardless of hasCatalyst flag", () => {
      const regulators = allWeapons.find((w) => w.id === "regulators")!;
      expect(regulators.isExalted).toBe(true);

      // Even when hasCatalyst is false, exalted weapons return 60
      expect(weaponModCapacity(regulators, 0, false)).toBe(60);
      expect(weaponModCapacity(regulators, 0, true)).toBe(60);

      // Normal weapons return 30 without catalyst, 60 with catalyst
      const braton = allWeapons.find((w) => w.id === "braton")!;
      expect(weaponModCapacity(braton, 0, false)).toBe(30);
      expect(weaponModCapacity(braton, 0, true)).toBe(60);
    });
  });

  describe("Report: Headshot vs Non-Head Weak Point multipliers", () => {
    it("applies 3x headshot multiplier + headshot bonus on headshots", () => {
      // Body shot: 1.0x
      expect(headshotMultiplier(false, 0, 0, null, false)).toBe(1.0);

      // Headshot (3.0x base humanoid head, plus bonuses)
      const hsNoBonus = headshotMultiplier(true, 0, 0, null, false);
      expect(hsNoBonus).toBe(3.0);

      // Headshot with +30% Deadhead / Target Acquired
      const hsWithDeadhead = headshotMultiplier(true, 0.3, 0, null, false);
      expect(hsWithDeadhead).toBeCloseTo(3.0 * 1.3, 4);

      // Headshot with +50% Weak Point damage (applies at 1.5x on head)
      const hsWithWeakPointBonus = headshotMultiplier(true, 0, 0.5, null, false);
      expect(hsWithWeakPointBonus).toBeCloseTo(3.0 + 1.5 * 0.5, 4);
    });

    it("applies 2x body weak point multiplier on non-head weak points without headshot bonus", () => {
      // Non-head weak point: 2.0x base body weak point
      const wpNoBonus = headshotMultiplier(false, 0, 0, null, true);
      expect(wpNoBonus).toBe(2.0);

      // Non-head weak point gets weak point damage bonus
      const wpWithBonus = headshotMultiplier(false, 0, 0.5, null, true);
      expect(wpWithBonus).toBe(2.5);

      // Non-head weak point does NOT get headshot damage bonus (Deadhead)
      const wpWithDeadhead = headshotMultiplier(false, 0.3, 0, null, true);
      expect(wpWithDeadhead).toBe(2.0);
    });
  });

  describe("Report: Warframe debuffs & armor strip (Reap, Terrify, Tharros Strike)", () => {
    it("scales armor strip from Terrify and Tharros Strike with ability strength", () => {
      const nekros = allWarframes.find((w) => w.id === "nekros")!;
      const terrify = nekros.abilities.find((a) => a.name === "Terrify")!;
      expect(terrify.miscStats?.armorStrip).toBe(0.6);

      // At 100% STR: 60% strip
      expect(computeLoadoutAbilityArmorStripPct([terrify], 1.0, ["Terrify"])).toBe(60);
      // At 167% STR: 100% full armor strip
      expect(computeLoadoutAbilityArmorStripPct([terrify], 1.67, ["Terrify"])).toBe(100);

      const styanax = allWarframes.find((w) => w.id === "styanax")!;
      const tharros = styanax.abilities.find((a) => a.name === "Tharros Strike")!;
      expect(tharros.miscStats?.armorStrip).toBe(0.5);

      // At 100% STR: 50% strip
      expect(computeLoadoutAbilityArmorStripPct([tharros], 1.0, ["Tharros Strike"])).toBe(50);
      // At 200% STR: 100% full strip
      expect(computeLoadoutAbilityArmorStripPct([tharros], 2.0, ["Tharros Strike"])).toBe(100);
    });

    it("resolves Sevagoth Reap +50% damage vulnerability debuff", () => {
      const sevagoth = allWarframes.find((w) => w.id === "sevagoth")!;
      const reap = sevagoth.abilities.find((a) => a.name === "Reap")!;
      expect(reap.miscStats?.damageVulnerability).toBe(0.5);

      const skana = allWeapons.find((w) => w.id === "skana")!;
      const buffs = resolveWeaponExternalBuffs(
        skana,
        {
          warframeId: "sevagoth",
          warframeStats: { abilityStrength: 1.5 } as never,
          warframeAbilities: [reap],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Reap"] },
      );

      const vulnBuff = buffs.find((b) => b.label.includes("Reap"));
      expect(vulnBuff).toBeDefined();
      // 0.5 * 1.5 STR = 0.75 damage multiplier bonus
      expect(vulnBuff?.damageMultBonus).toBeCloseTo(0.75, 2);
    });
  });

  describe("Report: Loadout share encoding preserves operatorBuild", () => {
    it("round-trips operatorBuild focusSchool and amp settings through encodeLoadoutShare", async () => {
      const loadout: Loadout = {
        id: "share-test-1",
        name: "Operator Share Test",
        createdAt: 1000,
        updatedAt: 2000,
        warframeBuild: {
          warframeId: "ash",
          mods: [],
          hasOrokinReactor: true,
          shards: [],
        },
        operatorBuild: {
          focusSchool: "Madurai",
          ampId: "sirocco",
          ampName: "Sirocco",
        },
      };

      const code = await encodeLoadoutShare(loadout);
      expect(code).toBeTruthy();

      const decoded = await decodeLoadoutShare(code!);
      expect(decoded).not.toBeNull();
      expect(decoded?.name).toBe("Operator Share Test");
      expect(decoded?.data.operatorBuild).toBeDefined();
      expect(decoded?.data.operatorBuild?.focusSchool).toBe("Madurai");
      expect(decoded?.data.operatorBuild?.ampId).toBe("sirocco");
    });
  });
});


describe("Loadout combat report: unmodded exalteds, Valkyr Warcry/Paralysis, operator gating", () => {
  it("includes unmodded exalted weapons in the loadout weapon list at base stats", () => {
    const regulators = allWeapons.find((w) => w.id === "regulators")!;
    const stats = calcLoadoutStats(
      {
        id: "unmodded-exalted",
        name: "unmodded-exalted",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "mesa", mods: [], hasOrokinReactor: true, exaltedMods: [] },
      },
      { simParams: DEFAULT_SIM_PARAMS },
    );
    expect(stats.exalted).not.toBeNull();
    expect(stats.exalted!.name).toBe(regulators.name);
    expect(stats.exalted!.stats.fireRate).toBeCloseTo(regulators.fireRate, 3);
    expect(stats.exalted!.stats.criticalChance).toBeCloseTo(regulators.criticalChance, 3);
  });

  it("still applies Amalgam Furax Body Count +45% FR to an unmodded exalted secondary", () => {
    const regulators = allWeapons.find((w) => w.id === "regulators")!;
    const stats = calcLoadoutStats(
      {
        id: "unmodded-furax",
        name: "unmodded-furax",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "mesa", mods: [], hasOrokinReactor: true, exaltedMods: [] },
        meleeBuild: {
          weaponId: "furax",
          mods: [{ modId: "amalgam_furax_body_count", rank: 5, slotIndex: 0 }],
          hasOrokinCatalyst: true,
        },
      },
      { simParams: DEFAULT_SIM_PARAMS },
    );
    expect(stats.exalted!.stats.fireRate).toBeCloseTo(regulators.fireRate * 1.45, 3);
  });

  it("lists Warcry and Paralysis on Valkyr and Valkyr Prime with wiki-scaled badges", () => {
    for (const id of ["valkyr", "valkyr_prime"] as const) {
      const wf = allWarframes.find((w) => w.id === id)!;
      const listed = weaponDamageBuffAbilities(wf.abilities);
      expect(listed.map((a) => a.name)).toEqual(expect.arrayContaining(["Warcry", "Paralysis"]));
      const warcry = wf.abilities.find((a) => a.name === "Warcry")!;
      const paralysis = wf.abilities.find((a) => a.name === "Paralysis")!;
      // wiki.warframe.com/w/Warcry rank 3: +50% Attack Speed, +50% Armor, both × Strength.
      expect(formatAbilityBuffDebuffBadge(warcry, 1, id)).toBe("+50% attack speed, +50% armor");
      expect(formatAbilityBuffDebuffBadge(warcry, 2, id)).toBe("+100% attack speed, +100% armor");
      // wiki.warframe.com/w/Paralysis: 50% melee vuln × STR; 30% Slow × STR, cap 75%.
      expect(formatAbilityBuffDebuffBadge(paralysis, 1, id)).toBe("+50% melee vuln, 30% slow");
      expect(formatAbilityBuffDebuffBadge(paralysis, 3, id)).toBe("+150% melee vuln, 75% slow");
    }
  });

  it("shows Helminth Warcry at 30% attack speed (wiki subsumed value), still × Strength", () => {
    const excal = allWarframes.find((w) => w.id === "excalibur")!;
    // Replace slot 1 (Radial Javelin is typically slot index — use a middle slot).
    const infused = resolveAbilitiesWithHelminth(excal.abilities, "subsume_valkyr", 1, "excalibur");
    const warcry = infused.find((a) => a.name === "Warcry")!;
    expect(warcry.miscStats?.attackSpeedBuff).toBe(0.3);
    expect(formatAbilityBuffDebuffBadge(warcry, 1, "excalibur")).toBe("+30% attack speed, +50% armor");
    expect(formatAbilityBuffDebuffBadge(warcry, 2, "excalibur")).toBe("+60% attack speed, +100% armor");
    expect(weaponDamageBuffAbilities(infused).some((a) => a.name === "Warcry")).toBe(true);
  });

  it("applies Warcry attack speed and Paralysis melee vuln to melee only", () => {
    const valkyr = allWarframes.find((w) => w.id === "valkyr")!;
    const skana = allWeapons.find((w) => w.id === "skana")!;
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const ctx = {
      warframeId: "valkyr",
      warframeStats: { abilityStrength: 1 } as never,
      warframeAbilities: valkyr.abilities,
    };
    const meleeWarcry = resolveWeaponExternalBuffs(
      skana,
      ctx,
      { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Warcry"] },
    ).find((b) => b.label === "Warcry");
    expect(meleeWarcry).toBeDefined();
    expect(meleeWarcry!.fireRateBonus).toBeCloseTo(0.5, 5);
    expect(
      resolveWeaponExternalBuffs(
        braton,
        ctx,
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Warcry"] },
      ).some((b) => b.label === "Warcry"),
    ).toBe(false);

    const meleePara = resolveWeaponExternalBuffs(
      skana,
      ctx,
      { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Paralysis"] },
    ).find((b) => b.label === "Paralysis");
    expect(meleePara).toBeDefined();
    expect(meleePara!.damageMultBonus).toBeCloseTo(0.5, 5);
    expect(
      resolveWeaponExternalBuffs(
        braton,
        ctx,
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Paralysis"] },
      ).some((b) => b.label === "Paralysis"),
    ).toBe(false);

    // × Strength
    const strong = resolveWeaponExternalBuffs(
      skana,
      { ...ctx, warframeStats: { abilityStrength: 2 } as never },
      { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Warcry", "Paralysis"] },
    );
    expect(strong.find((b) => b.label === "Warcry")!.fireRateBonus).toBeCloseTo(1.0, 5);
    expect(strong.find((b) => b.label === "Paralysis")!.damageMultBonus).toBeCloseTo(1.0, 5);
  });

  it("hides operator abilities when no operator (or no focus school) is equipped", () => {
    expect(getOperatorBuffAbilities()).toEqual([]);
    expect(getOperatorBuffAbilities(undefined)).toEqual([]);
    expect(getOperatorBuffAbilities("")).toEqual([]);
    expect(getOperatorBuffAbilities("UnknownSchool")).toEqual([]);
    // Equipped operator still returns only that school (existing school lists unchanged).
    expect(getOperatorBuffAbilities("Madurai").map((a) => a.name)).toEqual(["Void Strike", "Sling Strength"]);
  });
});
