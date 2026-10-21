import { describe, expect, it } from "vitest";
import { allWarframes as warframes } from "@/data/warframes";
import { calculateWarframeBuild } from "@/lib/calc/calculator";
import { warframeForDualForm } from "@/lib/builds/dual-form-warframes";

const so = warframes.find((w) => w.id === "sirius_orion")!;

describe("Sirius & Orion per-form stats (wiki.warframe.com/w/Orion, WFCD OrionSuit)", () => {
  it("Sirius (default form) keeps the shared record: 575 / 455 / 160 / 250 at rank 30", () => {
    const s = calculateWarframeBuild(warframeForDualForm(so, "sirius"), [], new Map());
    expect([s.baseHealth, s.baseShield, s.baseArmor, s.baseEnergy]).toEqual([575, 455, 160, 250]);
  });

  it("Orion uses its own block: 350→450 HP, 270→370 SH, 300 AR, 200→250 EN", () => {
    const orion = warframeForDualForm(so, "orion");
    expect([orion.health, orion.shield, orion.armor, orion.energy]).toEqual([350, 270, 300, 200]);
    const s = calculateWarframeBuild(orion, [], new Map());
    expect([s.baseHealth, s.baseShield, s.baseArmor, s.baseEnergy]).toEqual([450, 370, 300, 250]);
  });

  it("non dual-form frames and missing form ids are untouched", () => {
    const ex = warframes.find((w) => w.id === "excalibur")!;
    expect(warframeForDualForm(ex, "orion")).toBe(ex);
    expect(warframeForDualForm(so, undefined)).toBe(so);
  });
});
