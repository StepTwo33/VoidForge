import { describe, expect, it } from "vitest";
import { formatRivenName, RIVEN_AFFIX_TABLE } from "@/lib/calc/riven-naming";
import {
  evaluateSavedRiven,
  generateRandomRiven,
  LEGACY_STARTER_SEED,
  stripUntouchedStarters,
  getSavedRivens,
  normalizeSavedRiven,
  rivenDisplayStats,
  coerceRivenStats,
  type SavedRiven,
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
    // Bad rolls can grade below zero; the score only has to be a real number.
    expect(Number.isFinite(riven.score)).toBe(true);
    expect(typeof riven.name).toBe("string");
    expect(riven.name).toContain("Torid");
  });

  it("no longer seeds example rivens (server side and empty storage read as empty)", () => {
    expect(getSavedRivens()).toEqual([]);
  });

  it("strips only untouched legacy starter rivens", () => {
    const mk = (id: string, updatedAt: number) => ({ id, updatedAt } as unknown as SavedRiven);
    const list = [
      mk("starter_torid", LEGACY_STARTER_SEED.starter_torid),
      mk("starter_rubico", LEGACY_STARTER_SEED.starter_rubico + 5),
      mk("riven_1", LEGACY_STARTER_SEED.starter_torid),
      mk("starter_ceramic_dagger", LEGACY_STARTER_SEED.starter_ceramic_dagger),
    ];
    expect(stripUntouchedStarters(list).map((r) => r.id)).toEqual(["starter_rubico", "riven_1"]);
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

describe("malformed riven records do not take down the library", () => {
  class MemStorage {
    m = new Map<string, string>();
    getItem(k: string) { return this.m.get(k) ?? null; }
    setItem(k: string, v: string) { this.m.set(k, v); }
    removeItem(k: string) { this.m.delete(k); }
  }

  const wellFormed = {
    id: "riven_ok",
    name: "Torid Critacan",
    weaponId: "torid",
    weaponName: "Torid",
    weaponCategory: "primary",
    weaponType: "Rifle" as const,
    polarity: "madurai",
    rank: 8,
    rerolls: 2,
    masteryRank: 14,
    stats: { criticalChance: 1.5, multishot: 0.9 },
    displayStats: [
      { key: "criticalChance", label: "Critical Chance", value: 1.5, isPercent: true },
      { key: "multishot", label: "Multishot", value: 0.9, isPercent: true },
    ],
    score: 3,
    grade: "Good",
    gradeColor: "#fff",
    createdAt: 1,
    updatedAt: 1,
  };

  it("rivenDisplayStats is safe on undefined, null, and garbage", () => {
    expect(rivenDisplayStats(undefined)).toEqual([]);
    expect(rivenDisplayStats(null)).toEqual([]);
    expect(rivenDisplayStats({} as SavedRiven)).toEqual([]);
    expect(rivenDisplayStats({ displayStats: undefined } as SavedRiven)).toEqual([]);
    expect(rivenDisplayStats({ displayStats: "nope" as never } as SavedRiven)).toEqual([]);
    // Does not throw when mapping, which is what used to crash RivenCard.
    expect(() => rivenDisplayStats({ displayStats: undefined } as SavedRiven).map((s) => s.label)).not.toThrow();
  });

  it("rebuilds displayStats from a stats map when they are missing", () => {
    const raw = { ...wellFormed, displayStats: undefined };
    const n = normalizeSavedRiven(raw);
    expect(n).not.toBeNull();
    expect(n!.displayStats.length).toBe(2);
    expect(n!.displayStats.map((s) => s.key).sort()).toEqual(["criticalChance", "multishot"]);
    expect(n!.grade).toBeTruthy();
  });

  it("coerces stats stored as an array (OCR / old shapes) and keeps the row", () => {
    const raw = {
      ...wellFormed,
      stats: [
        { key: "criticalChance", value: 1.5 },
        { multishot: 0.9 },
      ],
      displayStats: undefined,
    };
    expect(coerceRivenStats(raw.stats)).toEqual({ criticalChance: 1.5, multishot: 0.9 });
    const n = normalizeSavedRiven(raw);
    expect(n).not.toBeNull();
    expect(n!.stats).toEqual({ criticalChance: 1.5, multishot: 0.9 });
    expect(n!.displayStats.length).toBe(2);
  });

  it("keeps a riven with no readable stats so the player can delete it, and drops records with no id", () => {
    const empty = normalizeSavedRiven({
      id: "riven_empty",
      name: "Broken",
      stats: "??? ",
    });
    expect(empty).not.toBeNull();
    expect(empty!.id).toBe("riven_empty");
    expect(empty!.stats).toEqual({});
    expect(empty!.displayStats).toEqual([]);

    expect(normalizeSavedRiven({ name: "no id", stats: { damage: 1 } })).toBeNull();
    expect(normalizeSavedRiven(null)).toBeNull();
    expect(normalizeSavedRiven("nope")).toBeNull();
  });

  it("getSavedRivens returns repaired rows and skips garbage, including a well-formed neighbor", () => {
    const mem = new MemStorage();
    (globalThis as unknown as { window: unknown }).window = globalThis;
    (globalThis as unknown as { localStorage: MemStorage }).localStorage = mem;
    mem.setItem("framehub_riven_library", JSON.stringify([
      wellFormed,
      { id: "riven_bad", name: "Old Torid", weaponId: "torid", weaponName: "Torid", weaponType: "Rifle", polarity: "madurai", rank: 8, rerolls: 0, masteryRank: 8, stats: [{ criticalChance: 1.1 }, { multishot: 0.8 }], createdAt: 2, updatedAt: 2 },
      { name: "no-id-drop-me", stats: { damage: 1 } },
      "totally invalid",
    ]));

    const list = getSavedRivens();
    expect(list.map((r) => r.id).sort()).toEqual(["riven_bad", "riven_ok"]);
    const bad = list.find((r) => r.id === "riven_bad")!;
    expect(bad.stats).toEqual({ criticalChance: 1.1, multishot: 0.8 });
    expect(bad.displayStats.length).toBe(2);
    expect(list.find((r) => r.id === "riven_ok")!.displayStats).toHaveLength(2);

    delete (globalThis as unknown as { window?: unknown }).window;
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });
});
