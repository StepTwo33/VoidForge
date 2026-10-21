import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCatalogCounts, WEAPON_PICKER_HIDDEN_CATEGORIES } from "./catalog-counts";

describe("home page catalog counts", () => {
  it("mirrors the Weapon Builder picker's hidden categories", () => {
    const src = readFileSync(join(__dirname, "../../app/weapon-builder/page.tsx"), "utf8");
    const block = src.match(/const hiddenCategories = \[([\s\S]*?)\]/);
    expect(block).not.toBeNull();
    const ids = [...block![1].matchAll(/"([a-z_]+)"/g)].map((m) => m[1]).sort();
    expect(ids).toEqual([...WEAPON_PICKER_HIDDEN_CATEGORIES].sort());
  });

  it("picker counts exclude what the pickers hide", () => {
    const c = getCatalogCounts();
    expect(c.weaponPicker).toBeGreaterThan(600);
    expect(c.weaponPicker).toBeLessThan(c.weaponRaw);
    // Helminth + Voidrig + Bonewidow are in the warframe data but not the picker.
    expect(c.warframeRaw - c.warframePicker).toBe(3);
    expect(c.enemies).toBeGreaterThan(100);
    expect(c.companions).toBeGreaterThan(0);
  });
});
