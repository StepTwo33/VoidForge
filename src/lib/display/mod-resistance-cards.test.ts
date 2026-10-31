/**
 * Round 16: resistance / damage-reduction mod cards must match the calculator's tables
 * (wiki.warframe.com values), show a %, and never show a stray damage stat.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { AIRBORNE_DR_MODS, TYPED_RESIST_MODS } from "@/lib/calc/damage-reduction";
import { NECRAMECH_AVIATOR_DR_PER_RANK } from "@/lib/calc/archwing-calculator";
import { adaptationDrPerStack } from "@/lib/calc/calculator";
import { getUmbralSetBonusMultiplier } from "@/lib/calc/set-bonuses";
import { formatModStatSpecial, formatModStatValue, getModStatDisplayLines } from "@/lib/display/mod-display";

const mm = new Map(allMods.map((m) => [m.id, m]));
const lines = (id: string, rank?: number) => {
  const m = mm.get(id)!;
  return getModStatDisplayLines(m, rank ?? m.maxRank).map((l) => l.atRank);
};
const pct = (fraction: number) => `+${Number((fraction * 100).toFixed(2))}%`;

describe("cards equal the calculator resistance tables at every rank", () => {
  for (const [id, def] of Object.entries(TYPED_RESIST_MODS)) {
    it(`${def.name}: ${def.types.join("/")}`, () => {
      const m = mm.get(id)!;
      const type = def.types.length === 3 ? "Physical" : def.types[0].charAt(0).toUpperCase() + def.types[0].slice(1);
      for (let r = 0; r <= m.maxRank; r++) {
        const line = lines(id, r).find((l) => l.includes(`${type} `) && /Resistance/.test(l));
        expect(line, `${id} R${r}`).toBeDefined();
        expect(line, `${id} R${r}`).toMatch(new RegExp(`^\\${pct(def.perRank * (r + 1))} `));
      }
    });
  }
  for (const [id, def] of Object.entries(AIRBORNE_DR_MODS)) {
    it(`${def.name}: airborne DR`, () => {
      const m = mm.get(id)!;
      for (let r = 0; r <= m.maxRank; r++) {
        expect(lines(id, r)).toContain(`${pct(def.perRank * (r + 1))} Airborne Damage Reduction`);
      }
    });
  }
  it("Necramech Aviator: 10/20/30/40% airborne DR", () => {
    expect([0, 1, 2, 3].map((r) => lines("necramech_aviator", r)[0])).toEqual(
      [1, 2, 3, 4].map((n) => `${pct(NECRAMECH_AVIATOR_DR_PER_RANK * n)} Airborne Damage Reduction`),
    );
  });
  it("Adaptation: per-stack resistance matches adaptationDrPerStack; 10–20 s; stacks up to 90%", () => {
    for (let r = 0; r <= 10; r++) {
      const l = lines("adaptation", r);
      expect(l[0]).toBe(`${pct(adaptationDrPerStack(r))} Damage Resistance Per Stack`);
      expect(l[1]).toBe(`+${10 + r}s Duration`);
      expect(l[2]).toBe("Stacks up to 90%");
    }
  });
  it("Umbral card Tau text with the set bonus equals the calculator's typed-resistance source", () => {
    for (const id of ["umbra_vitality", "umbra_fiber", "umbra_intensify"]) {
      for (const pieces of [1, 2, 3]) {
        const mult = getUmbralSetBonusMultiplier(id, pieces);
        const card = formatModStatValue("tauResistance", mm.get(id)!.stats.tauResistance, 10, mult);
        const calc = TYPED_RESIST_MODS[id].perRank * 11 * mult;
        expect(card).toBe(`+${Number((calc * 100).toFixed(1))}% Tau Resistance`);
      }
    }
  });
});

describe("wiki.warframe.com max-rank text", () => {
  const cases: [string, string[]][] = [
    ["aura_toxin_resistance", ["+15% Toxin Damage Resistance"]],
    ["umbra_vitality", ["+100% Health", "+11% Tau Resistance"]],
    ["umbra_fiber", ["+100% Armor", "+11% Tau Resistance"]],
    ["umbra_intensify", ["+44% Ability Strength", "+11% Tau Resistance"]],
    ["necramech_aviator", ["+40% Airborne Damage Reduction"]],
    ["aviator", ["+40% Airborne Damage Reduction"]],
    ["ironclad_flight", ["+40% Airborne Damage Reduction"]],
    ["diamond_skin", ["+45% Radiation Damage Resistance"]],
    ["flame_repellent_r3", ["+60% Heat Damage Resistance"]],
    ["insulation_r3", ["+60% Cold Damage Resistance"]],
    ["lightning_rod_r3", ["+60% Electricity Damage Resistance"]],
    ["fortitude", ["+40% Knockdown Resistance", "+100% Shield Recharge"]],
    ["power_drift", ["+15% Ability Strength", "+30% Knockdown Resistance"]],
    ["primed_sure_footed", ["+100% Knockdown Resistance"]],
    ["warding_thurible", ["+50% Ally Damage Reduction"]],
    ["immolated_radiance", ["+50% Shared Damage Reduction"]],
    // Round 17: the wiki calls the penalty Mobility, and Armored Recovery's is Slide only.
    ["armored_evade", ["+40% Dodge Damage Resistance", "-10% Mobility"]],
    ["armored_acrobatics", ["+20% Bullet Jump Damage Resistance", "-10% Mobility"]],
    ["armored_recovery", ["+50% Knocked Down Damage Resistance", "-20% Slide Speed"]],
    // Round 17: Stand Ground R5 10%/rank, Anti-Flak Plating R3 5%/rank.
    ["stand_ground", ["+60% Ability Damage Reduction While Blocking"]],
    ["anti_flak_plating", ["+20% Blast Damage Resistance", "-10% Mobility"]],
    ["augment_nekros_shield_of_shadows", ["+6% Damage Redirected Per Shadow", "+50m Range"]],
    ["sure_footed_r5", ["+60% Knockdown Resistance"]],
  ];
  for (const [id, want] of cases) it(id, () => expect(lines(id)).toEqual(want));
  it("rank tables: Warding Thurible 30/35/40/50, Immolated Radiance 20/30/40/50", () => {
    expect([0, 1, 2, 3].map((r) => lines("warding_thurible", r)[0])).toEqual(
      ["+30%", "+35%", "+40%", "+50%"].map((v) => `${v} Ally Damage Reduction`),
    );
    expect([0, 1, 2, 3].map((r) => lines("immolated_radiance", r)[0])).toEqual(
      ["+20%", "+30%", "+40%", "+50%"].map((v) => `${v} Shared Damage Reduction`),
    );
  });
});

describe("catalog sweep: no resistance / DR card without a %, no stray damage line", () => {
  const RESIST_LINE = /(Damage (Resistance|Reduction)|Tau Resistance|Knockdown Resistance)/;
  /** Round 16 listed Stand Ground, Anti-Flak Plating and Shield of Shadows here; Round 17 fixed them. */
  const KNOWN = new Set<string>();
  it("every resistance / DR line shows a %", () => {
    const bad = allMods
      .filter((m) => m.stats && !KNOWN.has(m.id))
      .flatMap((m) => lines(m.id).filter((l) => RESIST_LINE.test(l) && !l.includes("%")).map((l) => `${m.id}: ${l}`));
    expect(bad).toEqual([]);
  });
  it("damage-type resistance mods don't show a damage stat", () => {
    const bad = allMods
      .filter((m) => m.stats && m.category === "warframe" && /\d+% (<[^>]+>)?(Toxin|Heat|Cold|Electricity|Radiation|Tau|Physical Damage) Resistance/.test(m.description ?? ""))
      .flatMap((m) => lines(m.id).filter((l) => /damage$/i.test(l) || /% Damage$/.test(l)).map((l) => `${m.id}: ${l}`));
    expect(bad).toEqual([]);
  });
});

