import { describe, expect, it } from "vitest";
import { altFireNoteForDisplay } from "./alt-fire-note";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { getAltFireModes } from "@/lib/weapons/alt-fire";

describe("altFireNoteForDisplay", () => {
  it("drops the wiki attack prefix and keeps it as the source", () => {
    const d = altFireNoteForDisplay(
      "Wiki Corinth Prime attacks 2 and 3. Costs 4 ammo. Press alt-fire again to burst the grenade in midair.",
    );
    expect(d.text).toBe("Costs 4 ammo. Press alt-fire again to burst the grenade in midair.");
    expect(d.source).toBe("Wiki: Corinth Prime attacks 2 and 3");
  });

  it("turns the archgun and full-magazine qualifiers into sentences", () => {
    expect(
      altFireNoteForDisplay("Wiki Corvas attack 2 (archgun: Archwing numbers, or Gravimag numbers with Gravimag on). Quick tap.").text,
    ).toBe("Shows Archwing numbers, or Gravimag numbers with Gravimag on. Quick tap.");
    expect(altFireNoteForDisplay("Wiki Javlok attack 2, shown with a full magazine. Uses the whole magazine.").text).toBe(
      "Shown with a full magazine. Uses the whole magazine.",
    );
  });

  it("handles page prefixes, inline attack refs and empty input", () => {
    expect(altFireNoteForDisplay("Wiki Stug page: charges a blob.").text).toBe("Charges a blob.");
    expect(altFireNoteForDisplay("Wiki Stradavar attack 2.").text).toBe("");
    expect(altFireNoteForDisplay(undefined).text).toBe("");
    expect(altFireNoteForDisplay("Wiki X attack 1. A hover hit (attack 8) is not modelled.").text).toBe(
      "A hover hit is not included.",
    );
  });

  it("leaves no dev-style wiki references in any shipped note", () => {
    let count = 0;
    for (const w of getEffectiveWeapons()) {
      for (const m of getAltFireModes(w)) {
        if (!m.note) continue;
        count++;
        const { text } = altFireNoteForDisplay(m.note);
        expect(text, `${w.id}: ${m.note}`).not.toMatch(/^Wiki\b/);
        expect(text, `${w.id}: ${m.note}`).not.toMatch(/\battacks?\s+\d/);
        expect(text, `${w.id}: ${m.note}`).not.toMatch(/modell?ed/);
        // Every number in the displayed text comes from the stored note (meaning unchanged).
        for (const n of text.match(/\d+(?:\.\d+)?/g) ?? []) expect(m.note).toContain(n);
      }
    }
    expect(count).toBeGreaterThan(100);
  });
});
