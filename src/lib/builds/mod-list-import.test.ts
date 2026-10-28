import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { getWarframeAuraSlotIndices } from "@/lib/warframes/aura-slots";
import { weaponImportEligibility, warframeImportEligibility } from "./import-eligibility";
import {
  buildImportPlan,
  createMatchSession,
  editDistance,
  matchModLine,
  matchModList,
  normalizeModName,
  parseModLine,
  describeImportResult,
  looksLikeModList,
  parseModList,
  MAX_IMPORT_CHARS,
  MAX_IMPORT_LINES,
} from "./mod-list-import";

const weapon = (name: string) => {
  const w = allWeapons.find((x) => x.name === name);
  if (!w) throw new Error(`weapon ${name}`);
  return w;
};
function weaponSession(name: string) {
  const w = weapon(name);
  const el = weaponImportEligibility(w, getModCategory(w.category));
  return createMatchSession({ catalog: allMods, itemName: w.name, ...el });
}
function frameSession(name: string) {
  const f = allWarframes.find((x) => x.name === name);
  if (!f) throw new Error(`warframe ${name}`);
  const el = warframeImportEligibility(f.id, f.name);
  return { f, session: createMatchSession({ catalog: allMods, itemName: f.name, ...el }) };
}
const match = (s: ReturnType<typeof weaponSession>, text: string) => matchModList(parseModList(text).lines, s);
const names = (rows: { mod: { name: string } | null }[]) => rows.map((r) => r.mod?.name ?? null);

describe("parseModLine", () => {
  it.each([
    ["Serration", "Serration", null],
    ["Serration R10", "Serration", 10],
    ["serration r5", "serration", 5],
    ["Split Chamber (rank 5)", "Split Chamber", 5],
    ["Split Chamber - Rank 5", "Split Chamber", 5],
    ["Heavy Caliber [10]", "Heavy Caliber", 10],
    ["Vital Sense 5/5", "Vital Sense", 5],
    ["Vital Sense: 5", "Vital Sense", 5],
    ["3x Point Strike", "Point Strike", null],
    ["Point Strike x2", "Point Strike", null],
    ["1. Serration (Rank 10/10)", "Serration", 10],
    ["- Heavy Caliber [10]", "Heavy Caliber", 10],
    ["• Vital Sense: 5", "Vital Sense", 5],
    ["Rank 10 Serration", "Serration", 10],
    ["Serration\t10", "Serration", 10],
    ["Serration 0/10", "Serration", 0],
    ["Primed Point Blank", "Primed Point Blank", null],
    ["Slot 3: Hornet Strike", "Hornet Strike", null],
  ])("%s", (raw, name, rank) => {
    expect(parseModLine(raw)).toEqual({ name, rank });
  });
});

describe("parseModList", () => {
  it("splits on lines, commas, semicolons and table bars", () => {
    const r = parseModList("Serration, Split Chamber;Vital Sense\r\n\r\n  Point Strike  \n");
    expect(r.lines.map((l) => l.name)).toEqual(["Serration", "Split Chamber", "Vital Sense", "Point Strike"]);
  });
  it("attaches a rank-only cell to the mod before it (markdown table / OCR)", () => {
    const r = parseModList("| Serration | 10 |\n| Split Chamber | R5 |\nVital Sense\n5/5");
    expect(r.lines.map((l) => [l.name, l.rank])).toEqual([["Serration", 10], ["Split Chamber", 5], ["Vital Sense", 5]]);
  });
  it("returns nothing for empty / whitespace / punctuation-only text", () => {
    expect(parseModList("").lines).toEqual([]);
    expect(parseModList("  \n\n \t ").lines).toEqual([]);
    expect(parseModList("---\n???\n,,,").lines).toEqual([]);
  });
  it("caps a huge paste", () => {
    const many = Array.from({ length: 500 }, (_, i) => `Mod Number ${String.fromCharCode(97 + (i % 26))}${"x".repeat(i % 5)}`).join("\n");
    const r = parseModList(many);
    expect(r.lines).toHaveLength(MAX_IMPORT_LINES);
    expect(r.extraLines).toBe(500 - MAX_IMPORT_LINES);
    const long = parseModList("Serration\n".repeat(MAX_IMPORT_CHARS));
    expect(long.textCut).toBe(true);
    expect(long.lines.length).toBeLessThanOrEqual(MAX_IMPORT_LINES);
  });
});

