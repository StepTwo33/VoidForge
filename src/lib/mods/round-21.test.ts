/**
 * Round 21: companion builder stat chips, and the wrong-value fixes from the Oct 27 dev review.
 * Expected card text is worked by hand from wiki.warframe.com stat tables quoted in each case.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getModPickerStatFilters, getModStatFilterTags } from "@/lib/mods/mod-stat-filters";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { MOD_WIKI_RANK_TABLES, PANEL_ONLY_MOD_STATS } from "@/lib/display/mod-wiki-tables";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { migrateRenamedMods } from "@/lib/mods/known-mods";

const ids = (category: string) => getModPickerStatFilters(category, "regular").map((f) => f.id);

describe("companion builder stat chips (D: `_prefiltered` fell through to the Warframe chip set)", () => {
  it("companion pool uses the companion chips, weapon pool the weapon chips", () => {
    expect(ids("companion")).toEqual(["all", "survivability", "damage", "crit", "status", "utility"]);
    expect(ids("primary")).toEqual(["all", "damage", "crit", "status", "multishot", "speed", "range", "utility"]);
    // The old fall-through: Strength / Efficiency / Augment chips that no companion mod can match.
    expect(ids("_prefiltered")).toContain("strength");
    const comp = allMods.filter((m) => m.category === "companion");
    for (const chip of ["strength", "efficiency", "augment"] as const) {
      expect(comp.filter((m) => getModStatFilterTags(m).has(chip))).toHaveLength(0);
    }
  });

  it("the companion builder passes the chip category for each picker target", () => {
    const src = readFileSync("src/app/companion-builder/page.tsx", "utf8");
    expect(src).toMatch(/statFilterCategory=\{modPickerTarget === "weapon" \? "primary" : "companion"\}/);
    expect(src).toMatch(/category="_prefiltered"/);
  });

  it("companion health/shield/armor mods land under Survivability", () => {
    // Link Vitality: +health (wiki: companion Health); Link Fiber: +armor.
    for (const id of ["link_vitality", "link_fiber"]) {
      expect(getModStatFilterTags(modsMap.get(id)!).has("survivability"), id).toBe(true);
    }
  });
});

// ---- Wrong card values (Oct 27 dev review, wiki.warframe.com stat tables worked by hand) ----

const card = (id: string, rank: number) => getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Round 21: card values match the wiki stat tables", () => {
  it("Gladiator Rush: +1 s per rank (Max Rank Description +6s), no duplicate duration line", () => {
    expect(modsMap.get("gladiator_rush")!.stats).toEqual({ comboDuration: 1 });
    expect(card("gladiator_rush", 5)).toEqual(["+6s Combo Duration"]);
  });

  it("Rising Storm: +1/2/3/4 combo per Blade Storm attack, flat 10 s (R0-R3)", () => {
    expect([0, 1, 2, 3].map((r) => card("augment_ash_rising_storm", r)[0])).toEqual([
      "+1 Combo per Blade Storm Attack",
      "+2 Combo per Blade Storm Attack",
      "+3 Combo per Blade Storm Attack",
      "+4 Combo per Blade Storm Attack",
    ]);
    expect(card("augment_ash_rising_storm", 0)[1]).toBe("+10s Duration");
    expect(card("augment_ash_rising_storm", 3)[1]).toBe("+10s Duration");
  });

  it("aura extra stats at R5: Energy Siphon 0.6/s, Rejuvenation 3, CP -18%, SD -18%, amps 27/18/27%, Radar 30 m", () => {
    expect(card("aura_energy_siphon", 5)).toEqual(["+0.6 Energy Regen"]);
    expect(card("aura_rejuvenation", 5)).toEqual(["+3 Health Regen"]);
    expect(card("aura_corrosive_projection", 5)).toEqual(["-18% Armor"]);
    expect(card("aura_shield_disruption", 5)).toEqual(["-18% Shield"]);
    expect(card("aura_rifle_amplification", 5)).toEqual(["+27% Damage"]);
    expect(card("aura_shotgun_amplification", 5)).toEqual(["+18% Damage"]);
    expect(card("aura_pistol_amplification", 5)).toEqual(["+27% Damage"]);
    expect(card("aura_enemy_radar", 5)).toEqual(["+30 Enemy Radar"]);
    // R0 of the wiki tables: +0.1, +0.5, -3%, -3%, +4.5%, +3%, +4.5%, +5 m.
    expect(card("aura_energy_siphon", 0)).toEqual(["+0.1 Energy Regen"]);
    expect(card("aura_enemy_radar", 0)).toEqual(["+5 Enemy Radar"]);
    expect(card("aura_shotgun_amplification", 0)).toEqual(["+3% Damage"]);
  });

  it("Ballistic Bullseye: one Critical Chance stat, 20/30/40/50%", () => {
    expect(Object.keys(modsMap.get("augment_mesa_ballistic_bullseye")!.stats)).toEqual(["criticalChance"]);
    expect([0, 1, 2, 3].map((r) => card("augment_mesa_ballistic_bullseye", r)[0])).toEqual([
      "+20% Crit chance",
      "+30% Crit chance",
      "+40% Crit chance",
      "+50% Crit chance",
    ]);
  });

  it("Reactive Storm is Baruuk's augment only; old Volt copy migrates to it; Status Chance 100/150/200/250%", () => {
    expect(modsMap.has("augment_volt_reactive_storm")).toBe(false);
    expect(allMods.filter((m) => m.name.replace(/\s/g, "").toLowerCase().includes("reactiv")).map((m) => m.name)).toEqual(["Reactive Storm"]);
    expect(modsMap.get("augment_baruuk_reactive_storm")!.warframeId).toBe("baruuk");
    expect([0, 1, 2, 3].map((r) => card("augment_baruuk_reactive_storm", r)[0])).toEqual([
      "+100% Status chance",
      "+150% Status chance",
      "+200% Status chance",
      "+250% Status chance",
    ]);
    const { mods } = migrateRenamedMods([{ modId: "augment_volt_reactive_storm", rank: 3, slotIndex: 1 }], modsMap);
    expect(mods).toEqual([{ modId: "augment_baruuk_reactive_storm", rank: 3, slotIndex: 1 }]);
  });

  it("companion mods: no invented Range / Cooldown / Stealth lines; Stalk range 14-24 m; Blast Shield cooldown 15 -> 7 s; Transfusion 120 s", () => {
    expect(card("medi_ray", 5).join()).not.toMatch(/Range/);
    expect(card("shield_charger", 5).join()).not.toMatch(/Range/);
    expect(card("guardian", 5).join()).not.toMatch(/Cooldown/);
    expect([0, 5].map((r) => card("stalk", r))).toEqual([["+14m Range"], ["+24m Range"]]);
    expect(card("blast_shield", 0).at(-1)).toBe("+15s Cooldown");
    expect(card("blast_shield", 5).at(-1)).toBe("+7s Cooldown");
    expect(card("transfusion", 0)).toEqual(["+120s Cooldown"]);
  });

  it("pseudo-stats stored as the max value no longer scale by rank + 1 (Loot Pull, Armor Cap, set bonuses)", () => {
    // Sgreedy Pull wiki: Effect 40/60/80/100% (was 100 x (rank + 1) = +400% at R3).
    expect([0, 3].map((r) => card("augment_mag_sgreedy_pull", r))).toEqual([["+40% Loot Pull"], ["+100% Loot Pull"]]);
    // Sonic Fracture: Armor cap 1500 at every rank (was +6000).
    expect(card("augment_banshee_sonic_fracture", 3)[1]).toBe("+1500 Armor Cap");
    // Synth set bonus: +15% pistol reload at every rank (was +75%).
    expect([0, 4].map((r) => card("set_bonus_synth", r))).toEqual([["+15% Pistol Reload Speed"], ["+15% Pistol Reload Speed"]]);
  });

  it("faction mods read as the wiki multiplier: x1.3 / x1.55 Damage to <faction>, x1.33 to Sentients", () => {
    expect(card("bane_of_corpus", 5)).toEqual(["x1.3 Damage to Corpus"]);
    expect(card("primed_bane_of_corpus", 10)).toEqual(["x1.55 Damage to Corpus"]);
    expect(card("primed_smite_the_murmur", 10)).toEqual(["x1.55 Damage to Murmur"]);
    expect(card("sacrificial_steel", 10)).toEqual(["+220% Crit chance", "x1.33 Damage to Sentients"]);
  });

  it("Equilibrium +110% / +110% at R10; Claw Shred +1.2 punch through at R5; Enduring Bastille Vortex 50-70%", () => {
    expect(card("equilibrium", 10)).toEqual(["+110% Energy", "+110% Health"]);
    expect(card("claw_shred", 5)).toEqual(["+1.2 Punch Through", "+30% Fire rate"]);
    expect([0, 3].map((r) => card("enduring_bastille", r))).toEqual([["+2s Bastille Duration", "+50% Vortex Duration"], ["+2s Bastille Duration", "+70% Vortex Duration"]]);
  });
});

describe("Round 21: tables and hidden stats are display-only and well-formed", () => {
  it("every table has maxRank + 1 entries and names a real stat of a real mod", () => {
    for (const [id, tables] of Object.entries(MOD_WIKI_RANK_TABLES)) {
      const m = modsMap.get(id);
      expect(m, id).toBeDefined();
      for (const [key, t] of Object.entries(tables)) {
        expect(Object.keys(m!.stats), `${id}.${key}`).toContain(key);
        expect(t.values.length, `${id}.${key}`).toBe(m!.maxRank + 1);
      }
    }
  });

  it("every hidden stat exists on its mod and only ever feeds the panel (never the calculator)", () => {
    for (const [id, keys] of Object.entries(PANEL_ONLY_MOD_STATS)) {
      const m = modsMap.get(id);
      expect(m, id).toBeDefined();
      for (const key of keys) {
        expect(Object.keys(m!.stats), `${id}.${key}`).toContain(key);
        for (const line of getVerifiedModBehavior(id)?.stats.filter((s) => s.statKey === key) ?? []) {
          expect(line.target, `${id}.${key}`).toBe("mod_panel");
        }
        expect(getModStatDisplayLines(m!, m!.maxRank).map((l) => l.statKey), `${id}.${key}`).not.toContain(key);
      }
    }
  });

  it("a hidden stat earns no stat chip (Savagery's Finisher Damage no longer lists it under Damage)", () => {
    expect(getModStatFilterTags(modsMap.get("savagery")!).has("damage")).toBe(false);
  });
});
