import { beforeEach, describe, expect, it } from "vitest";
import {
  inferModularLoadoutSlot,
  modularBuildMatchesLoadoutSlot,
  visibleModularTypes,
} from "@/lib/builds/modular-resolve";
import type { ModularBuildData } from "@/lib/types";
import { withLoadoutSlot, type LoadoutEditContext } from "@/lib/builds/loadout-edit-context";
import { getLoadoutModular, withLoadoutModular } from "@/lib/builds/loadout-slot-helpers";
import { getLoadouts } from "@/lib/builds/loadouts";
import { mapModularPartsFromArsenal } from "@/lib/warframe-arsenal/lotus-resolve";
import type { Loadout } from "@/lib/types";
import { readFileSync } from "node:fs";

const ampData: ModularBuildData = {
  modularType: "amp",
  parts: { prism: "amp_raplak", scaffold: "amp_pencha", brace: "amp_anspatha" },
  mods: [],
  hasOrokinCatalyst: false,
};

const kitgunData: ModularBuildData = {
  modularType: "kitgun",
  parts: { chamber: "catchmoon_chamber", grip: "grip_brash", loader: "loader_zip" },
  mods: [],
  hasOrokinCatalyst: false,
};

const ampLoadout = (): Loadout => ({
  id: "1792000000000_amp",
  name: "Legacy Amp slot",
  createdAt: 1,
  updatedAt: 1,
  primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
  modularBuilds: { primary: { ...ampData } },
});

const ctx = (slot: string): LoadoutEditContext => ({
  loadoutId: "1792000000000_amp",
  loadoutName: "Legacy Amp slot",
  kind: "modular",
  slot,
});

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

describe("Amps never occupy a weapon slot", () => {
  it("inferModularLoadoutSlot returns null for an Amp", () => {
    expect(inferModularLoadoutSlot(ampData)).toBeNull();
    expect(inferModularLoadoutSlot(kitgunData)).toBe("primary");
  });

  it("modularBuildMatchesLoadoutSlot rejects Amps for every weapon column", () => {
    expect(modularBuildMatchesLoadoutSlot(ampData, "primary")).toBe(false);
    expect(modularBuildMatchesLoadoutSlot(ampData, "secondary")).toBe(false);
    expect(modularBuildMatchesLoadoutSlot(ampData, "melee")).toBe(false);
  });

  it("hides the Amp type button on a weapon slot, unless a legacy Amp is already loaded", () => {
    expect(visibleModularTypes("kitgun", false)).toEqual(["kitgun", "zaw", "amp"]);
    expect(visibleModularTypes("kitgun", true)).toEqual(["kitgun", "zaw"]);
    expect(visibleModularTypes("zaw", true)).toEqual(["kitgun", "zaw"]);
    expect(visibleModularTypes("amp", true)).toEqual(["kitgun", "zaw", "amp"]);
    expect(visibleModularTypes("amp", false)).toEqual(["kitgun", "zaw", "amp"]);
  });

  it("withLoadoutSlot refuses to write an Amp into a weapon column, and keeps the existing weapon", () => {
    const lo: Loadout = {
      id: "1",
      name: "Clean",
      createdAt: 1,
      updatedAt: 1,
      primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
    };
    const out = withLoadoutSlot(lo, ctx("primary"), ampData);
    expect(out).toEqual(lo);
    expect(out.primaryBuild?.weaponId).toBe("braton_prime");
    expect(out.modularBuilds?.primary).toBeUndefined();
  });

  it("withLoadoutModular also refuses to place an Amp in a weapon column", () => {
    const lo: Loadout = {
      id: "1",
      name: "Clean",
      createdAt: 1,
      updatedAt: 1,
      primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
    };
    const out = withLoadoutModular(lo, "primary", ampData);
    expect(out.modularBuilds?.primary).toBeUndefined();
    expect(out.primaryBuild?.weaponId).toBe("braton_prime");
  });

  it("still writes a kitgun into the matching weapon slot", () => {
    const lo: Loadout = {
      id: "1",
      name: "Clean",
      createdAt: 1,
      updatedAt: 1,
      primaryBuild: { weaponId: "braton_prime", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
    };
    const out = withLoadoutSlot(lo, ctx("primary"), kitgunData);
    expect(out.primaryBuild).toBeUndefined();
    expect(out.modularBuilds?.primary?.modularType).toBe("kitgun");
  });

  it("keeps an existing Amp sitting in a weapon slot (legacy data) and still labels it", () => {
    const lo = ampLoadout();
    expect(getLoadoutModular(lo, "primary")?.modularType).toBe("amp");
    // Clearing still works so the user is not stuck.
    const cleared = withLoadoutModular(lo, "primary", null);
    expect(getLoadoutModular(cleared, "primary")).toBeNull();
  });
});

describe("legacy loadout migration of Amps", () => {
  beforeEach(() => {
    (globalThis as unknown as { window: unknown }).window = globalThis;
    (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
  });

  it("preserves an Amp already stored on a weapon column", () => {
    const raw = [{
      id: "legacy_amp_primary",
      name: "Old",
      createdAt: 1,
      updatedAt: 1,
      modularBuilds: { primary: ampData },
    }];
    localStorage.setItem("overframe_loadouts", JSON.stringify(raw));
    const got = getLoadouts()[0];
    expect(got.modularBuilds?.primary?.modularType).toBe("amp");
    expect(got.operatorBuild?.ampModularBuild).toBeUndefined();
  });

  it("migrates an unslotted legacy Amp onto the Operator instead of Primary", () => {
    const raw = [{
      id: "legacy_unslotted",
      name: "Old",
      createdAt: 1,
      updatedAt: 1,
      modularBuild: { modularType: "amp", parts: { prism: "amp_raplak" }, mods: [], hasOrokinCatalyst: false },
    }];
    localStorage.setItem("overframe_loadouts", JSON.stringify(raw));
    const got = getLoadouts()[0];
    expect(got.modularBuilds?.primary).toBeUndefined();
    expect(got.modularBuild).toBeUndefined();
    expect(got.operatorBuild?.ampModularBuild?.modularType).toBe("amp");
    expect(got.operatorBuild?.ampName).toBeTruthy();
  });
});

describe("arsenal import never assigns an Amp to a weapon column", () => {
  it("mapModularPartsFromArsenal reports a null slot for Amps", () => {
    const mapped = mapModularPartsFromArsenal({
      LWPT_AMP_OCULUS: "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartB",
      LWPT_AMP_CORE: "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Chassis/SentAmpSet1ChassisPartA",
      LWPT_AMP_BRACE: "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set2/Grip/SentAmpSet2GripPartA",
    });
    expect(mapped?.data.modularType).toBe("amp");
    expect(mapped?.slot).toBeNull();
  });
});

describe("modular builder page wiring (Amp type)", () => {
  const src = readFileSync("src/app/modular-builder/page.tsx", "utf8");

  it("no longer offers a Switch-to-Amp warning, and hides Amp on a weapon slot", () => {
    expect(src).not.toMatch(/Switch to Amp/);
    expect(src).not.toMatch(/Saving this Amp will not update this loadout's weapon slot/);
    expect(src).toMatch(/visibleModularTypes/);
    expect(src).toMatch(/typesToShow\.map/);
    expect(src).toMatch(/Amps belong on the Operator, not in a weapon slot/);
    expect(src).toMatch(/can't be saved in a weapon slot/);
  });
});
