import { describe, it, expect } from "vitest";
import { archwings, necramechs } from "@/data/archwing";
import { calculateArchwingBuild, calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { modsMap } from "@/data/mods";

const maxed = (ids: string[]) =>
  ids.map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }));
const aw = (id: string) => archwings.find((a) => a.id === id)!;
const nm = (id: string) => necramechs.find((n) => n.id === id)!;

// Wiki Archwing/Necramech patch history: mods apply to Max Rank stats; values from the
// stat-change tables there and Module:Warframes/data HealthRank30/ShieldRank30.
describe("Archwing/Necramech mods scale rank-30 stats", () => {
  it("unmodded Elytron shows rank-30 health/shield/energy; armor unchanged", () => {
    const s = calculateArchwingBuild(aw("elytron"), []);
    expect(s.totalHealth).toBe(1015);
    expect(s.totalShield).toBe(945);
    expect(s.totalEnergy).toBe(170);
    expect(s.totalArmor).toBe(145);
  });

  it("Elytron + max Enhanced Durability (+100%) = 2 x 1015", () => {
    const s = calculateArchwingBuild(aw("elytron"), maxed(["enhanced_durability"]));
    expect(s.totalHealth).toBeCloseTo(2030, 0); // was 1530
  });

  it("Itzal + max Auxiliary Power = 2 x 270 energy", () => {
    const s = calculateArchwingBuild(aw("itzal"), maxed(["auxiliary_power"]));
    expect(s.totalEnergy).toBeCloseTo(540, 0); // was 440
  });

  it("Odonata Prime rank 30: 900 / 840 / 135", () => {
    const s = calculateArchwingBuild(aw("odonata_prime"), []);
    expect([s.totalHealth, s.totalShield, s.totalEnergy]).toEqual([900, 840, 135]);
  });

  it("Voidrig + max Necramech Vitality = 2 x 2400", () => {
    const s = calculateNecramechBuild(nm("voidrig"), maxed(["necramech_vitality"]));
    expect(s.totalHealth).toBeCloseTo(4800, 0); // was 2800
  });

  it("Bonewidow rank 30: 2880 / 630 / 225, armor 480", () => {
    const s = calculateNecramechBuild(nm("bonewidow"), []);
    expect([s.totalHealth, s.totalShield, s.totalEnergy, s.totalArmor]).toEqual([2880, 630, 225, 480]);
  });
});
