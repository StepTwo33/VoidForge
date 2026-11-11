/**
 * Operator builder Focus cards vs wiki.warframe.com/w/Focus/<School> node descriptions (max rank).
 * "Magnetic Surge" and "Sling Refund" are not Focus nodes on either wiki (official or Fandom); the
 * shield node is Magnetic Flare and Naramon's card is Killer's Rush.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { FOCUS_SCHOOLS } from "@/data/focus-school-cards";

const perk = (title: string) => FOCUS_SCHOOLS.flatMap((s) => s.perks).find((p) => p.title === title);

describe("Operator builder Focus cards", () => {
  it("only lists current Focus nodes", () => {
    const nodes = new Set(allMods.filter((m) => m.category === "operator").map((m) => m.name));
    for (const school of FOCUS_SCHOOLS) {
      for (const p of school.perks) expect(nodes.has(p.title), `${school.name}: ${p.title}`).toBe(true);
    }
    expect(perk("Magnetic Surge")).toBeUndefined();
    expect(perk("Sling Refund")).toBeUndefined();
  });

  it("uses the wiki's max-rank effects", () => {
    expect(perk("Opening Slam")?.desc).toMatch(/double.*Combo gain for 20s/);
    expect(perk("Opening Slam")?.desc).not.toMatch(/Crit/);
    expect(perk("Magnetic Flare")?.desc).toMatch(/8m field for 30s/);
    expect(perk("Squad Regen")?.desc).toMatch(/50 health\/s.*60s/);
    expect(perk("Killer's Rush")?.desc).toMatch(/\+50% melee Critical Chance for 40s/);
    expect(perk("Phoenix Talons")?.desc).not.toMatch(/Physical and Elemental/);
    expect(perk("Wellspring")?.desc).toMatch(/well for 8s.*5 Energy\/s for 30s/);
    expect(perk("Last Gasp")?.desc).toMatch(/3 enemies before 15s/);
  });
});
