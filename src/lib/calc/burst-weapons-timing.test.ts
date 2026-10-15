import { describe, it, expect } from "vitest";
import { allWeapons } from "@/data/weapons";
import { incarnonDataMap } from "@/data/incarnon";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { resolveIncarnonActiveWeapon } from "@/lib/calc/incarnon-active-weapon";
import { usesBurstTiming } from "@/lib/calc/effective-fire-rate";
import { modsMap } from "@/data/mods";

const weapon = (id: string) => enrichWeapon(allWeapons.find((w) => w.id === id)!);
const efr = (id: string, modIds: string[] = []) =>
  calculateWeaponBuild(
    weapon(id),
    modIds.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
  ).effectiveFireRate!;
const formEfr = (id: string) => {
  const data = [...incarnonDataMap.values()].find((d) => d.variants?.includes(id))!;
  const evo = data.evolutions.find((e) => e.tier === 1 && /incarnon\s*form/i.test(e.name))!;
  const w = resolveIncarnonActiveWeapon(weapon(id), data, { 1: evo.slot });
  return calculateWeaponBuild(w, [], modsMap, undefined, undefined, { incarnonFormActive: true }).effectiveFireRate!;
};

// EFR = BurstCount / (1/FR + (BurstCount-1) x BurstDelay/(1+max(0,FR bonus)))  (wiki Fire Rate)
describe("burst weapons with category-label triggers now use burst timing", () => {
  it("Hind: 5 / (1/5 + 4 x 0.12) = 7.353 (was 5)", () => {
    expect(efr("hind")).toBeCloseTo(5 / (0.2 + 0.48), 6);
  });
  it("Hind + Speed Trigger: 5 / (1/8 + 4 x 0.12/1.6) = 11.765", () => {
    expect(efr("hind", ["speed_trigger_r3"])).toBeCloseTo(5 / (0.125 + 0.3), 6);
  });
  it("Burston: delay 0.061 (both wikis), 3 / (1/5 + 2 x 0.061) = 9.317", () => {
    expect(efr("burston")).toBeCloseTo(3 / (0.2 + 0.122), 6);
  });
  it("Tiberon: 3 / (1/6.67 + 2 x 0.06) = 11.114", () => {
    expect(efr("tiberon")).toBeCloseTo(3 / (1 / 6.67 + 0.12), 6);
  });
});

describe("newly added burst timing", () => {
  it("Perigale: 4 / (1/2 + 3 x 0.04) = 6.452", () => expect(efr("perigale")).toBeCloseTo(4 / 0.62, 6));
  it("Ballistica: 4 / (1/6.67 + 3 x 0.05) = 13.337", () => expect(efr("ballistica")).toBeCloseTo(4 / (1 / 6.67 + 0.15), 6));
  it("Akarius: 2 / (1/4.33 + 0.12) = 5.699", () => expect(efr("akarius")).toBeCloseTo(2 / (1 / 4.33 + 0.12), 6));
  it("Kuva Kraken: 3 / (1/2.83 + 2 x 0.03) = 7.258", () => expect(efr("kuva_kraken")).toBeCloseTo(3 / (1 / 2.83 + 0.06), 6));
  it("Sybaris Prime: 2 / (1/3.33 + 0.062) = 5.520", () => expect(efr("sybaris_prime")).toBeCloseTo(2 / (1 / 3.33 + 0.062), 6));
});

describe("modes and forms", () => {
  it("Kuva Hind and Tiberon Prime are modelled in Auto mode (FR 10 / 8.33), no burst", () => {
    expect(efr("kuva_hind")).toBeCloseTo(10, 6);
    expect(efr("tiberon_prime")).toBeCloseTo(8.33, 6);
  });
  it("Sybaris Incarnon Form fires a 4-round burst: 4 / (1/3.33 + 3 x 0.101) = 6.630", () => {
    expect(formEfr("sybaris")).toBeCloseTo(4 / (1 / 3.33 + 0.303), 6);
  });
  it("Vasto Incarnon Form fires a 6-round burst: 6 / (1/2.5 + 5 x 0.1) = 6.667", () => {
    expect(formEfr("vasto")).toBeCloseTo(6 / 0.9, 6);
  });
  it("Burston Incarnon Form (Auto, FR 20) ignores the base burst timing", () => {
    expect(formEfr("burston")).toBeCloseTo(20, 6);
  });
  it("usesBurstTiming: category labels yes, explicit other trigger no", () => {
    expect(usesBurstTiming("Rifle")).toBe(true);
    expect(usesBurstTiming("Sniper")).toBe(true);
    expect(usesBurstTiming("Burst / Semi")).toBe(true);
    expect(usesBurstTiming("Auto")).toBe(false);
    expect(usesBurstTiming("Semi")).toBe(false);
    expect(usesBurstTiming("Duplex")).toBe(false);
  });
});
