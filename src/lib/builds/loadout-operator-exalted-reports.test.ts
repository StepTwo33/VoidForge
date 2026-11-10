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
  resolveWeaponExternalBuffs,
} from "@/lib/weapons/weapon-external-buffs";
import { getExaltedWeaponsForWarframe } from "@/lib/weapons/exalted-weapons";
import { DEFAULT_SIM_PARAMS, Weapon } from "@/lib/types";

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
      expect(madurai.map((a) => a.name)).toEqual(["Void Strike"]);

      const unairu = getOperatorBuffAbilities("Unairu");
      expect(unairu.map((a) => a.name)).toEqual(["Caustic Strike"]);

      const zenurik = getOperatorBuffAbilities("Zenurik");
      expect(zenurik.map((a) => a.name)).toEqual(["Hardened Wellspring"]);

      const naramon = getOperatorBuffAbilities("Naramon");
      expect(naramon.map((a) => a.name)).toEqual(["Lethal Levitation"]);
    });

    it("formats Operator ability badges clearly", () => {
      expect(formatAbilityBuffDebuffBadge({ name: "Void Strike" }, 1)).toBe("+1000% dmg");
      expect(formatAbilityBuffDebuffBadge({ name: "Caustic Strike" }, 1)).toBe("-100% armor");
      expect(formatAbilityBuffDebuffBadge({ name: "Hardened Wellspring" }, 1)).toBe("+20% STR");
      expect(formatAbilityBuffDebuffBadge({ name: "Lethal Levitation" }, 1)).toBe("+200% melee");
    });

    it("resolves Caustic Strike 100% armor strip", () => {
      const strip = computeLoadoutAbilityArmorStripPct(undefined, 1, ["Caustic Strike"]);
      expect(strip).toBe(100);
    });

    it("resolves Madurai Void Strike +1000% damage bonus", () => {
      const rifle = allWeapons.find((w) => w.id === "braton")!;
      const buffs = resolveWeaponExternalBuffs(
        rifle,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as any,
          warframeAbilities: [{ name: "Void Strike" } as any],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Void Strike"] },
      );

      const vs = buffs.find((b) => b.label.includes("Void Strike"));
      expect(vs).toBeDefined();
      expect(vs?.damageBonus).toBe(10.0);
    });

    it("resolves Naramon Lethal Levitation +200% melee base damage bonus only on melee", () => {
      const skana = allWeapons.find((w) => w.id === "skana")!;
      const meleeBuffs = resolveWeaponExternalBuffs(
        skana,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as any,
          warframeAbilities: [{ name: "Lethal Levitation" } as any],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Lethal Levitation"] },
      );

      const ll = meleeBuffs.find((b) => b.label.includes("Lethal Levitation"));
      expect(ll).toBeDefined();
      expect(ll?.damageBonus).toBe(2.0);

      // Does not apply to rifle
      const rifle = allWeapons.find((w) => w.id === "braton")!;
      const gunBuffs = resolveWeaponExternalBuffs(
        rifle,
        {
          warframeId: "excalibur",
          warframeStats: { abilityStrength: 1 } as any,
          warframeAbilities: [{ name: "Lethal Levitation" } as any],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Lethal Levitation"] },
      );
      expect(gunBuffs.some((b) => b.label.includes("Lethal Levitation"))).toBe(false);
    });
  });
});
