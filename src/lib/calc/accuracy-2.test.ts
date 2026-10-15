import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { warframesMap } from "@/data/warframes";
import { calculateWarframeBuild, getWarframeArmorModBase } from "@/lib/calc/calculator";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";

const mm = new Map(allMods.map((m) => [m.id, m]));
const wf = (id: string) => warframesMap.get(id)!;
const byName = (n: string) => allWeapons.find((w) => w.name === n && w.triggerType !== "Zaw Component")!;
const atMax = (id: string) => {
  const m = mm.get(id)!;
  return Object.values(m.stats)[0] * (m.maxRank + 1);
};

describe("warframe armor uses rank-30 base (wiki Module:Warframes/data ArmorRank30)", () => {
  it("frames that gain +100 armor by rank 30", () => {
    expect(getWarframeArmorModBase(wf("nidus"))).toBe(450);
    expect(getWarframeArmorModBase(wf("nidus_prime"))).toBe(525);
    expect(getWarframeArmorModBase(wf("lavos"))).toBe(675);
    expect(getWarframeArmorModBase(wf("lavos_prime"))).toBe(675);
    expect(getWarframeArmorModBase(wf("kullervo"))).toBe(650);
  });
  it("Steel Fiber on Nidus scales the rank-30 armor", () => {
    const m = mm.get("steel_fiber_r3")!;
    const s = calculateWarframeBuild(wf("nidus"), [{ modId: m.id, rank: m.maxRank, slotIndex: 0 }], mm);
    expect(s.totalArmor).toBeCloseTo(450 * (1 + atMax("steel_fiber_r3") / 100), 3);
  });
  it("Hydroid uses wiki armor (240 / 290)", () => {
    expect(getWarframeArmorModBase(wf("hydroid"))).toBe(240);
    expect(getWarframeArmorModBase(wf("hydroid_prime"))).toBe(290);
  });
  it("frames without rank-30 armor growth are unchanged", () => {
    expect(getWarframeArmorModBase(wf("excalibur"))).toBe(wf("excalibur").armor);
  });
});

describe("mod values at max rank match the wiki", () => {
  it.each([
    ["eagle_eye", 40], ["hawk_eye", 80], ["aura_infested_impedance", 18], ["warriors_rest", 15],
    ["primed_fury", 55], ["gladiator_vice", 30], ["augur_message", 24], ["augur_reach", 30], ["augur_secrets", 24],
  ])("%s = %d", (id, v) => expect(atMax(id as string)).toBeCloseTo(v as number, 3));
  it.each([
    ["primed_fury", "+5% Attack Speed per rank"], ["augur_secrets", "+4% Ability Strength per rank"],
    ["flame_repellent_r3", "+60%"], ["sure_footed_r5", "+60%"], ["shock_absorbers", "+20%"], ["handspring_r10", "+160%"],
  ])("%s text says %s", (id, t) => expect(mm.get(id as string)!.description).toContain(t));
});

describe("riven weapon types", () => {
  it.each([
    ["Kuva Hek", "Shotgun"], ["Phantasma", "Shotgun"], ["Braton", "Rifle"], ["Sweeper", "Shotgun"],
    ["Deconstructor", "Melee"], ["Vulklok", "Rifle"], ["Artax", "Rifle"], ["Catchmoon", "Pistol"],
    ["Ooltha", "Melee"], ["Rabvee", "Melee"], ["Lato", "Pistol"], ["Skana", "Melee"], ["Imperator", "Archgun"],
  ])("%s -> %s", (n, t) => expect(getRivenWeaponType(byName(n as string))).toBe(t));
  it.each(["Exalted Blade", "Regulators", "Neutralizer", "Shwaak", "Veritux", "Prisma Veritux", "Sirocco", "Lorak"])(
    "%s cannot take a riven",
    (n) => expect(getRivenWeaponType(byName(n))).toBeNull(),
  );
  it("zaw strikes: Rabvee added; Ruhang, Ruhang II, Korb, Clapkra removed", () => {
    const strikes = allWeapons.filter((w) => w.category === "zaw_strike").map((w) => w.name);
    expect(strikes).toContain("Rabvee");
    for (const n of ["Ruhang", "Ruhang II", "Korb", "Clapkra"]) expect(strikes).not.toContain(n);
  });
});
