import { describe, expect, it } from "vitest";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import { maxStacksSimParams, paperSimParams } from "@/lib/ui/sim-presets";

describe("shared simulation presets", () => {
  it("paper clears events, hit location, and weapon passives without turning stance off", () => {
    const paper = paperSimParams({
      ...DEFAULT_SIM_PARAMS,
      applyHeadshots: true,
      applyAiming: true,
      applyInvisible: true,
      applyAbilityCast: true,
      applyReload: true,
      applyTriggerBuffs: true,
      killStacks: 5,
      clipDelegationShots: 12,
      applyStanceMultiplier: true,
      weaponPassiveState: { athodai_overdrive: 1, ax_52_aimed_headshot: 1 },
    });
    expect(paper.applyHeadshots).toBe(false);
    expect(paper.applyAiming).toBe(false);
    expect(paper.applyInvisible).toBe(false);
    expect(paper.applyAbilityCast).toBe(false);
    expect(paper.applyReload).toBe(false);
    expect(paper.applyTriggerBuffs).toBe(false);
    expect(paper.killStacks).toBe(0);
    expect(paper.clipDelegationShots).toBe(0);
    expect(paper.weaponPassiveState).toEqual({ athodai_overdrive: 0, ax_52_aimed_headshot: 0 });
    expect(paper.applyStanceMultiplier).toBe(true);
  });

  it("max stacks does not change hit location and turns the named events on", () => {
    const next = maxStacksSimParams(
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: false, applyWeakPoints: true, applyTriggerBuffs: false },
      { isMelee: false, arcaneMax: 8, linkedLoadout: true },
    );
    expect(next.applyHeadshots).toBe(false);
    expect(next.applyWeakPoints).toBe(true);
    expect(next.applyAiming).toBe(true);
    expect(next.applyInvisible).toBe(true);
    expect(next.applyAbilityCast).toBe(true);
    expect(next.applyReload).toBe(true);
    expect(next.applyTriggerBuffs).toBe(false);
    expect(next.killStacks).toBe(5);
    expect(next.arcaneStacks).toBe(8);
    expect(next.clipDelegationShots).toBe(15);
    expect(next.applyTenaciousBondCrit).toBe(true);
    expect(next.comboCount).toBe(0);
  });
});
