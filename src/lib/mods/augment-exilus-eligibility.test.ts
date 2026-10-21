import { describe, expect, it } from "vitest";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import {
  getAugmentModIdsForWarframe,
  warframeAugmentEligibleInBuilder,
} from "@/lib/mods/warframe-augment-mods";

// Both wikis' mod pages call these "Warframe Augment / Exilus Mod" (R10-B).
const CASES: Array<[modId: string, frame: string, other: string]> = [
  ["augment_saryn_revealing_spores", "saryn", "excalibur"],
  ["augment_grendel_catapult", "grendel", "rhino"],
  ["augment_nova_escape_velocity", "nova_prime", "loki"],
  ["ironclad_flight", "titania", "nezha"],
  ["controlled_slide", "nezha", "excalibur"],
  ["controlled_slide", "nezha_prime", "nova"],
  ["warriors_rest", "excalibur_umbra", "excalibur"],
];

describe("augment / exilus mods stay limited to their own frame", () => {
  const mods = getEffectiveModsMap();
  for (const [id, frame, other] of CASES) {
    it(`${id}: exilus-eligible, only on ${frame}`, () => {
      const mod = mods.get(id)!;
      expect(mod).toBeTruthy();
      expect(isWarframeExilusMod(mod)).toBe(true);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", frame)).toBe(true);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", other)).toBe(false);
      expect(warframeAugmentEligibleInBuilder(mod, "primary", frame)).toBe(false);
    });
  }

  it("Warrior's Rest is Umbra-only: never on Excalibur or Excalibur Prime", () => {
    const wr = mods.get("warriors_rest")!;
    expect(warframeAugmentEligibleInBuilder(wr, "warframe", "excalibur")).toBe(false);
    expect(warframeAugmentEligibleInBuilder(wr, "warframe", "excalibur_prime")).toBe(false);
    expect(warframeAugmentEligibleInBuilder(wr, "warframe", "excalibur_umbra")).toBe(true);
    // A future Umbra Prime id would still match.
    expect(warframeAugmentEligibleInBuilder(wr, "warframe", "excalibur_umbra_prime")).toBe(true);
  });

  it("Excalibur Umbra keeps Excalibur's own augments", () => {
    const umbraAugs = getAugmentModIdsForWarframe("excalibur_umbra");
    const baseAugs = getAugmentModIdsForWarframe("excalibur");
    expect(umbraAugs).toContain("warriors_rest");
    expect(baseAugs).not.toContain("warriors_rest");
    for (const id of baseAugs) expect(umbraAugs).toContain(id);
  });
});
