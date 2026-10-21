/** Round 15b R15-7: Archwing / Necramech picker cards show the rank-30 base the calculator uses. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { archwings, necramechs, ARCHWING_RANK30_BONUS, NECRAMECH_RANK30_BONUS } from "@/data/archwing";
import { calculateArchwingBuild, calculateNecramechBuild } from "@/lib/calc/archwing-calculator";

const page = readFileSync(join(process.cwd(), "src/app/archwing-builder/page.tsx"), "utf8");

describe("archwing picker cards (rank 30)", () => {
  it("cards are labelled Rank 30 and add the rank-30 bonus", () => {
    expect(page).toContain("Rank 30: HP {aw.health + ARCHWING_RANK30_BONUS.health} • SH {aw.shield + ARCHWING_RANK30_BONUS.shield}");
    expect(page).toContain("Rank 30: HP {nm.health + NECRAMECH_RANK30_BONUS.health} • ARM {nm.armor} • EN {nm.energy + NECRAMECH_RANK30_BONUS.energy}");
  });
  it("card values equal the unmodded calculator totals", () => {
    for (const aw of archwings) {
      const s = calculateArchwingBuild(aw, []);
      expect(s.totalHealth).toBe(aw.health + ARCHWING_RANK30_BONUS.health);
      expect(s.totalShield).toBe(aw.shield + ARCHWING_RANK30_BONUS.shield);
    }
    for (const nm of necramechs) {
      const s = calculateNecramechBuild(nm, []);
      expect(s.totalHealth).toBe(nm.health + NECRAMECH_RANK30_BONUS.health);
      expect(s.totalEnergy).toBe(nm.energy + NECRAMECH_RANK30_BONUS.energy);
    }
  });
  it("hand-worked: Odonata 425 + 250 = 675 HP, 430 + 200 = 630 SH", () => {
    const o = archwings.find((a) => a.id === "odonata")!;
    expect(o.health + ARCHWING_RANK30_BONUS.health).toBe(675);
    expect(o.shield + ARCHWING_RANK30_BONUS.shield).toBe(630);
  });
});
