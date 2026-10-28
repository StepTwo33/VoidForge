import { describe, expect, it } from "vitest";
import { WEAPON_STAT_GLOSSARY } from "./weapon-stat-glossary";

describe("weapon stat glossary", () => {
  it("covers the confusing panel rows", () => {
    const terms = WEAPON_STAT_GLOSSARY.map((g) => g.term).join(" | ");
    for (const t of ["Direct Burst DPS", "Direct Sustained DPS", "Radial", "Total Burst", "Procs / Sec", "Critical Chance", "Critical Damage", "Status Chance", "Multishot", "Avg hit"]) {
      expect(terms).toContain(t);
    }
  });

  it("every entry is defined, sourced, and wiki entries name their page", () => {
    for (const g of WEAPON_STAT_GLOSSARY) {
      expect(g.definition.length).toBeGreaterThan(20);
      if (g.source === "wiki") expect(g.ref).toBeTruthy();
    }
  });

  it("CD is crit damage (not a cooldown, not CM)", () => {
    const cd = WEAPON_STAT_GLOSSARY.find((g) => g.abbr === "CD");
    expect(cd?.term).toMatch(/Critical Damage/);
    expect(WEAPON_STAT_GLOSSARY.some((g) => g.abbr === "CM")).toBe(false);
  });
});
