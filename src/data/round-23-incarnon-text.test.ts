import { describe, expect, it } from "vitest";
import { incarnonDataMap } from "@/data/incarnon";

const evo = (weaponId: string, name: string) =>
  incarnonDataMap.get(weaponId)?.evolutions.find((e) => e.name === name);

describe("Round 23: Incarnon Ammo Efficiency text (Hotfix 44.1.3)", () => {
  it("no Incarnon evolution still advertises +100% Ammo Efficiency", () => {
    const offenders: string[] = [];
    for (const [id, d] of incarnonDataMap) {
      for (const e of d.evolutions) {
        if (/\+?100% Ammo Efficiency/i.test(e.description)) offenders.push(`${id}:${e.name}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("Vectis Inciting Incident matches the wiki (+100 base damage, +2 Punch Through with the channel)", () => {
    for (const id of ["vectis", "vectis_incarnon", "vectis_prime"]) {
      expect(evo(id, "Inciting Incident")?.description).toBe(
        "Increase Base Damage by +100. With Channeled Ability Active: +2 Punch Through",
      );
    }
  });

  it("Laetum and Lato AE perks are unchanged by the hotfix (wiki: 60% / 40% / 50%, all below the 75% cap)", () => {
    expect(evo("laetum", "Feather of Justice")?.statChanges.ammoEfficiency).toBe(0.6);
    expect(evo("laetum", "Reaper's Plenty")?.statChanges.ammoEfficiency).toBe(0.4);
    expect(evo("lato_incarnon", "Marksman's Gain")?.description).toBe(
      "On Headshot: 20% chance for +50% Ammo Efficiency for 6s.",
    );
  });
});
