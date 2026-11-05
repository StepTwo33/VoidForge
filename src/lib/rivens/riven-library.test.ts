import { describe, expect, it } from "vitest";
import { formatRivenName, RIVEN_AFFIX_TABLE } from "@/lib/calc/riven-naming";
import {
  evaluateSavedRiven,
  generateRandomRiven,
  STARTER_RIVENS,
  getSavedRivens,
} from "./riven-storage";
import { extractRivenAffix, getRivenModArtImage } from "@/components/rivens/riven-card";

describe("Riven Naming Generator", () => {
  it("generates correct nomenclature for 1 positive stat", () => {
    expect(formatRivenName("Braton", ["damage"])).toBe("Braton Visiata");
    expect(formatRivenName("Torid", ["multishot"])).toBe("Torid Satican");
    expect(formatRivenName("Rubico", ["criticalChance"])).toBe("Rubico Critacron");
  });

  it("generates correct nomenclature for 2 positive stats", () => {
    expect(formatRivenName("Torid", ["multishot", "criticalChance"])).toBe("Torid Sati-critacron");
    expect(formatRivenName("Rubico", ["damage", "criticalMultiplier"])).toBe("Rubico Visi-acritis");
    expect(formatRivenName("Ceramic Dagger", ["range", "criticalChance"])).toBe("Ceramic Dagger Locti-critacron");
  });

  it("generates correct nomenclature for 3 positive stats", () => {
    // Prefix 1 + '-' + Prefix 2 + Suffix 3
    expect(formatRivenName("Vectis", ["multishot", "criticalChance", "damage"])).toBe("Vectis Sati-critaata");
    expect(formatRivenName("Torid", ["multishot", "criticalMultiplier", "heat"])).toBe("Torid Sati-acripha");
  });

  it("handles empty or fallback stats gracefully", () => {
    expect(formatRivenName("Soma", [])).toBe("Soma Riven Mod");
    expect(formatRivenName("", ["damage", "multishot"])).toBe("Visi-satican");
  });
});

describe("Riven Storage & Evaluation", () => {
  it("evaluates a god-roll Torid riven accurately", () => {
    const res = evaluateSavedRiven("Torid", "Rifle", {
      criticalChance: 1.5,
      multishot: 0.95,
      zoom: -0.45,
    });

    expect(res.score).toBeGreaterThan(3.5);
    expect(res.grade).toBe("Excellent");
    expect(res.color).toBe("#E91E63");
    expect(res.displayStats).toHaveLength(3);
    expect(res.displayStats.find((s) => s.key === "zoom")?.isCurse).toBe(true);

    const godRoll = evaluateSavedRiven("Torid", "Rifle", {
      criticalChance: 1.5,
      multishot: 0.95,
      damage: 1.65,
      zoom: -0.45,
    });
    expect(godRoll.score).toBeGreaterThan(4.5);
    expect(godRoll.grade).toBe("God Roll");
    expect(godRoll.color).toBe("#FFD700");
  });

  it("procedurally generates a valid random Riven with authentic bounds", () => {
    const riven = generateRandomRiven("torid");
    expect(riven.weaponId).toBe("torid");
    expect(riven.weaponType).toBe("Rifle");
    expect(riven.rank).toBe(8);
    expect(riven.masteryRank).toBeGreaterThanOrEqual(8);
    expect(riven.masteryRank).toBeLessThanOrEqual(16);
    expect(riven.displayStats.length).toBeGreaterThanOrEqual(2);
    expect(riven.score).toBeGreaterThan(0);
    expect(typeof riven.name).toBe("string");
    expect(riven.name).toContain("Torid");
  });

  it("returns starter rivens when no custom rivens exist", () => {
    expect(STARTER_RIVENS.length).toBeGreaterThanOrEqual(3);
    const torid = STARTER_RIVENS.find((r) => r.weaponId === "torid");
    expect(torid).toBeDefined();
    expect(torid?.name).toBe("Torid Sati-critacron");
  });
});

describe("Riven Card Display & Affix Extraction", () => {
  it("extracts affix cleanly without repeating multi-word weapon names", () => {
    expect(extractRivenAffix("Ceramic Dagger Locti-visicron", "Ceramic Dagger")).toBe("Locti-visicron");
    expect(extractRivenAffix("Kuva Bramma Toxi-critacan", "Kuva Bramma")).toBe("Toxi-critacan");
    expect(extractRivenAffix("Rubico Visi-acritis", "Rubico")).toBe("Visi-acritis");
    expect(extractRivenAffix("Tenet Arca Plasmor Crita-visican", "Tenet Arca Plasmor")).toBe("Crita-visican");
  });

  it("resolves the authentic Warframe Riven mod art image per category", () => {
    expect(getRivenModArtImage("Rifle")).toBe("/images/mods/Rifle_Riven_Mod.png");
    expect(getRivenModArtImage("Shotgun")).toBe("/images/mods/Shotgun_Riven_Mod.png");
    expect(getRivenModArtImage("Pistol")).toBe("/images/mods/Pistol_Riven_Mod.png");
    expect(getRivenModArtImage("Melee")).toBe("/images/mods/Melee_Riven_Mod.png");
    expect(getRivenModArtImage("Kitgun")).toBe("/images/mods/Kitgun_Riven_Mod.png");
    expect(getRivenModArtImage("Zaw")).toBe("/images/mods/Zaw_Riven_Mod.png");
    expect(getRivenModArtImage("Companion")).toBe("/images/mods/Companion_Weapon_Riven_Mod.png");
    expect(getRivenModArtImage("Archgun")).toBe("/images/mods/Archgun_Riven_Mod.png");
  });
});
