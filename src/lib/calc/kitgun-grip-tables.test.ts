import { describe, it, expect } from "vitest";
import { kitgunChambers, kitgunGrips, kitgunLoaders, buildKitgun } from "@/data/modular-weapons";

const ch = (id: string) => kitgunChambers.find((c) => c.id === `${id}_chamber`)!;
const gr = (id: string) => kitgunGrips.find((g) => g.id === `grip_${id}`)!;
const ld = (id: string) => kitgunLoaders.find((l) => l.id === `loader_${id}`)!;
const kit = (c: string, g: string, l = "zip") => buildKitgun(ch(c), gr(g), ld(l));

// Values from wiki Module:Modular getKitgunTable / getKitgunPrimaryTable (Grips + Loaders views).
describe("kitgun per-chamber grip tables", () => {
  it("primary Catchmoon uses the primary table, not secondary base + delta", () => {
    const w = kit("catchmoon", "tremor");
    expect(w.damage).toBe(216); // was 256 + 82 = 338
    expect(w.impact).toBe(90);
    expect(w.heat).toBe(126);
    expect(w.fireRate).toBe(3);
  });

  it("secondary Catchmoon damage unchanged, split per wiki grip row", () => {
    const w = kit("catchmoon", "gibber");
    expect(w.damage).toBe(160);
    expect(w.impact).toBe(41);
    expect(w.heat).toBe(119);
  });

  it("Sporelacer secondary has its own grip table (not Catchmoon deltas)", () => {
    expect(kit("sporelacer", "haymaker").damage).toBe(664); // was 90 + 204 = 294
    const g = kit("sporelacer", "gibber");
    expect(g.damage).toBe(103); // was 90 - 96 = -6
    expect(g.toxin).toBe(103);
    expect(g.impact).toBe(0);
  });

  it("Sporelacer primary base crit multiplier is 2.0x; secondary stays 3.0x", () => {
    expect(kit("sporelacer", "tremor", "zip").criticalMultiplier).toBe(2);
    expect(kit("sporelacer", "tremor", "killstream").criticalMultiplier).toBe(2.3);
    expect(kit("sporelacer", "haymaker", "zip").criticalMultiplier).toBe(3);
  });

  it("Rattleguts: Gibber fire rate 11, tier-3 loader magazine 64", () => {
    expect(kit("rattleguts", "gibber").fireRate).toBe(11);
    expect(kit("rattleguts", "gibber", "bashrack").magazine).toBe(64);
    expect(kit("rattleguts", "gibber", "bellows").magazine).toBe(83);
    const p = kit("rattleguts", "palmaris");
    expect(p.damage).toBe(18.1);
    expect(p.fireRate).toBe(15.5);
  });

  it("Tombfinger primary is Impact/Radiation only", () => {
    const w = kit("tombfinger", "steadyslam");
    expect(w.damage).toBe(87);
    expect(w.impact).toBe(54.5);
    expect(w.radiation).toBe(32.5);
    expect(w.puncture).toBe(0);
  });

  it("beam chambers: grip table damage, primary fire rate 12 (wiki Module:Modular/data; same as secondary)", () => {
    const gaze = kit("gaze", "tremor");
    expect(gaze.damage).toBe(37);
    expect(gaze.radiation).toBe(37);
    expect(gaze.puncture).toBe(0);
    expect(gaze.fireRate).toBe(12);
    const verm = kit("vermisplicer", "haymaker");
    expect(verm.damage).toBe(18); // was 14 + 2 = 16
    expect(verm.fireRate).toBe(12);
  });

  it("every chamber x grip row's damage-type split sums to its total", () => {
    for (const c of kitgunChambers) for (const g of kitgunGrips) {
      const w = buildKitgun(c, g, kitgunLoaders[0]);
      const sum = ["impact", "puncture", "slash", "heat", "toxin", "radiation", "viral"]
        .reduce((s, k) => s + ((w as unknown as Record<string, number | undefined>)[k] ?? 0), 0);
      expect(Math.abs(sum - w.damage)).toBeLessThan(0.05);
    }
  });
});
