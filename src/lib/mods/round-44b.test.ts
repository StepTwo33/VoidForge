/**
 * Round 44b: fix-ups on top of Jason's Round 44 pass (40e1ec9). Expected values come from
 * wiki.warframe.com mod / set pages and Module:Weapons/data CompatibilityTags (fetched 2026-10-29).
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { dropRetiredModsDeep, RETIRED_MODS } from "@/lib/mods/known-mods";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import { WEAPON_WIKI_BASE_TAGS } from "@/data/wiki-weapon-base-tags";

const card = (id: string, rank?: number) => {
  const m = modsMap.get(id)!;
  return getModStatDisplayLines(m, rank ?? m.maxRank).map((l) => l.atRank);
};
const fits = (modId: string, weaponId: string) => {
  const w = allWeapons.find((x) => x.id === weaponId)!;
  expect(w, weaponId).toBeDefined();
  return modEligibleForWeaponSlot(modsMap.get(modId)!, getModCategory(w.category), w.category, "regular", getWeaponModProfile(w));
};

describe("Round 44b: card stat lines (wiki mod pages)", () => {
  it("Hastened Deflection: +90% Shield Recharge, -45% Shield Recharge Delay (was -45% Shield)", () => {
    expect(card("hastened_deflection")).toEqual(["+90% Shield Recharge", "-45% Shield Recharge Delay"]);
  });
  it("Extend: +3 m Range and +100 m Attraction Range", () => {
    expect(card("extend")).toEqual(["+3m Range", "+100m Attraction Range"]);
  });
  it("Recover / Recuperate: the -25% is Health from Health Orbs, not max Health", () => {
    expect(card("recover")).toEqual(["+10s Duration", "-25% Health from Health Orbs"]);
    expect(card("recuperate")).toEqual(["+10s Duration", "-25% Health from Health Orbs"]);
  });
  it("Galvanized Reflex: +20 Initial Combo; Volatile Quick Return: 3 m blast radius", () => {
    expect(card("galvanized_reflex")).toContain("+20 Initial Combo");
    expect(card("volatile_quick_return")).toContain("+3m Blast Radius");
  });
  it("Killing Blow: only Heavy Attack Damage and Wind Up", () => {
    expect(Object.keys(modsMap.get("killing_blow")!.stats).sort()).toEqual(["heavyAttackDamage", "heavyWindUp"]);
  });
  it("Reroot Rampage: 175 / 250 Toxin Damage at R0 / R3", () => {
    expect(card("augment_nokko_reroot_rampage", 0)[0]).toBe("+175 Toxin Damage");
    expect(card("augment_nokko_reroot_rampage", 3)[0]).toBe("+250 Toxin Damage");
  });
  it("set pseudo-mods: index = pieces (Gladiator 10%/piece, Mecha 3 s/piece, Synth 5%/s, Tek 50/s)", () => {
    expect(card("set_bonus_gladiator", 6)).toEqual(["+60% Crit Per Combo"]);
    expect(card("set_bonus_mecha", 4)).toEqual(["+12s Mark Duration"]);
    expect(card("set_bonus_synth", 4)).toEqual(["+20% Holstered magazine reload/s"]);
    expect(card("set_bonus_tek", 4)).toEqual(["+200 Zone damage/s"]);
  });
  it("Rivens: 10 drain at R0 (18 at R8, in-game card) and a neutral polarity (each riven rolls its own)", () => {
    for (const id of ["riven_rifle", "riven_shotgun", "riven_pistol", "riven_melee"]) {
      const m = modsMap.get(id)!;
      expect([m.polarity, m.drain], id).toEqual(["universal", 10]);
    }
  });
  it("the Tek 'vs marked' damage toggle is gone (Tek set is a damage zone, not a multiplier)", () => {
    expect(Object.keys(DEFAULT_SIM_PARAMS)).not.toContain("applyTekSetVsMarkedDamage");
  });
});

describe("Round 44b: weapon tags from the wiki (Module:Weapons/data CompatibilityTags)", () => {
  it("Held triggers are not POWER_WEAPON: beam rifles take Argon Scope / Bladed Rounds", () => {
    expect(getWeaponModProfile(allWeapons.find((w) => w.id === "amprex")!).tags.has("POWER_WEAPON")).toBe(false);
    expect(fits("argon_scope", "amprex")).toBe(true);
    expect(fits("bladed_rounds", "glaxion")).toBe(true);
  });
  it("Combustion Beam / Sinister Reach need the wiki BEAM tag (not Battacor, Synoid Simulor, Tigris Prime)", () => {
    expect(fits("combustion_beam", "amprex")).toBe(true);
    for (const w of ["battacor", "synoid_simulor", "tigris_prime"]) {
      expect(fits("combustion_beam", w), w).toBe(false);
      expect(fits("sinister_reach", w), w).toBe(false);
    }
  });
  it("Semi-Auto is not SINGLESHOT: Synth Charge fits Lex and Lato", () => {
    expect(fits("synth_charge_r3", "lex")).toBe(true);
    expect(fits("synth_charge_r3", "lato")).toBe(true);
  });
  it("Cannonades need Semi-Auto on every fire mode (wiki): Steflos / Latron / Bronco yes; Tigris, Lenz, bows, Epitaph no", () => {
    expect(fits("semi_shotgun_cannonade", "steflos")).toBe(true);
    expect(fits("semi_rifle_cannonade", "latron")).toBe(true);
    expect(fits("semi_pistol_cannonade", "bronco")).toBe(true);
    expect(fits("semi_shotgun_cannonade", "tigris")).toBe(false);
    expect(fits("semi_rifle_cannonade", "lenz")).toBe(false);
    expect(fits("semi_rifle_cannonade", "paris")).toBe(false);
    expect(fits("semi_pistol_cannonade", "epitaph")).toBe(false);
  });
  it("hitscan Braton Prime has no AOE / PROJECTILE: takes Tactical Reload and Mending Shot, not Terminal Velocity", () => {
    expect(WEAPON_WIKI_BASE_TAGS.braton_prime).toEqual([]);
    expect(fits("tactical_reload_r3", "braton_prime")).toBe(true);
    expect(fits("mending_shot", "braton_prime")).toBe(true);
    expect(fits("terminal_velocity", "braton_prime")).toBe(false);
  });
});

describe("Round 44b: removed mods", () => {
  it("every removed id is in RETIRED_MODS and a saved build holding one still loads (mod dropped)", () => {
    const removed = ["evolution_incarnon_rifle", "evolution_incarnon_pistol", "evolution_incarnon_melee", "cannonade", "soaring_truth", "air_martial", "harrowed_hook", "resilient_focus", "divebomb_vortex", "iron_vault", "shield_transference"];
    for (const id of removed) {
      expect(modsMap.has(id), id).toBe(false);
      expect(RETIRED_MODS[id], id).toBeDefined();
    }
    const build = { mods: [{ modId: "serration", rank: 10 }, { modId: "cannonade", rank: 5 }, { modId: "iron_vault", rank: 3 }] };
    const res = dropRetiredModsDeep(build, modsMap);
    expect(res.data.mods.map((m) => m.modId)).toEqual(["serration"]);
    expect(res.dropped.map((d) => d.modId)).toEqual(["cannonade", "iron_vault"]);
  });
});
