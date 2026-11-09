import type { SimulationParams } from "@/lib/types";

export interface MaxStacksOptions {
  isMelee?: boolean;
  arcaneMax: number;
  linkedLoadout?: boolean;
}

/** Paper clears hit location, earlier events, stacks, and weapon-passive toggles. Stance stays on. */
export function paperSimParams(sim: SimulationParams): SimulationParams {
  const passive = sim.weaponPassiveState;
  const clearedPassive = passive
    ? Object.fromEntries(Object.keys(passive).map((key) => [key, 0]))
    : undefined;
  return {
    ...sim,
    comboCount: 0,
    killStacks: 0,
    killStacksBySource: undefined,
    statusTypesOnTarget: 0,
    arcaneStacks: 0,
    arcaneStacksById: undefined,
    applyHeadshots: false,
    applyWeakPoints: false,
    applyAiming: false,
    applyInvisible: false,
    applyAbilityCast: false,
    applyReload: false,
    applyCrouch: false,
    applyWallLatch: false,
    applyAirborne: false,
    applyAimGlide: false,
    applyDistance: false,
    applyTriggerBuffs: false,
    sniperZoomLevel: undefined,
    sniperComboTier: undefined,
    targetFaction: undefined,
    clipDelegationShots: 0,
    applyYareliCriticalFlow: false,
    applyZephyrAirborne: false,
    applyGarudaDeathsGate: false,
    applyTenaciousBondCrit: false,
    applyReinforcedBondFireRate: false,
    weaponPassiveState: clearedPassive,
  };
}

/**
 * One max-stacks action for the summary and the sheet.
 * Hit location is left alone. Named events turn on together; the leftover
 * trigger bucket (distance, wall latch, crouch) stays as it was.
 */
export function maxStacksSimParams(sim: SimulationParams, options: MaxStacksOptions): SimulationParams {
  return {
    ...sim,
    comboCount: options.isMelee ? 220 : sim.comboCount,
    killStacks: 5,
    killStacksBySource: undefined,
    statusTypesOnTarget: Math.max(sim.statusTypesOnTarget, 4),
    arcaneStacks: options.arcaneMax,
    arcaneStacksById: undefined,
    applyAiming: true,
    applyInvisible: true,
    applyAbilityCast: true,
    applyReload: true,
    applyCrouch: true,
    applyWallLatch: true,
    applyAirborne: true,
    applyAimGlide: true,
    applyDistance: true,
    clipDelegationShots: Math.max(sim.clipDelegationShots ?? 0, 15),
    ...(options.linkedLoadout
      ? {
          applyYareliCriticalFlow: true,
          applyZephyrAirborne: true,
          applyGarudaDeathsGate: true,
          applyTenaciousBondCrit: true,
          applyReinforcedBondFireRate: true,
        }
      : {}),
  };
}
