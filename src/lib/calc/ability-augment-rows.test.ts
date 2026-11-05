import { describe, expect, it } from "vitest";
import { castTimeWithSpeed, intrepidStandValues } from "@/lib/calc/ability-augment-rows";

describe("Round 54 ability rows", () => {
  it("Intrepid Stand R3 at 169% strength", () => {
    const v = intrepidStandValues(3, 1.69);
    expect(v.cap).toBeCloseTo(25350);
    expect(v.self).toBeCloseTo(101.4);
    expect(v.ally).toBeCloseTo(50.7);
  });
  it("cast speed divides cast time (Natural Talent +50%)", () => {
    expect(castTimeWithSpeed(0.75, 50)).toBeCloseTo(0.5);
    expect(castTimeWithSpeed(1, 0)).toBe(1);
  });
});
