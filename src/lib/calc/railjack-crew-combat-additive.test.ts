import { describe, it, expect } from "vitest";
import { computeCrewBoardingDps } from "@/lib/calc/railjack-crew-boarding";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import type { RailjackCrewSlot } from "@/data/railjack-crew";

const braton = allWeapons.find((w) => w.id === "braton_prime")!;
const slot = (combat: number, withSerration: boolean): RailjackCrewSlot =>
  ({
    role: "defender",
    source: "ticker",
    profileId: "test",
    competency: { piloting: 0, gunnery: 0, repair: 0, combat, endurance: 0 },
    weaponLoadout: {
      weaponId: braton.id,
      mods: withSerration ? [{ modId: "serration_r3", rank: 10, slotIndex: 0 }] : [],
    },
  }) as unknown as RailjackCrewSlot;

// Wiki Railjack/Crew: Combat +0/40/80/120/160/200% damage, "additive with other damage mods".
describe("crew Combat competency is additive with Serration", () => {
  it("no mods: Combat 5 = 3x base (1 + 2.0)", () => {
    const r = computeCrewBoardingDps(slot(5, false), braton, modsMap)!;
    expect(r.boardingDps / r.baseDps).toBeCloseTo(3, 6);
  });

  it("Serration +165% with Combat 5 = (1 + 1.65 + 2.0) / (1 + 1.65) of modded DPS", () => {
    const r = computeCrewBoardingDps(slot(5, true), braton, modsMap)!;
    expect(r.boardingDps / r.baseDps).toBeCloseTo(4.65 / 2.65, 6); // was 3.0 (multiplicative)
  });

  it("Serration with Combat 3 (+120%): 3.85 / 2.65", () => {
    const r = computeCrewBoardingDps(slot(3, true), braton, modsMap)!;
    expect(r.boardingDps / r.baseDps).toBeCloseTo(3.85 / 2.65, 6);
  });

  it("Combat 0 leaves DPS unchanged", () => {
    const r = computeCrewBoardingDps(slot(0, true), braton, modsMap)!;
    expect(r.boardingDps).toBe(r.baseDps);
  });
});
