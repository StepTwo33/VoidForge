/** R29: wiki.warframe.com ability page values. */
import { describe, expect, it } from "vitest";
import { getEffectiveWarframesMap } from "@/lib/weapons/effective-data";

const ab = (frame: string, name: string) => {
  const a = getEffectiveWarframesMap().get(frame)?.abilities?.find((x) => x.name === name);
  if (!a) throw new Error(`${frame}/${name}`);
  return a;
};

describe("R29 ability data", () => {
  it("Helminth entry: Energized Munitions, Master's Summons, Voracious Metastasis cost 50 (Perspicacity 25)", () => {
    expect(ab("helminth", "Energized Munitions").energyCost).toBe(50);
    expect(ab("helminth", "Master's Summons").energyCost).toBe(50);
    expect(ab("helminth", "Voracious Metastasis").energyCost).toBe(50);
    expect(ab("helminth", "Perspicacity").energyCost).toBe(25);
  });
  it("Kullervo Recompense heals 325 per dagger hit at max Strength (wiki 250 / 275 / 300 / 325)", () => {
    expect(ab("kullervo", "Recompense").miscStats?.healthPerHit).toBe(325);
  });
});
