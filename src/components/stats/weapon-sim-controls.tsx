"use client";

import type { CalculatedStats, SimulationParams, Weapon } from "@/lib/types";
import {
  weaponSupportsPrimaryStyleSets,
  weaponAcceptsSynthReloadBonus,
  weaponSupportsHunterCompanionSet,
} from "@/lib/calc/set-bonuses";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";
import { CollapsibleSection, SimSlider } from "./stat-primitives";

export function WeaponSimControls({
  stats,
  simParams,
  onSimParamsChange,
  weapon,
  isMelee,
  hasConditionals,
  onKillBuffTotal,
  triggerBuffTotal,
}: {
  stats: CalculatedStats;
  simParams: SimulationParams;
  onSimParamsChange: (p: SimulationParams) => void;
  weapon?: Weapon | null;
  isMelee?: boolean;
  hasConditionals: boolean;
  onKillBuffTotal: number;
  triggerBuffTotal: number;
}) {
  return (
      <CollapsibleSection title="SIMULATION" defaultOpen={hasConditionals}>
        <div className="space-y-1.5 py-1 min-w-0">
          {isMelee && (
            <SimSlider
              label="Combo Hits" value={simParams.comboCount} min={0} max={260}
              onChange={(v) => onSimParamsChange({ ...simParams, comboCount: v })}
              tooltip="Consecutive melee combo counter. Blood Rush, Weeping Wounds, Gladiator, and heavy attacks share one track: 1× below 20 hits, then 2×…12× every 20 hits (220+ = 12×). Bonus = mod% × (CM−1), additive with other chance mods."
            />
          )}
          <SimSlider
            label="Kill Stacks" value={simParams.killStacks} min={0} max={5}
            onChange={(v) => onSimParamsChange({ ...simParams, killStacks: v })}
            tooltip="On-kill stacks — Galvanized Chamber/Scope (max 5), Hell/Diffusion (max 4), Aptitude/Savvy (max 2), Shot (max 3), Berserker Fury (max 2). Any stacks also activate non-stacking on-kill buffs (Bladed Rounds etc.)"
          />
          <SimSlider
            label="Status Types" value={simParams.statusTypesOnTarget} min={0} max={5}
            onChange={(v) => onSimParamsChange({ ...simParams, statusTypesOnTarget: v })}
            tooltip="Unique status types on target — Condition Overload, Galvanized Aptitude/Savvy/Shot"
          />
          <SimSlider
            label="Arcane Stacks" value={simParams.arcaneStacks} min={0} max={12}
            onChange={(v) => onSimParamsChange({ ...simParams, arcaneStacks: v })}
            tooltip="Stack count for arcanes like Primary/Secondary/Melee Merciless (max 12)"
          />
          {isMelee && (
            <SimSlider
              label="WF Gladiator" value={simParams.extraGladiatorMods} min={0} max={3}
              onChange={(v) => onSimParamsChange({ ...simParams, extraGladiatorMods: v })}
              tooltip="Gladiator mods on warframe (Aegis/Finesse/Resolve) — +10% crit per melee scaling multiplier tier each (same (CM−1) factor as Blood Rush)"
            />
          )}
          {!isMelee && weapon && weaponSupportsPrimaryStyleSets(weapon) && (
            <>
              <SimSlider
                label="WF Vigilante (count)"
                value={simParams.extraVigilanteModsFromWarframe ?? 0}
                min={0}
                max={6}
                onChange={(v) => onSimParamsChange({ ...simParams, extraVigilanteModsFromWarframe: v })}
                tooltip="Vigilante mods equipped on your Warframe (e.g. Pursuit on Exilus). Each counts toward primary crit-tier upgrade when not using full loadout linkage."
              />
              <SimSlider
                label="Off-weapon Tek pieces"
                value={simParams.extraTekSetPiecesOffWeapon ?? 0}
                min={0}
                max={3}
                onChange={(v) => onSimParamsChange({ ...simParams, extraTekSetPiecesOffWeapon: v })}
                tooltip="Tek mods on other slots (Collateral on frame, Gravity on melee, Assault/Enhance on Kavat). In-game set needs 4 pieces."
              />
              <SimSlider
                label="Tek vs marked (DPS)"
                value={simParams.applyTekSetVsMarkedDamage ? 1 : 0}
                min={0}
                max={1}
                onChange={(v) => onSimParamsChange({ ...simParams, applyTekSetVsMarkedDamage: v >= 1 })}
                tooltip="When Tek 4-set is complete, apply +60% damage vs Kavat-marked enemies to this primary's paper DPS."
              />
            </>
          )}
          {weapon && weaponAcceptsSynthReloadBonus(weapon) && (
            <SimSlider
              label="Off-weapon Synth pieces"
              value={simParams.extraSynthSetPiecesOffWeapon ?? 0}
              min={0}
              max={3}
              onChange={(v) => onSimParamsChange({ ...simParams, extraSynthSetPiecesOffWeapon: v })}
              tooltip="Synth Fiber + Deconstruct on companion and Synth Reflex on Warframe (max 3 off this pistol). At 4 total with Synth Charge here, +15% reload speed applies."
            />
          )}
          {weapon && weaponSupportsHunterCompanionSet(weapon) && (
            <SimSlider
              label="Hunter vs Slash (DPS)"
              value={simParams.applyHunterSetVsSlashDamage ? 1 : 0}
              min={0}
              max={1}
              onChange={(v) => onSimParamsChange({ ...simParams, applyHunterSetVsSlashDamage: v >= 1 })}
              tooltip="When Hunter set pieces are equipped across the loadout, apply +25%/piece companion damage vs Slash-status targets (max +150%)."
            />
          )}
          <SimSlider
            label="Mecha Empowered vs marked"
            value={simParams.applyMechaEmpoweredVsMarkedDamage ? 1 : 0}
            min={0}
            max={1}
            onChange={(v) => onSimParamsChange({ ...simParams, applyMechaEmpoweredVsMarkedDamage: v >= 1 })}
            tooltip="When Mecha Empowered is equipped and ≥1 Mecha set piece marks a target, apply +150% squad damage vs that marked enemy."
          />
          <SimSlider
            label="Mecha spread enemies"
            value={simParams.mechaSpreadEnemies ?? 0}
            min={0}
            max={12}
            onChange={(v) => onSimParamsChange({ ...simParams, mechaSpreadEnemies: v })}
            tooltip="Enemies hit by Mecha mark-kill status spread (0 = off). Papers transferred DoT DPS amortized over mark cooldown. Needs ≥1 Mecha set piece in the loadout."
          />
          <SimSlider
            label="Mecha cascade enemies"
            value={simParams.mechaCascadeEnemies ?? 0}
            min={0}
            max={12}
            onChange={(v) => onSimParamsChange({ ...simParams, mechaCascadeEnemies: v })}
            tooltip="Extra enemies from a second Mecha mark-kill cascade in the same cooldown window (0 = off). Same transferred-DoT math as first hop — user estimate, not mission AI."
          />
          {isMelee && (
            <>
              <SimSlider
                label="Airborne kill stacks"
                value={simParams.airborneKillStacks ?? 3}
                min={0}
                max={3}
                onChange={(v) => onSimParamsChange({ ...simParams, airborneKillStacks: v })}
                tooltip="Innodem Swooping Lunge: +50% melee damage per airborne kill (PP-additive, max 3). Unset defaults to 3 when the perk is equipped."
              />
              <SimSlider
                label="Heavy-kill stacks"
                value={simParams.heavyKillStacks ?? 0}
                min={0}
                max={30}
                onChange={(v) => onSimParamsChange({ ...simParams, heavyKillStacks: v })}
                tooltip="Destreza Incarnon Form: +10% Puncture per heavy-attack kill while transformed (max +300%). 0 = off."
              />
            </>
          )}
          {weapon?.id === "thalys" && (
            <>
              <SimSlider
                label="Shard hosts"
                value={simParams.shardHosts ?? 0}
                min={0}
                max={12}
                onChange={(v) => onSimParamsChange({ ...simParams, shardHosts: v })}
                tooltip="Thalys Incarnon: enemies with embedded shards (0 = off). Papers form embed triggers + Chain Shatter heavy detonations (combo on host only)."
              />
              <SimSlider
                label="Fully-grown shards"
                value={simParams.shardFullyGrownHosts ?? 0}
                min={0}
                max={12}
                onChange={(v) => onSimParamsChange({ ...simParams, shardFullyGrownHosts: v })}
                tooltip="Explosive Growth: hosts that erupt at ×2 trigger damage on embed (clamped to hosts−1). 0 = all normal triggers. Needs Explosive Growth evolution."
              />
            </>
          )}
          <div className="pt-1 space-y-1.5">
            {weapon?.id === "onos" && (
              <label className="block text-[10px] text-muted-foreground" title="Wiki: Held Radiation beam vs full-charge Heat blast">
                Onos Incarnon attack
                <select
                  value={simParams.onosIncarnonMode ?? "held"}
                  onChange={(e) =>
                    onSimParamsChange({
                      ...simParams,
                      onosIncarnonMode: e.target.value === "charge" ? "charge" : "held",
                    })
                  }
                  className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                >
                  <option value="held">Held Radiation beam</option>
                  <option value="charge">Full-charge Heat blast</option>
                </select>
              </label>
            )}
            {weapon?.id === "arbucep" && (
              <label
                className="block text-[10px] text-muted-foreground"
                title="Wiki Arbucep attack cycle — Space 16/114; Atmosphere (Gravimag) 32/228"
              >
                Arbucep attack
                <select
                  value={simParams.arbucepAttackMode ?? 1}
                  onChange={(e) =>
                    onSimParamsChange({
                      ...simParams,
                      arbucepAttackMode: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
                    })
                  }
                  className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                >
                  <option value={1}>1st Attack (Blast)</option>
                  <option value={2}>2nd Attack (Corrosive)</option>
                  <option value={3}>3rd Attack (Gas)</option>
                  <option value={4}>4th Attack (Magnetic)</option>
                  <option value={5}>5th Attack (Radiation)</option>
                  <option value={6}>6th Attack (Viral)</option>
                </select>
              </label>
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Vex Armor") && (
              <SimSlider
                label="Vex Fury fill"
                value={Math.round((simParams.vexArmorFuryFraction ?? 1) * 100)}
                min={0}
                max={100}
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, vexArmorFuryFraction: v / 100 })
                }
                tooltip="Vex Armor Fury stack progress (0–100%). Max Fury is +275% weapon damage × Ability Strength."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Toxic Lash") && (
              <>
                <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!simParams.toxicLashSporesOnTarget}
                    onChange={(e) =>
                      onSimParamsChange({
                        ...simParams,
                        toxicLashSporesOnTarget: e.target.checked,
                      })
                    }
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                  Spores on target (2× Extra Hit)
                </label>
                <SimSlider
                  label="Contagion Cloud enemies"
                  value={simParams.contagionCloudEnemies ?? 0}
                  min={0}
                  max={8}
                  onChange={(v) =>
                    onSimParamsChange({ ...simParams, contagionCloudEnemies: v })
                  }
                  tooltip="Enemies assumed in Contagion Cloud (Toxic Lash augment). 0 = off. Ability toxin DPS × Strength (×2 melee) × enemies — needs Contagion Cloud equipped."
                />
              </>
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Absorb") && (
              <SimSlider
                label="Absorb damage"
                value={Math.round((simParams.absorbAbsorbedDamage ?? 0) / 1000)}
                min={0}
                max={64}
                suffix="k"
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, absorbAbsorbedDamage: v * 1000 })
                }
                tooltip="Damage absorbed before Absorb release (thousands). 0 = off. Weapon buff = √(0.025% × Strength × absorbed), capped at 400% (64k at 100% STR)."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Enthrall") && (
              <SimSlider
                label="Active thralls"
                value={simParams.thrallCount ?? 0}
                min={0}
                max={7}
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, thrallCount: v })
                }
                tooltip="Thrall Pact (Enthrall augment): active thralls (max 7). 0 = off. +25% primary damage per thrall × Ability Strength — needs Thrall Pact equipped."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Thermal Sunder") && (
              <label
                className="block text-[10px] text-muted-foreground"
                title="Thermal Transfer (Thermal Sunder augment): tap Cold / hold Heat / both Blast. Parallel elemental × Ability Strength — needs Thermal Transfer equipped. No exalted."
              >
                Thermal Transfer
                <select
                  value={simParams.thermalTransferPolarity ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    onSimParamsChange({
                      ...simParams,
                      thermalTransferPolarity:
                        v === "cold" || v === "heat" || v === "blast" ? v : undefined,
                    });
                  }}
                  className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                >
                  <option value="">Off</option>
                  <option value="cold">Cold (tap)</option>
                  <option value="heat">Heat (hold)</option>
                  <option value="blast">Blast (Cold+Heat)</option>
                </select>
              </label>
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Razorwing") && (
              <SimSlider
                label="Razorwing Blitz stacks"
                value={simParams.razorwingBlitzStacks ?? 0}
                min={0}
                max={4}
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, razorwingBlitzStacks: v })
                }
                tooltip="Razorwing Blitz: ability casts while Razorwing is active (max 4). 0 = off. +25% fire/attack speed per stack × Ability Strength — Dex Pixia / Diwata only; needs Blitz equipped."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Breach Surge") && (
              <SimSlider
                label="Surge teleport meters"
                value={simParams.criticalSurgeTeleportMeters ?? 0}
                min={0}
                max={50}
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, criticalSurgeTeleportMeters: v })
                }
                tooltip="Critical Surge: meters teleported to a Reservoir (0 = off). In-game min 10m. Primary CC = %/m × meters × Strength, capped at 250% — needs Critical Surge equipped."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Radial Javelin") && (
              <SimSlider
                label="Javelin enemies hit"
                value={simParams.furiousJavelinEnemies ?? 0}
                min={0}
                max={20}
                onChange={(v) =>
                  onSimParamsChange({ ...simParams, furiousJavelinEnemies: v })
                }
                tooltip="Furious Javelin: enemies hit by Radial Javelin (0 = off). Melee damage × (1 + 15% × Strength × enemies) at R3 — includes Exalted Blade; needs Furious Javelin equipped."
              />
            )}
            {(simParams.activeWeaponAbilityBuffs ?? []).includes("Valence Formation") && (
              <label
                className="block text-[10px] text-muted-foreground"
                title="Valence Formation (Lavos Passive Augment): imbued element as parallel weapon elemental + guaranteed status. Rank 3 = +200%. Not × Strength — needs Valence Formation equipped."
              >
                Valence imbue
                <select
                  value={simParams.valenceFormationElement ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const ok = [
                      "heat",
                      "cold",
                      "electricity",
                      "toxin",
                      "blast",
                      "gas",
                      "magnetic",
                      "radiation",
                      "viral",
                      "corrosive",
                    ] as const;
                    onSimParamsChange({
                      ...simParams,
                      valenceFormationElement: (ok as readonly string[]).includes(v)
                        ? (v as (typeof ok)[number])
                        : undefined,
                    });
                  }}
                  className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                >
                  <option value="">Off</option>
                  <option value="heat">Heat</option>
                  <option value="cold">Cold</option>
                  <option value="electricity">Electricity</option>
                  <option value="toxin">Toxin</option>
                  <option value="blast">Blast</option>
                  <option value="gas">Gas</option>
                  <option value="magnetic">Magnetic</option>
                  <option value="radiation">Radiation</option>
                  <option value="viral">Viral</option>
                  <option value="corrosive">Corrosive</option>
                </select>
              </label>
            )}
            <label className="block text-[10px] text-muted-foreground" title="Bane / Expel / Smite apply (1+bonus) on hits and squared on DoTs">
              Target faction
              <select
                value={simParams.targetFaction ?? ""}
                onChange={(e) =>
                  onSimParamsChange({
                    ...simParams,
                    targetFaction: e.target.value || undefined,
                  })
                }
                className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
              >
                <option value="">None (paper DPS)</option>
                <option value="Grineer">Grineer</option>
                <option value="Corpus">Corpus</option>
                <option value="Infested">Infested</option>
                <option value="Corrupted">Corrupted / Orokin</option>
                <option value="Murmur">The Murmur</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={!!simParams.applyHeadshots}
                onChange={(e) =>
                  onSimParamsChange({ ...simParams, applyHeadshots: e.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-border accent-primary"
              />
              Headshots (2× weak point × Acuity)
            </label>
            {(Object.keys(stats.triggerStatBonuses ?? {}).length > 0) && (
              <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!simParams.applyTriggerBuffs}
                  onChange={(e) =>
                    onSimParamsChange({ ...simParams, applyTriggerBuffs: e.target.checked })
                  }
                  className="h-3.5 w-3.5 rounded border-border accent-primary"
                />
                Trigger buffs (aim / reload / cast / latch)
              </label>
            )}
            {weapon &&
              (weapon.id === "tiberon" || weapon.id === "tiberon_prime") &&
              (stats.triggerStatBonuses?.criticalChance ?? 0) > 0 && (
                <SimSlider
                  label="Crit Precision stacks"
                  value={simParams.criticalPrecisionStacks ?? 50}
                  min={0}
                  max={50}
                  onChange={(v) =>
                    onSimParamsChange({ ...simParams, criticalPrecisionStacks: v })
                  }
                  tooltip="Critical Precision: headshot stacks (max 50 = +500% CC at R5). Full-burst miss removes ~10 stacks. Needs Trigger buffs enabled."
                />
              )}
            {weapon &&
              (weapon.id === "catabolyst" || weapon.id === "coda_catabolyst") &&
              (stats.triggerStatBonuses?.criticalChance ?? 0) > 0 && (
                <SimSlider
                  label="Crit Mutation stacks"
                  value={simParams.criticalMutationStacks ?? 10}
                  min={0}
                  max={10}
                  onChange={(v) =>
                    onSimParamsChange({ ...simParams, criticalMutationStacks: v })
                  }
                  tooltip="Critical Mutation: kill stacks (max 10 = +300% CC/CD at R5). Grenade hitting fewer than 3 enemies removes 1 stack. Needs Trigger buffs enabled."
                />
              )}
            {isMelee && (
              <>
                <label
                  className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={simParams.applyStanceMultiplier !== false}
                    onChange={(e) =>
                      onSimParamsChange({ ...simParams, applyStanceMultiplier: e.target.checked })
                    }
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                  Stance combo mult
                  {(stats.stanceDamageMultiplier ?? 1) !== 1 && (
                    <span className="text-cyan-400 font-mono">
                      ×{(stats.stanceDamageMultiplier ?? 1).toFixed(2)}
                    </span>
                  )}
                </label>
                {simParams.applyStanceMultiplier !== false && (
                  <>
                    <label
                      className="block text-[10px] text-muted-foreground"
                      title="Wiki Module:Stances hit-avg scalars. Neutral = B1 lock; other strings change paper DPS."
                    >
                      Combo string
                      <select
                        value={simParams.stanceComboDirection ?? "neutral"}
                        onChange={(e) =>
                          onSimParamsChange({
                            ...simParams,
                            stanceComboDirection: e.target.value as
                              | "neutral"
                              | "forward"
                              | "forwardBlock"
                              | "block"
                              | "heavy"
                              | "slide",
                          })
                        }
                        className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                      >
                        <option value="neutral">Neutral (default)</option>
                        <option value="forward">Forward</option>
                        <option value="forwardBlock">Forward Block</option>
                        <option value="block">Block</option>
                        <option value="heavy">Heavy</option>
                        <option value="slide">Slide</option>
                      </select>
                    </label>
                    <label
                      className="block text-[10px] text-muted-foreground"
                      title="Hit avg = mean hit mult (B1). Cycle = wiki Avg Dmg Multi/s (ΣDmg%/Duration), still × Attack Speed."
                    >
                      Stance DPS model
                      <select
                        value={simParams.stanceDpsModel ?? "hitAvg"}
                        onChange={(e) =>
                          onSimParamsChange({
                            ...simParams,
                            stanceDpsModel: e.target.value === "cycle" ? "cycle" : "hitAvg",
                          })
                        }
                        className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                      >
                        <option value="hitAvg">Hit avg (default)</option>
                        <option value="cycle">Cycle (Avg Dmg Multi/s)</option>
                      </select>
                    </label>
                  </>
                )}
              </>
            )}
          </div>
          {(stats.statusDamageBonus ?? 0) > 0 && (
            <div className="text-[10px] text-amber-400">
              Status damage: +{((stats.statusDamageBonus ?? 0) * 100).toFixed(0)}% (Elementalist)
            </div>
          )}
          {simParams.targetFaction && Object.keys(stats.factionBonuses ?? {}).length > 0 && (
            <div className="text-[10px] text-orange-400">
              Faction mods active vs {simParams.targetFaction}
            </div>
          )}
        </div>
        {/* Active conditional summary */}
        {hasConditionals && (
          <div className="border-t border-border/50 pt-1 mt-1 space-y-0.5">
            <div className="text-[9px] text-muted-foreground/60 mb-0.5">Active conditional effects:</div>
            {stats.bloodRushStacks > 0 && (
              <div className="text-[10px] text-red-400">Blood Rush: ×{(1 + stats.bloodRushStacks * Math.max(0, stats.comboMultiplier - 1)).toFixed(2)} crit (coef × (CM−1) = {(stats.bloodRushStacks * Math.max(0, stats.comboMultiplier - 1) * 100).toFixed(0)}%)</div>
            )}
            {stats.weepingWoundsBonus > 0 && (
              <div className="text-[10px] text-teal-400">Weeping Wounds: ×{(1 + stats.weepingWoundsBonus * Math.max(0, stats.comboMultiplier - 1)).toFixed(2)} status (coef × (CM−1) = {(stats.weepingWoundsBonus * Math.max(0, stats.comboMultiplier - 1) * 100).toFixed(0)}%)</div>
            )}
            {stats.conditionOverloadBonus > 0 && (
              <div className="text-[10px] text-purple-400">Condition Overload: +{(stats.conditionOverloadBonus * stats.simParams.statusTypesOnTarget * 100).toFixed(0)}% DMG ({stats.simParams.statusTypesOnTarget} types)</div>
            )}
            {stats.galvanizedMultishotOnKill > 0 && (() => {
              const msCap = stats.galvanizedMultishotStackCap ?? 5;
              const msStacks = Math.min(stats.simParams.killStacks, msCap);
              return (
                <div className="text-[10px] text-blue-400">Galv. Multishot: +{(stats.galvanizedMultishotOnKill * msStacks * 100).toFixed(0)}% MS ({msStacks}/{msCap} stacks)</div>
              );
            })()}
            {stats.galvanizedDamagePerStatus > 0 && (() => {
              const cdCap = stats.galvanizedDamagePerStatusStackCap ?? 5;
              const cdStacks = Math.min(stats.simParams.killStacks, cdCap);
              return (
                <div className="text-[10px] text-blue-400">Galv. Condition: +{(stats.galvanizedDamagePerStatus * cdStacks * stats.simParams.statusTypesOnTarget * 100).toFixed(0)}% DMG ({cdStacks}/{cdCap} stacks × {stats.simParams.statusTypesOnTarget} status)</div>
              );
            })()}
            {onKillBuffTotal > 0 && (
              <div className={stats.simParams.killStacks > 0 ? "text-[10px] text-blue-400" : "text-[10px] text-muted-foreground/70"}>
                On-kill buffs{stats.simParams.killStacks > 0 ? ": " : " (inactive — needs kill stacks): "}
                {Object.entries(stats.onKillStatBonuses ?? {}).map(([k, v]) => `+${(v * 100).toFixed(0)}% ${getModStatLabel(k)}`).join(", ")}
              </div>
            )}
            {triggerBuffTotal > 0 && (
              <div className={stats.simParams.applyTriggerBuffs ? "text-[10px] text-blue-400" : "text-[10px] text-muted-foreground/70"}>
                Trigger buffs{stats.simParams.applyTriggerBuffs ? ": " : " (inactive — enable Trigger buffs): "}
                {Object.entries(stats.triggerStatBonuses ?? {}).map(([k, v]) => `+${(v * 100).toFixed(0)}% ${getModStatLabel(k)}`).join(", ")}
              </div>
            )}
            {(stats.galvanizedCritOnHeadshot ?? 0) > 0 && (
              stats.simParams.applyHeadshots ? (
                <div className="text-[10px] text-blue-400">Galv. Crit: +{(((stats.galvanizedCritOnHeadshot ?? 0) + (stats.galvanizedCritOnHeadshotPerStack ?? 0) * Math.min(stats.simParams.killStacks, 5)) * 100).toFixed(0)}% CC while aiming ({Math.min(stats.simParams.killStacks, 5)} headshot-kill stacks)</div>
              ) : (
                <div className="text-[10px] text-muted-foreground/70">Galv. Crit: inactive — enable Headshots to model on-headshot crit</div>
              )
            )}
            {stats.berserkerFuryBonus > 0 && (
              <div className="text-[10px] text-yellow-400">Berserker Fury: +{(stats.berserkerFuryBonus * Math.min(stats.simParams.killStacks, 2) * 100).toFixed(0)}% AS ({Math.min(stats.simParams.killStacks, 2)}/2 stacks)</div>
            )}
            {stats.vigilanteCritBonus && stats.vigilanteCritBonus > 0 && (
              <div className="text-[10px] text-orange-400" title="Primary rifles/shotguns/bows/archguns only — does not apply to secondaries or melee. Averaged into DPS as bonus crit chance.">
                Vigilante Set: {(stats.vigilanteCritBonus * 100).toFixed(0)}% crit tier enhance chance (in DPS)
              </div>
            )}
            {(stats.firstShotDamageBonus ?? 0) > 0 && (
              <div className="text-[10px] text-blue-400">
                First shot: +{((stats.firstShotDamageBonus ?? 0) * 100).toFixed(0)}% damage on first shot in magazine (averaged into DPS)
              </div>
            )}
            {(stats.slashOnImpactProcChance ?? 0) > 0 && (
              <div className="text-[10px] text-red-400">
                Internal Bleeding: {((stats.slashOnImpactProcChance ?? 0) * 100).toFixed(0)}% Slash on Impact procs{stats.fireRate < 2.5 ? " (x2 — fire rate < 2.5)" : ""}
              </div>
            )}
            {stats.synthSetReloadBonusApplied != null && stats.synthSetReloadBonusApplied > 0 && (
              <div className="text-[10px] text-cyan-400">
                Synth 4-set: +{(stats.synthSetReloadBonusApplied * 100).toFixed(0)}% reload speed
              </div>
            )}
            {stats.tekSetVsMarkedDamageMultiplier != null && stats.tekSetVsMarkedDamageMultiplier > 1 && (
              <div className="text-[10px] text-fuchsia-400">
                Tek 4-set vs marked: ×{stats.tekSetVsMarkedDamageMultiplier.toFixed(2)} damage (optional)
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>
  );
}

