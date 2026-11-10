import { describe, expect, it } from "vitest";
import { galvCritStatus } from "./galv-crit-status";

describe("galvCritStatus", () => {
  it("is inactive without aiming", () => {
    expect(galvCritStatus({ applyHeadshots: true }, 1.2, 0.4, 5)).toEqual({ active: false, reason: "aim" });
  });
  it("counts the Aiming switch, not only the legacy switch", () => {
    const s = galvCritStatus({ applyAiming: true, applyWeakPoints: true }, 1.2, 0.4, 5);
    expect(s).toMatchObject({ active: true, baseOn: true, stacks: 5 });
    if (s.active) expect(s.bonus).toBeCloseTo(3.2);
  });
  it("legacy switch still counts as aiming", () => {
    expect(galvCritStatus({ applyTriggerBuffs: true, applyHeadshots: true }, 1.2, 0.4, 0)).toMatchObject({ active: true, bonus: 1.2 });
  });
  it("body shot with stacks applies stacks only", () => {
    const s = galvCritStatus({ applyAiming: true }, 1.2, 0.4, 2);
    expect(s).toMatchObject({ active: true, baseOn: false, stacks: 2 });
  });
  it("body shot without stacks asks for a weak point", () => {
    expect(galvCritStatus({ applyAiming: true }, 1.2, 0.4, 0)).toEqual({ active: false, reason: "weakPoint" });
  });
});
