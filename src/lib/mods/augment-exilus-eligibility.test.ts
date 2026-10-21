import { describe, expect, it } from "vitest";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import { warframeAugmentEligibleInBuilder } from "@/lib/mods/warframe-augment-mods";

// Both wikis' mod pages call these "Warframe Augment / Exilus Mod" (R10-B).
const CASES: Array<[modId: string, frame: string, other: string]> = [
  ["augment_saryn_revealing_spores", "saryn", "excalibur"],
  ["augment_grendel_catapult", "grendel", "rhino"],
  ["augment_nova_escape_velocity", "nova_prime", "loki"],
  ["ironclad_flight", "titania", "nezha"],
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

  it("held: Controlled Slide (no Nezha restriction in VF data) and Warrior's Rest stay out of exilus", () => {
    expect(isWarframeExilusMod(mods.get("controlled_slide")!)).toBe(false);
    const wr = [...mods.values()].find((m) => m.name === "Warrior's Rest");
    if (wr) expect(isWarframeExilusMod(wr)).toBe(false);
  });
});