describe("normalize / edit distance", () => {
  it("normalises case, spacing, punctuation and accents", () => {
    expect(normalizeModName("  Hèavy   Caliber ")).toBe("heavy caliber");
    expect(normalizeModName("Blind Rage™")).toBe("blind rage");
    expect(normalizeModName("Reaper's  Edge")).toBe("reapers edge");
  });
  it("counts an adjacent swap as one edit", () => {
    expect(editDistance("chmaber", "chamber")).toBe(1);
    expect(editDistance("serrations", "serration")).toBe(1);
  });
});

describe("matching on a rifle (Acceltra)", () => {
  const s = weaponSession("Acceltra");
  it("matches exact names regardless of case / spacing", () => {
    const m = match(s, "SERRATION\nsplit   chamber\nHeavyCaliber\n vital sense ");
    expect(names(m)).toEqual(["Serration", "Split Chamber", "Heavy Caliber", "Vital Sense"]);
    expect(m.every((x) => x.status === "exact")).toBe(true);
  });
  it("Heavy Caliber is a rifle mod, so the old category filter's 'No match' is gone", () => {
    expect(matchModLine(parseModList("Heavy Caliber").lines[0], s).mod?.name).toBe("Heavy Caliber");
  });
  it("fixes one typo / a transposition and flags it for checking", () => {
    const m = match(s, "serrations\nsplit chmaber");
    expect(names(m)).toEqual(["Serration", "Split Chamber"]);
    expect(m.map((x) => x.status)).toEqual(["typo", "typo"]);
  });
  it("never turns Primed X into a different mod", () => {
    const m = match(s, "Primed Point Blank");
    expect(m[0].mod?.name).not.toBe("Primed Counterbalance");
  });
  it("lists the choices for an ambiguous partial name instead of guessing", () => {
    const m = match(s, "Chamber")[0];
    expect(m.status).toBe("ambiguous");
    expect(m.mod).toBeNull();
    expect(m.candidates.map((c) => c.name)).toEqual(expect.arrayContaining(["Split Chamber"]));
  });
  it("accepts a partial name only when exactly one mod fits", () => {
    const m = match(s, "Hammer")[0];
    if (m.status === "partial") expect(m.mod?.name).toBeTruthy();
    else expect(["ambiguous", "unmatched"]).toContain(m.status);
  });
  it("junk lines are unmatched with no mod", () => {
    const m = match(s, "hello world\nlorem ipsum dolor sit amet");
    expect(m.map((x) => x.status)).toEqual(["unmatched", "unmatched"]);
    expect(m.every((x) => x.mod === null)).toBe(true);
  });
  it("a Warframe mod pasted on a weapon is 'ineligible', with the reason", () => {
    const m = match(s, "Vitality\nSteel Fiber")[0];
    expect(m.status).toBe("ineligible");
    expect(m.mod?.name).toBe("Vitality");
    expect(m.note).toMatch(/can't go on Acceltra/);
  });
  it("a shotgun mod on a rifle is ineligible, on a shotgun it matches", () => {
    expect(match(s, "Point Blank")[0].status).toBe("ineligible");
    const hek = weaponSession("Hek");
    expect(match(hek, "Point Blank")[0].status).toBe("exact");
    expect(match(hek, "Primed Point Blank")[0].mod?.name).toBe("Primed Point Blank");
  });
  it("a mod for a pistol is eligible on a pistol", () => {
    const lato = weaponSession("Lato");
    expect(match(lato, "Hornet Strike")[0].status).toBe("exact");
  });
  it("a melee weapon takes melee mods and refuses gun mods", () => {
    const skana = weaponSession("Skana");
    expect(match(skana, "Pressure Point")[0].status).toBe("exact");
    expect(match(skana, "Serration")[0].status).toBe("ineligible");
  });
  it("renamed / retired names are explained, not 'No match'", () => {
    const wf = frameSession("Vauban").session;
    const r = match(wf, "Repelling Bastille")[0];
    expect(r.status).toBe("renamed");
    expect(r.mod?.name).toBe("Enduring Bastille");
    expect(r.note).toMatch(/Update 41\.1/);
    const n = match(wf, "Necramech Stamina")[0];
    expect(n.status).toBe("retired");
    expect(n.mod).toBeNull();
    // Link Shields is now Link Redirection, a companion mod: named, but not equippable on a frame
    const ls = match(wf, "Link Shields")[0];
    expect(ls.status).toBe("ineligible");
    expect(ls.mod?.name).toBe("Link Redirection");
    expect(ls.note).toMatch(/Link Shields.*now Link Redirection.*companion/);
    const sh = match(wf, "Speed Holster")[0];
    expect(sh.status).toBe("renamed");
    expect(sh.mod?.name).toBe("Holster Amp");
  });
  it("a renamed shotgun mod on a rifle says it doesn't fit", () => {
    const r = match(s, "Shotgun Spazz")[0];
    expect(r.status).toBe("ineligible");
    expect(r.mod?.name).toBe("Shotgun Barrage");
  });
  it("an augment for another frame is ineligible on this frame", () => {
    const wf = frameSession("Banshee").session;
    expect(match(wf, "Enduring Bastille")[0].status).toBe("ineligible");
    expect(match(frameSession("Vauban").session, "Enduring Bastille")[0].status).toBe("exact");
  });
  it("suggests close mods for an unmatched name", () => {
    const m = match(s, "Serratoin Blast")[0];
    expect(["unmatched", "typo", "ambiguous", "partial"]).toContain(m.status);
    const u = match(s, "Heavy Calibre Rounds")[0];
    if (u.status === "unmatched") expect(u.candidates.map((c) => c.name)).toContain("Heavy Caliber");
  });
});

describe("buildImportPlan", () => {
  const s = weaponSession("Acceltra");
  const slots = [0, 1, 2, 3, 4, 5, 6, 7];
  const plan = (text: string, extra: Partial<Parameters<typeof buildImportPlan>[2]> = {}) =>
    buildImportPlan(match(s, text), s, { mode: "replace", regularSlots: slots, ...extra });

  it("defaults to max rank and uses a rank that was written", () => {
    const p = plan("Serration\nSplit Chamber R5\nVital Sense 12");
    expect(p.added.map((m) => [m.modName, m.rank])).toEqual([["Serration", 10], ["Split Chamber", 5], ["Vital Sense", 5]]);
    expect(p.rows[0].rankNote).toBeNull();
    expect(p.rows[0].rank).toBe(10);
    expect(p.rows[2].rankNote).toMatch(/above this mod's max/);
  });
  it("fills slots in order from the given slot list", () => {
    const p = plan("Serration\nSplit Chamber", { regularSlots: [3, 4, 5] });
    expect(p.added.map((m) => m.slotIndex)).toEqual([3, 4]);
  });
  it("drops duplicates", () => {
    const p = plan("Serration\nserration R3");
    expect(p.importedCount).toBe(1);
    expect(p.rows[1].skip).toBe("duplicate");
  });
  it("drops mods the game won't allow together (first one wins)", () => {
    const p = plan("Hellfire\nInfected Clip\nCryo Rounds\nStormbringer");
    const kept = p.added.map((m) => m.modName);
    expect(kept).toContain("Hellfire");
    expect(p.rows.filter((r) => r.skip === "conflict").length).toBeGreaterThanOrEqual(0);
    expect(new Set(kept).size).toBe(kept.length);
  });
  it("conflicting pair: Serration-style exclusion", () => {
    const hek = weaponSession("Hek");
    const p = buildImportPlan(match(hek, "Point Blank\nPrimed Point Blank"), hek, { mode: "replace", regularSlots: slots });
    expect(p.importedCount).toBe(1);
    expect(p.rows[1].skip).toBe("conflict");
    expect(p.rows[1].skipNote).toMatch(/Point Blank/);
  });
  it("stops at the slot count and says why", () => {
    const p = plan("Serration\nSplit Chamber\nVital Sense", { regularSlots: [0, 1] });
    expect(p.importedCount).toBe(2);
    expect(p.rows[2].skip).toBe("no_slot");
  });
  it("replace reports how many equipped mods go away; fill keeps them and the free slots", () => {
    const existing = [{ modId: modsMap.get("serration_r3")!.id, modName: "Serration", rank: 10, slotIndex: 0 }, { modId: "x", modName: "X", rank: 1, slotIndex: 1 }];
    expect(plan("Split Chamber", { existing }).replacedCount).toBe(2);
    const f = plan("Serration\nSplit Chamber", { mode: "fill", existing });
    expect(f.rows[0].skip).toBe("duplicate");
    expect(f.rows[0].skipNote).toMatch(/Already equipped/);
    expect(f.added.map((m) => m.slotIndex)).toEqual([2]);
    expect(f.result.map((m) => m.slotIndex).sort()).toEqual([0, 1, 2]);
    expect(f.replacedCount).toBe(0);
  });
  it("a user override picks an ambiguous / unmatched line, or skips a line", () => {
    const ambiguous = match(s, "Chamber\nSerration");
    const pick = ambiguous[0].candidates[0];
    const p = buildImportPlan(ambiguous, s, { mode: "replace", regularSlots: slots, overrides: { 0: pick.id, 1: "skip" } });
    expect(p.added.map((m) => m.modName)).toEqual([pick.name]);
    expect(p.rows[1].skip).toBe("skipped");
  });
  it("an override can't force an ineligible mod in", () => {
    const m = match(s, "Chamber");
    const p = buildImportPlan(m, s, { mode: "replace", regularSlots: slots, overrides: { 0: "vitality" } });
    expect(p.importedCount).toBe(0);
  });
  it("polarity and drain are copied from the catalog mod, never invented", () => {
    const p = plan("Serration");
    const cat = modsMap.get(p.added[0].modId)!;
    expect(p.added[0].polarity).toBe(cat.polarity);
    expect(p.added[0].drain).toBe(cat.drain);
  });
});

describe("warframe plans", () => {
  it("routes an Aura mod to the Aura slot, never a regular slot", () => {
    const { f, session } = frameSession("Banshee");
    const aura = allMods.find((m) => isAuraMod(m) && m.category === "warframe");
    expect(aura).toBeTruthy();
    const p = buildImportPlan(match(session, `Vitality\n${aura!.name}`), session, {
      mode: "replace",
      regularSlots: [1, 2, 3, 4, 5, 6, 7, 8],
      auraSlots: getWarframeAuraSlotIndices(f.id),
      isAura: isAuraMod,
    });
    const a = p.added.find((m) => m.modId === aura!.id)!;
    expect(a.slotIndex).toBe(0);
    expect(p.added.find((m) => m.modName === "Vitality")!.slotIndex).toBe(1);
  });
  it("a weapon mod pasted on a frame is ineligible", () => {
    const { session } = frameSession("Banshee");
    expect(match(session, "Serration")[0].status).toBe("ineligible");
  });
});

describe("describeImportResult", () => {
  it("says what happened to the equipped mods and the skipped lines", () => {
    expect(describeImportResult({ mode: "replace", imported: 5, skipped: 2, replaced: 8 })).toEqual({
      title: "Imported 5 mods",
      description: "Replaced the 8 mods that were equipped. 2 lines were not imported.",
    });
    expect(describeImportResult({ mode: "fill", imported: 1, skipped: 1, replaced: 0 })).toEqual({
      title: "Imported 1 mod",
      description: "Added to the empty slots. Your other mods are unchanged. 1 line was not imported.",
    });
    expect(describeImportResult({ mode: "replace", imported: 3, skipped: 0, replaced: 0 }).description).toBe("Filled the empty build.");
  });
});

describe("looksLikeModList", () => {
  it("recognises a mod list but not a share code, URL or prose", () => {
    expect(looksLikeModList("Serration\nSplit Chamber, Vital Sense R5", allMods)).toBe(true);
    expect(looksLikeModList("Serration\nhello\nworld\nfoo", allMods)).toBe(false);
    expect(looksLikeModList("eyJfdiI6MSwidHlwZSI6IndlYXBvbiJ9", allMods)).toBe(false);
    expect(looksLikeModList("", allMods)).toBe(false);
  });
});
