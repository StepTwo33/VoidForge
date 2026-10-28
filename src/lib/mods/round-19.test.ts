/**
 * Round 19: mod values checked against wiki.warframe.com (WFCD @wfcd/items Mods.json as a
 * cross-check). Expected card text is worked by hand from the wiki stat table quoted in each case;
 * the builder card (formatModStatSpecial ?? formatModStatValue, as in mod-slot.tsx) must match
 * the Codex / picker text (getModStatDisplayLines).
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { getModStatFilterTags } from "@/lib/mods/mod-stat-filters";
import { formatModStatSpecial, formatModStatValue, getModStatDisplayLines } from "@/lib/display/mod-display";

const mod = (id: string) => modsMap.get(id)!;
const codex = (id: string, rank: number) => getModStatDisplayLines(mod(id), rank).map((l) => l.atRank);
/** Builder card text, same formatter chain as src/components/mod-slot.tsx (no Umbral set). */
const card = (id: string, rank: number) =>
  Object.entries(mod(id).stats).map(([k, v]) => formatModStatSpecial(id, k, v, rank) ?? formatModStatValue(k, v, rank));
const tags = (id: string) => getModStatFilterTags(mod(id));

// [id, rank, expected card text]
const CASES: [string, number, string[]][] = [
  // Auto Omni — wiki: "Cooldown: 20s" at every rank; Effect 17/34/51/68/85/100%.
  ["auto_omni", 0, ["+17% Repair Chance", "+20s Cooldown"]],
  ["auto_omni", 2, ["+51% Repair Chance", "+20s Cooldown"]],
  ["auto_omni", 5, ["+100% Repair Chance", "+20s Cooldown"]],
  // Flux Overdrive — wiki: status chance fluctuates "over 5s" (every rank); +25% per rank → +150%.
  ["flux_overdrive", 0, ["+25% Status chance", "+5s Duration"]],
  ["flux_overdrive", 5, ["+150% Status chance", "+5s Duration"]],
  // Rumbled — wiki table only lists % max health absorbed 200/225/250/300 (R0–R3); the 45 s
  // duration is the ability's own (affected by Ability Duration), not a mod stat.
  ["augment_atlas_rumbled", 1, ["+225% Max Health Absorbed"]],
  ["augment_atlas_rumbled", 3, ["+300% Max Health Absorbed"]],
  // Covert Bond — wiki: 1/3/5/6/8/10 s stealth per finisher / mercy kill, Max 60s.
  ["covert_bond", 0, ["+1s Duration", "Max 60s stealth"]],
  ["covert_bond", 3, ["+6s Duration", "Max 60s stealth"]],
  ["covert_bond", 5, ["+10s Duration", "Max 60s stealth"]],
  // Aerial Bond — wiki: Recovery Time -0.5 s/rank (-1.5 s headshot), Cold Status Chance 10–35%,
  // radius 2.5–10 m, cold field lingers 3 s. 0.5 × 6 = 3, 1.5 × 6 = 9.
  ["aerial_bond", 0, ["-0.5s Companion Recovery Time", "-1.5s Companion Recovery Time (headshot kill)", "+10% Cold Status Chance", "+2.5m Range", "+3s Duration"]],
  ["aerial_bond", 5, ["-3s Companion Recovery Time", "-9s Companion Recovery Time (headshot kill)", "+35% Cold Status Chance", "+10m Range", "+3s Duration"]],
  // Duplex Bond — wiki: clones last 5/10/15/20/25/30 s, Energy Orb drop 8/17/25/33/42/50%.
  ["duplex_bond", 1, ["+10s Duration", "+17% Energy Orb Drop Chance"]],
  ["duplex_bond", 5, ["+30s Duration", "+50% Energy Orb Drop Chance"]],
  // Momentous Bond — wiki: +20% per rank (+120%) bonus damage for 30 s, Recovery Time -3 s/rank (-18 s).
  ["momentous_bond", 0, ["+20% Damage", "-3s Companion Recovery Time", "+30s Duration"]],
  ["momentous_bond", 5, ["+120% Damage", "-18s Companion Recovery Time", "+30s Duration"]],
];

describe("round 19: wiki mod values, Codex and builder card agree", () => {
  for (const [id, rank, expected] of CASES) {
    it(`${mod(id).name} R${rank}: ${expected.join(", ")}`, () => {
      expect(codex(id, rank)).toEqual(expected);
      expect(card(id, rank)).toEqual(expected);
    });
  }

  it("fake stats are gone; behavior lines follow the catalog keys", () => {
    expect(mod("augment_atlas_rumbled").stats).not.toHaveProperty("rumbleDuration");
    expect(mod("aerial_bond").stats).not.toHaveProperty("airborneCrit");
    expect(mod("duplex_bond").stats).not.toHaveProperty("extraAttack");
    expect(mod("duplex_bond").stats).not.toHaveProperty("energy");
    expect(mod("momentous_bond").stats).not.toHaveProperty("heavyAttackSpeed");
    for (const id of ["auto_omni", "flux_overdrive", "augment_atlas_rumbled", "covert_bond", "aerial_bond", "duplex_bond", "momentous_bond"]) {
      expect(getVerifiedModBehavior(id)!.stats.map((s) => s.statKey).sort(), id).toEqual(Object.keys(mod(id).stats).sort());
    }
  });

  it("Covert Bond is stealth only (no damage stat or Damage filter tag)", () => {
    expect(Object.keys(mod("covert_bond").stats).sort()).toEqual(["duration", "stealthDurationCap"]);
    expect(tags("covert_bond").has("damage")).toBe(false);
  });

  it("filter tags: Duplex Bond orb chance is utility; Aerial keeps Range; Momentous keeps Damage", () => {
    expect([...tags("duplex_bond")].sort()).toEqual(["utility"]);
    expect([...tags("aerial_bond")].sort()).toEqual(["range", "utility"]);
    expect([...tags("momentous_bond")].sort()).toEqual(["damage"]);
    // Round 23: Covert Bond (companion stealth after finishers) now has the Utility chip.
    expect([...tags("covert_bond")]).toEqual(["utility"]);
  });
});