describe("Codex vs Builder Card stat agreement across all mods", () => {
  it("getModStatDisplayLines (Codex) and formatModStatValue (Builder Card) agree at every rank", () => {
    const mismatches: string[] = [];
    for (const m of allMods) {
      if (!m.stats) continue;
      for (let r = 0; r <= m.maxRank; r++) {
        const codexLines = getModStatDisplayLines(m, r);
        for (const line of codexLines) {
          const perRank = m.stats[line.statKey];
          const builder = formatModStatSpecial(m.id, line.statKey, perRank, r) ?? formatModStatValue(line.statKey, perRank, r);
          if (line.atRank !== builder) {
            mismatches.push(`${m.id} R${r} ${line.statKey}: codex="${line.atRank}" vs builder="${builder}"`);
          }
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  it("spot-checks normalized duration/range/cooldown mods at max rank", () => {
    expect(lines("argon_scope")).toContain("+9s Duration");
    // Round 21: wiki.warframe.com has no Cooldown / Range stat on Guardian, Medi-Ray, Shield Charger,
    // Protect (card) and Stalk (stealth and cooldown); Transfusion's cooldown is a flat 120 s.
    expect(lines("guardian").join()).not.toMatch(/Cooldown/);
    expect(lines("medi_ray").join()).not.toMatch(/Range/);
    expect(lines("shield_charger").join()).not.toMatch(/Range/);
    expect(lines("protect").join()).not.toMatch(/Cooldown/);
    expect(lines("stalk")).toEqual(["+24m Range"]);
    expect(lines("transfusion")).toContain("+120s Cooldown");
    expect(lines("covert_bond")).toContain("+10s Duration");
    expect(lines("augment_saryn_contagion_cloud")).toEqual(
      expect.arrayContaining(["+5m Range", "+12s Duration"]),
    );
    expect(lines("augment_dante_noctua_swarm")).toEqual(
      expect.arrayContaining(["+8m Range", "+15s Duration", "+25m Ally Radius"]),
    );
    expect(lines("augment_nokko_reroot_rampage")).toContain("+8m Range");
    expect(lines("augment_koumei_kumihimo_loading")).toContain("+6 Kills Required");
    // Beguiling Lantern's wiki table is Bonus Weapon Damage only (no attraction range), Round 21.
    expect(lines("augment_titania_beguiling_lantern")).toEqual(["+100% Damage"]);
    expect(lines("hok_kaal")).toContain("+5s Cooldown");
    expect(lines("funnel_clouds")).toContain("+8 projectiles");
  });
});
