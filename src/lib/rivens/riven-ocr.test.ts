import { describe, it, expect } from "vitest";
import { parseRivenOcrText } from "./riven-ocr";

describe("Riven OCR Text Parsing", () => {
  it("correctly parses Torid Sati-critacron screenshot text", () => {
    const rawText = `
RIFLE RIVEN MOD
Torid
SATI-CRITACRON
+148.2% Critical Chance
+94.5% Multishot
-48.0% Zoom
14 Cycles MR 12
    `;

    const result = parseRivenOcrText(rawText);
    expect(result.weaponName).toBe("Torid");
    expect(result.weaponId).toBe("torid");
    expect(result.customSuffix).toBe("SATI-CRITACRON");
    expect(result.masteryRank).toBe(12);
    expect(result.rerolls).toBe(14);

    expect(result.positiveStats).toHaveLength(2);
    expect(result.positiveStats[0].key).toBe("criticalChance");
    expect(result.positiveStats[0].value).toBeCloseTo(1.482, 3);
    expect(result.positiveStats[1].key).toBe("multishot");
    expect(result.positiveStats[1].value).toBeCloseTo(0.945, 3);

    expect(result.negativeStat).toBeDefined();
    expect(result.negativeStat?.key).toBe("zoom");
    expect(result.negativeStat?.value).toBeCloseTo(0.48, 2);
  });

  it("correctly parses Rubico Visi-acritis screenshot text", () => {
    const rawText = `
RIFLE RIVEN MOD
Rubico
VISI-ACRITIS
+162.4% Damage
+118.5% Critical Damage
-38.0% Ammo Maximum
28 Cycles MR 14
    `;

    const result = parseRivenOcrText(rawText);
    expect(result.weaponName).toBe("Rubico");
    expect(result.customSuffix).toBe("VISI-ACRITIS");
    expect(result.masteryRank).toBe(14);
    expect(result.rerolls).toBe(28);

    expect(result.positiveStats).toHaveLength(2);
    expect(result.positiveStats[0].key).toBe("damage");
    expect(result.positiveStats[0].value).toBeCloseTo(1.624, 3);
    expect(result.positiveStats[1].key).toBe("criticalMultiplier");
    expect(result.positiveStats[1].value).toBeCloseTo(1.185, 3);

    expect(result.negativeStat?.key).toBe("ammoMax");
    expect(result.negativeStat?.value).toBeCloseTo(0.38, 2);
  });

  it("correctly parses Ceramic Dagger melee screenshot text with flat range and finisher curse", () => {
    const rawText = `
MELEE RIVEN MOD
Ceramic Dagger
DAGGER LOCTI-VISICRON
+1.9 Range
+172.0% Critical Chance
+155.0% Damage
-65.0% Finisher Damage
9 Cycles MR 10
    `;

    const result = parseRivenOcrText(rawText);
    expect(result.weaponName).toBe("Ceramic Dagger");
    expect(result.customSuffix).toBe("LOCTI-VISICRON");
    expect(result.masteryRank).toBe(10);
    expect(result.rerolls).toBe(9);

    expect(result.positiveStats).toHaveLength(3);
    // Range is flat (def.isPercent = false for range)
    expect(result.positiveStats[0].key).toBe("range");
    expect(result.positiveStats[0].value).toBeCloseTo(1.9, 1);
    expect(result.positiveStats[1].key).toBe("criticalChance");
    expect(result.positiveStats[1].value).toBeCloseTo(1.72, 2);
    expect(result.positiveStats[2].key).toBe("damage");
    expect(result.positiveStats[2].value).toBeCloseTo(1.55, 2);

    expect(result.negativeStat?.key).toBe("finisherDamage");
    expect(result.negativeStat?.value).toBeCloseTo(0.65, 2);
  });

  it("handles en-dashes, spaces in signs, and bow fire rate notes", () => {
    const rawText = `
BOW RIVEN MOD
Nataruk
CRITI-TOXICRON
+ 135.5% Critical Chance
+ 88.2% Toxin
+ 55.4% Fire Rate (x2 for Bows)
– 42.1% Weapon Recoil
MR 16
    `;

    const result = parseRivenOcrText(rawText);
    expect(result.weaponName).toBe("Nataruk");
    expect(result.customSuffix).toBe("CRITI-TOXICRON");
    expect(result.masteryRank).toBe(16);
    expect(result.positiveStats).toHaveLength(3);
    expect(result.positiveStats[0].key).toBe("criticalChance");
    expect(result.positiveStats[1].key).toBe("toxin");
    expect(result.positiveStats[2].key).toBe("fireRate");
    expect(result.negativeStat?.key).toBe("recoil");
    expect(result.negativeStat?.value).toBeCloseTo(0.421, 3);
  });

  it("correctly parses Atomos Ampi-critatin unranked screenshot text with title-case suffix", () => {
    const rawText = `
PISTOL RIVEN MOD
Atomos
Ampi-critatin
+4.6% Magazine Capacity
+15.4% Critical Chance
+9.9% Ammo Maximum
9 Cycles MR 11
    `;

    const result = parseRivenOcrText(rawText);
    expect(result.weaponName).toBe("Atomos");
    expect(result.weaponId).toBe("atomos");
    expect(result.customSuffix).toBe("Ampi-critatin");
    expect(result.masteryRank).toBe(11);
    expect(result.rerolls).toBe(9);

    expect(result.positiveStats).toHaveLength(3);
    expect(result.positiveStats[0].key).toBe("magazine");
    expect(result.positiveStats[0].value).toBeCloseTo(0.046, 3);
    expect(result.positiveStats[1].key).toBe("criticalChance");
    expect(result.positiveStats[1].value).toBeCloseTo(0.154, 3);
    expect(result.positiveStats[2].key).toBe("ammoMax");
    expect(result.positiveStats[2].value).toBeCloseTo(0.099, 3);

    expect(result.isLikelyUnranked).toBe(true);
  });
});
