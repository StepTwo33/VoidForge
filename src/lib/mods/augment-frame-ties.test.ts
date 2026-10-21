import { describe, expect, it } from "vitest";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import {
  getAugmentModIdsForWarframe,
  warframeAugmentEligibleInBuilder,
} from "@/lib/mods/warframe-augment-mods";

// Augments that had no frame tie, so they showed on every frame. Frame per both
// wiki.warframe.com and fandom mod pages ("Warframe Augment Mod for {frame}").
const CASES: Array<[modId: string, frame: string, variant: string, other: string]> = [
  ["biting_frost", "frost", "frost_prime", "ember"],
  ["champions_blessing", "trinity", "trinity_prime", "oberon"],
  ["damage_decoy", "loki", "loki_prime", "ash"],
  ["endless_lullaby", "baruuk", "baruuk_prime", "excalibur"],
  ["loyal_merulina", "yareli", "yareli_prime", "hydroid"],
  ["parasitic_vitality", "nidus", "nidus_prime", "trinity"],
  ["the_relentless_lost", "xaku", "xaku_prime", "excalibur"],
  ["valence_formation", "lavos", "lavos_prime", "excalibur"],
  ["vampiric_grasp", "xaku", "xaku_prime", "nekros"],
  ["wrath_of_ukko", "kullervo", "kullervo", "excalibur"],
  ["swift_bite_r3", "lavos", "lavos_prime", "saryn"],
];

describe("previously unrestricted augments are tied to their frame", () => {
  const mods = getEffectiveModsMap();
  for (const [id, frame, variant, other] of CASES) {
    it(`${id}: ${frame} only`, () => {
      const mod = mods.get(id)!;
      expect(mod).toBeTruthy();
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", frame)).toBe(true);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", variant)).toBe(true);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", other)).toBe(false);
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", undefined)).toBe(false);
      expect(warframeAugmentEligibleInBuilder(mod, "primary", frame)).toBe(false);
      expect(getAugmentModIdsForWarframe(frame)).toContain(id);
      // None of these are exilus mods.
      expect(isWarframeExilusMod(mod)).toBe(false);
    });
  }
});
