"use client";

import {
  SNIPER_DATA,
  SNIPER_MAX_COMBO_TIER,
  sniperComboHitsRequired,
  sniperComboMultiplier,
  type SniperZoomLevel,
} from "@/data/sniper-zoom";
import type {
  CalculatedStats,
  KillStackSource,
  SetBonusLinkage,
  SimulationParams,
  Weapon,
} from "@/lib/types";
import {
  countSetModsInSlots,
  SYNTH_SET_MOD_IDS,
  TEK_SET_MOD_IDS,
  VIGILANTE_MOD_IDS,
  weaponSupportsPrimaryStyleSets,
  weaponAcceptsSynthReloadBonus,
  weaponSupportsHunterCompanionSet,
} from "@/lib/calc/set-bonuses";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";
import { CollapsibleSection, SimSlider } from "./stat-primitives";

function comboTier(hits: number): number {
  if (hits < 20) return 1;
  return Math.min(12, Math.floor(hits / 20) + 1);
}

const WF_GLADIATOR_IDS = new Set([
  "gladiator_aegis",
  "gladiator_finesse",
  "gladiator_resolve",
]);

/** Simulation sliders / toggles body — rendered inside the Sim Sheet, not inline in the sidebar. */
export function WeaponSimControls({
  stats,
  simParams,
  onSimParamsChange,
  weapon,
  isMelee,
  hasConditionals,
  onKillBuffTotal,
  triggerBuffTotal,
  linkage,
  linkedWarframeId,
  linkedCompanionModIds,
}: {
  stats: CalculatedStats;
  simParams: SimulationParams;
  onSimParamsChange: (p: SimulationParams) => void;
  weapon?: Weapon | null;
  isMelee?: boolean;
  hasConditionals: boolean;
  onKillBuffTotal: number;
  triggerBuffTotal: number;
  linkage?: SetBonusLinkage;
  linkedWarframeId?: string;
  linkedCompanionModIds?: string[];
}) {
  const killSources = stats.killStackSources ?? [];
  const arcaneSources = stats.arcaneStackSources ?? [];
  const ks = (src: KillStackSource) => Math.max(0, simParams.killStacksBySource?.[src] ?? simParams.killStacks);
  const simKs = (src: KillStackSource) =>
    Math.max(0, stats.simParams.killStacksBySource?.[src] ?? stats.simParams.killStacks);
  const arcaneMax = arcaneSources.length > 0 ? Math.max(...arcaneSources.map((a) => a.cap)) : 12;
  const singleArcane = arcaneSources.length === 1 ? arcaneSources[0] : null;
  const isLinkedLoadout = Boolean(linkage);
  const wfFamily = (linkedWarframeId ?? "").replace(/_prime$/, "");
  const isSecondaryWeapon = Boolean(
    weapon && ["pistol", "secondary", "dual_pistols"].includes(weapon.category),
  );
  const hasTenaciousBond = Boolean(linkedCompanionModIds?.includes("tenacious_bond"));
  const hasReinforcedBond = Boolean(
    !isMelee && linkedCompanionModIds?.includes("reinforced_bond"),
  );

  const linkedSetSummary: string[] = [];
  if (linkage) {
    const vig = countSetModsInSlots(linkage.warframeMods, new Set(VIGILANTE_MOD_IDS));
    const glad = countSetModsInSlots(linkage.warframeMods, WF_GLADIATOR_IDS);
    const tekSet = new Set<string>(TEK_SET_MOD_IDS);
    const tek =
      countSetModsInSlots(linkage.warframeMods, tekSet) +
      countSetModsInSlots(linkage.meleeMods, tekSet) +
      countSetModsInSlots(linkage.companionMods, tekSet);
    const synthSet = new Set<string>(SYNTH_SET_MOD_IDS);
    const synth =
      countSetModsInSlots(linkage.warframeMods, synthSet) +
      countSetModsInSlots(linkage.companionMods, synthSet);
    if (vig > 0) linkedSetSummary.push(`${vig} WF Vigilante`);
    if (glad > 0) linkedSetSummary.push(`${glad} WF Gladiator`);
    if (tek > 0) linkedSetSummary.push(`${tek} Tek`);
    if (synth > 0) linkedSetSummary.push(`${synth} Synth`);
    if (stats.usesWarframeMaxEnergy && simParams.warframeMaxEnergy != null) {
      linkedSetSummary.push(`${Math.round(simParams.warframeMaxEnergy)} WF Max Energy`);
    }
  }

  return (
        <div className="space-y-1.5 py-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/50">
            <span className="text-[10px] font-medium text-muted-foreground">Quick conditionals</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onSimParamsChange({
                    ...simParams,
                    comboCount: 0,
                    killStacks: 0,
                    killStacksBySource: undefined,
                    statusTypesOnTarget: 0,
                    arcaneStacks: 0,
                    arcaneStacksById: undefined,
                    applyTriggerBuffs: false,
                    applyYareliCriticalFlow: false,
                    applyZephyrAirborne: false,
                    applyGarudaDeathsGate: false,
                    applyTenaciousBondCrit: false,
                    applyReinforcedBondFireRate: false,
                  })
                }
                className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                All off (Paper)
              </button>
              <button
                type="button"
                onClick={() =>
                  onSimParamsChange({
                    ...simParams,
                    comboCount: isMelee ? 220 : simParams.comboCount,
                    killStacks: 5,
                    killStacksBySource: undefined,
                    statusTypesOnTarget: Math.max(simParams.statusTypesOnTarget, 4),
                    arcaneStacks: arcaneMax,
                    arcaneStacksById: undefined,
                    applyTriggerBuffs: true,
                    ...(isLinkedLoadout
                      ? {
                          applyYareliCriticalFlow: true,
                          applyZephyrAirborne: true,
                          applyGarudaDeathsGate: true,
                          applyTenaciousBondCrit: true,
                          applyReinforcedBondFireRate: true,
                        }
                      : {}),
                  })
                }
                className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/20 transition-colors"
              >
                Max stacks
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-0.5 pb-1">
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={!!simParams.applyHeadshots}
                onChange={(e) =>
                  onSimParamsChange({ ...simParams, applyHeadshots: e.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-border accent-primary"
              />
              <span className="font-medium">Headshots (weak point)</span>
            </label>
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={!!simParams.applyTriggerBuffs}
                onChange={(e) =>
                  onSimParamsChange({ ...simParams, applyTriggerBuffs: e.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-border accent-primary"
              />
              <span className="font-medium">Trigger Buffs (Aim / Distance &gt;15m)</span>
            </label>
          </div>

          {isLinkedLoadout && (
            <div
              className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-2.5 py-1.5 text-[10px] text-emerald-800 dark:text-emerald-300"
              data-testid="loadout-auto-sets"
            >
              <span className="font-semibold">Loadout auto-linked:</span>{" "}
              {linkedSetSummary.length > 0
                ? linkedSetSummary.join(" · ")
                : "Set pieces (Vigilante, Tek, Synth, Gladiator) calculated automatically from equipped loadout slots."}
            </div>
          )}

          {isLinkedLoadout ? (
            (wfFamily === "yareli" && isSecondaryWeapon) ||
            wfFamily === "zephyr" ||
            wfFamily === "garuda" ||
            hasTenaciousBond ||
            hasReinforcedBond ? (
              <div className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5 space-y-1">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Loadout passives & bonds
                </div>
                {wfFamily === "yareli" && isSecondaryWeapon && (
                  <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                    <span>Yareli Critical Flow (+200% CC while moving)</span>
                    <input
                      type="checkbox"
                      checked={!!simParams.applyYareliCriticalFlow}
                      onChange={(e) =>
                        onSimParamsChange({
                          ...simParams,
                          applyYareliCriticalFlow: e.target.checked,
                        })
                      }
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                    />
                  </label>
                )}
                {wfFamily === "zephyr" && (
                  <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                    <span>Zephyr Aerodynamic (+150% CC while airborne)</span>
                    <input
                      type="checkbox"
                      checked={!!simParams.applyZephyrAirborne}
                      onChange={(e) =>
                        onSimParamsChange({
                          ...simParams,
                          applyZephyrAirborne: e.target.checked,
                        })
                      }
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                    />
                  </label>
                )}
                {wfFamily === "garuda" && (
                  <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                    <span>Garuda Death&apos;s Gate (+100% Damage)</span>
                    <input
                      type="checkbox"
                      checked={!!simParams.applyGarudaDeathsGate}
                      onChange={(e) =>
                        onSimParamsChange({
                          ...simParams,
                          applyGarudaDeathsGate: e.target.checked,
                        })
                      }
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                    />
                  </label>
                )}
                {hasTenaciousBond && (
                  <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                    <span>Tenacious Bond (+1.2× Crit Damage)</span>
                    <input
                      type="checkbox"
                      checked={simParams.applyTenaciousBondCrit !== false}
                      onChange={(e) =>
                        onSimParamsChange({
                          ...simParams,
                          applyTenaciousBondCrit: e.target.checked,
                        })
                      }
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                    />
                  </label>
                )}
                {hasReinforcedBond && (
                  <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                    <span>Reinforced Bond (+60% Fire Rate)</span>
                    <input
                      type="checkbox"
                      checked={simParams.applyReinforcedBondFireRate !== false}
                      onChange={(e) =>
                        onSimParamsChange({
                          ...simParams,
                          applyReinforcedBondFireRate: e.target.checked,
                        })
                      }
                      className="h-3.5 w-3.5 rounded border-border accent-primary"
                    />
                  </label>
                )}
              </div>
            ) : null
          ) : (
            <div className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5 space-y-1">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                External passives & bonds (what-if)
              </div>
              {isSecondaryWeapon && (
                <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                  <span>Yareli Critical Flow (+200% CC while moving)</span>
                  <input
                    type="checkbox"
                    checked={!!simParams.applyYareliCriticalFlow}
                    onChange={(e) =>
                      onSimParamsChange({
                        ...simParams,
                        applyYareliCriticalFlow: e.target.checked,
                      })
                    }
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                </label>
              )}
              <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                <span>Zephyr Aerodynamic (+150% CC while airborne)</span>
                <input
                  type="checkbox"
                  checked={!!simParams.applyZephyrAirborne}
                  onChange={(e) =>
                    onSimParamsChange({
                      ...simParams,
                      applyZephyrAirborne: e.target.checked,
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                <span>Garuda Death&apos;s Gate (+100% Damage)</span>
                <input
                  type="checkbox"
                  checked={!!simParams.applyGarudaDeathsGate}
                  onChange={(e) =>
                    onSimParamsChange({
                      ...simParams,
                      applyGarudaDeathsGate: e.target.checked,
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                <span>Tenacious Bond (+1.2× Crit Damage)</span>
                <input
                  type="checkbox"
                  checked={simParams.applyTenaciousBondCrit === true}
                  onChange={(e) =>
                    onSimParamsChange({
                      ...simParams,
                      applyTenaciousBondCrit: e.target.checked,
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-border accent-primary"
                />
              </label>
              {!isMelee && (
                <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground cursor-pointer">
                  <span>Reinforced Bond (+60% Fire Rate)</span>
                  <input
                    type="checkbox"
                    checked={simParams.applyReinforcedBondFireRate === true}
                    onChange={(e) =>
                      onSimParamsChange({
                        ...simParams,
                        applyReinforcedBondFireRate: e.target.checked,
                      })
                    }
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                </label>
              )}
            </div>
          )}
          {isMelee && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between border-b border-border/40 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Melee Combo Counter
                </span>
                <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {comboTier(simParams.comboCount)}× Multiplier
                </span>
              </div>
              <SimSlider
                label="Combo Hits"
                subtitle="Blood Rush (+CC), Weeping Wounds (+SC), Gladiator & Heavy scaling"
                value={simParams.comboCount}
                min={0}
                max={260}
                step={20}
                onChange={(v) => onSimParamsChange({ ...simParams, comboCount: v })}
                formatValue={(v) => `${comboTier(v)}× (${v} hits)`}
                presets={[
                  { label: "1× (0)", value: 0 },
                  { label: "2× (20)", value: 20 },
                  { label: "4× (60)", value: 60 },
                  { label: "8× (140)", value: 140 },
                  { label: "12× (220)", value: 220 },
                ]}
                tooltip="Consecutive melee combo counter. Blood Rush, Weeping Wounds, Gladiator, and heavy attacks share one track: 1× below 20 hits, then 2×…12× every 20 hits (220+ = 12×). Bonus = mod% × (CM−1), additive with other chance mods."
              />
            </div>
          )}

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-border/40 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {isMelee ? "On-Kill Stacks (Melee)" : "Galvanized & Kill Stacks"}
              </span>
              <span className="text-[9px] text-muted-foreground">
                Shared control
              </span>
            </div>
            <SimSlider
              label={isMelee ? "Melee Kill Stacks" : "Shared Kill Stacks"}
              subtitle={
                isMelee
                  ? "Galvanized Steel, Galvanized Elementalist, Berserker Fury"
                  : "Galvanized Chamber/Hell/Diffusion, Scope/Crosshairs, Aptitude/Savvy/Shot"
              }
              value={simParams.killStacks}
              min={0}
              max={5}
              onChange={(v) => onSimParamsChange({ ...simParams, killStacks: v, killStacksBySource: undefined })}
              presets={[
                { label: "0", value: 0 },
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5 (Max)", value: 5 },
              ]}
              tooltip="On-kill stacks — Galvanized Chamber/Scope (max 5), Hell/Diffusion (max 4), Aptitude/Savvy (max 2), Shot (max 3), Berserker Fury (max 2). Any stacks also activate non-stacking on-kill buffs (Bladed Rounds, Shrapnel Shot, etc.). Moving this slider resets the per-source values below."
            />
            {killSources.length > 1 && (
              <div className="space-y-1.5 border-l-2 border-primary/30 pl-2.5 my-1.5" data-testid="kill-stack-sources">
                <span className="block text-[10px] font-medium text-muted-foreground">
                  Per-Mod Stacks (Fine-tune overrides):
                </span>
                {killSources.map((src) => {
                  const modTitle = src.modName ?? src.label;
                  const modSubtitle =
                    src.modName && src.modName !== src.label
                      ? `${src.label} · cap ${src.cap}`
                      : `In-game cap ${src.cap}`;
                  return (
                    <SimSlider
                      key={src.id}
                      label={modTitle}
                      subtitle={modSubtitle}
                      value={Math.min(ks(src.id as KillStackSource), src.cap)}
                      min={0}
                      max={src.cap}
                      onChange={(v) =>
                        onSimParamsChange({
                          ...simParams,
                          killStacksBySource: { ...simParams.killStacksBySource, [src.id]: v },
                        })
                      }
                      tooltip={`Stacks for ${modTitle} only (in-game max ${src.cap}). Defaults to the shared Kill Stacks value.`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-border/40 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Target Status & Arcanes
              </span>
            </div>
            <SimSlider
              label="Status Types on Target"
              subtitle={
                isMelee
                  ? "Condition Overload (+80% direct dmg per status) · Galvanized Elementalist"
                  : "Galvanized Aptitude / Savvy / Shot (+40-80% direct dmg per status)"
              }
              value={simParams.statusTypesOnTarget}
              min={0}
              max={14}
              onChange={(v) => onSimParamsChange({ ...simParams, statusTypesOnTarget: v })}
              presets={[
                { label: "0", value: 0 },
                { label: "2", value: 2 },
                { label: "4 (Common)", value: 4 },
                { label: "8", value: 8 },
                { label: "14 (All)", value: 14 },
              ]}
              tooltip="Unique status types on target — Condition Overload, Galvanized Aptitude/Savvy/Shot. No in-game cap; 14 = every status type including Tau (wiki.warframe.com lists Tau, fandom does not)."
            />
            <SimSlider
              label={singleArcane ? (singleArcane.modName ?? singleArcane.label) : "Arcane Stacks"}
              subtitle={
                singleArcane
                  ? `Equipped arcane (${singleArcane.label}) · cap ${arcaneMax}`
                  : `Stack count for stacking arcanes (cap ${arcaneMax})`
              }
              value={Math.min(simParams.arcaneStacks, arcaneMax)}
              min={0}
              max={arcaneMax}
              onChange={(v) => onSimParamsChange({ ...simParams, arcaneStacks: v, arcaneStacksById: undefined })}
              presets={
                arcaneMax === 12
                  ? [
                      { label: "0", value: 0 },
                      { label: "6", value: 6 },
                      { label: "12 (Max)", value: 12 },
                    ]
                  : arcaneMax === 40
                  ? [
                      { label: "0", value: 0 },
                      { label: "10", value: 10 },
                      { label: "20", value: 20 },
                      { label: "40 (Max)", value: 40 },
                    ]
                  : undefined
              }
              tooltip={
                arcaneSources.length > 0
                  ? `Stack count for equipped stacking arcanes: ${arcaneSources.map((a) => `${a.label} (max ${a.cap})`).join(", ")}. Each arcane clamps to its own cap.`
                  : "Stack count for stacking arcanes like Primary/Secondary/Melee Merciless (max 12). The max follows the equipped arcane's cap."
              }
            />
            {arcaneSources.length > 1 && (
              <div className="space-y-1.5 border-l-2 border-primary/30 pl-2.5 my-1.5" data-testid="arcane-stack-sources">
                <span className="block text-[10px] font-medium text-muted-foreground">
                  Per-Arcane Stacks:
                </span>
                {arcaneSources.map((a) => (
                  <SimSlider
                    key={a.id}
                    label={a.label}
                    subtitle={`In-game cap ${a.cap}`}
                    value={Math.min(simParams.arcaneStacksById?.[a.id] ?? simParams.arcaneStacks, a.cap)}
                    min={0}
                    max={a.cap}
                    onChange={(v) =>
                      onSimParamsChange({
                        ...simParams,
                        arcaneStacksById: { ...simParams.arcaneStacksById, [a.id]: v },
                      })
                    }
                    tooltip={`Stacks for ${a.label} only (in-game max ${a.cap}). Defaults to the shared Arcane Stacks value.`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Off-weapon what-if set bonuses (Gladiator, Vigilante, Tek, Synth, Overcharge) */}
          {(!isLinkedLoadout && (isMelee || (weapon && weaponSupportsPrimaryStyleSets(weapon)) || (weapon && weaponAcceptsSynthReloadBonus(weapon)) || stats.usesWarframeMaxEnergy)) && (
            <CollapsibleSection title="Off-Weapon Sets (What-If)" defaultOpen={false}>
              <div className="space-y-2 pt-1 pb-1">
                {stats.usesWarframeMaxEnergy && (
                  <SimSlider
                    label="WF Max Energy (Overcharge)"
                    value={simParams.warframeMaxEnergy ?? 0}
                    min={0}
                    max={1000}
                    onChange={(v) => onSimParamsChange({ ...simParams, warframeMaxEnergy: v })}
                    tooltip="Primary Overcharge: Multishot = 35% of your Warframe's Max Energy while energy is above 90%, capped by rank (R5 +350% at 1000 Max Energy). 0 = not set (no bonus). Loadouts fill this from the equipped Warframe."
                  />
                )}
                {isMelee && (
                  <SimSlider
                    label="WF Gladiator"
                    value={simParams.extraGladiatorMods}
                    min={0}
                    max={3}
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
                      tooltip="Tek mods on other slots (Collateral on frame, Gravity on melee, Assault/Enhance on Kavat). Each piece grows the companion's damage zone (set summary only, no weapon DPS)."
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
                    tooltip="Synth Fiber + Deconstruct on companion and Synth Reflex on Warframe (max 3 off this pistol). Each piece makes holstered weapons reload 5% of their magazine per second (set summary only, no weapon DPS)."
                  />
                )}
              </div>
            </CollapsibleSection>
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
            {weapon && SNIPER_DATA[weapon.id] && (
              <div className="grid grid-cols-2 gap-1.5">
                {SNIPER_DATA[weapon.id].zooms.length > 0 && (
                  <label
                    className="block text-[10px] text-muted-foreground"
                    title="Wiki Sniper Rifle zoom buffs (crit chance, crit multiplier or headshot damage)"
                  >
                    Sniper zoom
                    <select
                      value={simParams.sniperZoomLevel ?? 0}
                      onChange={(e) =>
                        onSimParamsChange({ ...simParams, sniperZoomLevel: Number(e.target.value) })
                      }
                      className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                    >
                      <option value={0}>Unscoped</option>
                      {SNIPER_DATA[weapon.id].zooms.map((z, i) => (
                        <option key={z.label} value={i + 1}>
                          {z.label} ({sniperZoomBuffLabel(z)})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label
                  className="block text-[10px] text-muted-foreground"
                  title={`Wiki Shot Combo Counter — min combo ${SNIPER_DATA[weapon.id].minCombo}, ${SNIPER_DATA[weapon.id].comboDuration}s decay`}
                >
                  Shot combo
                  <select
                    value={simParams.sniperComboTier ?? 0}
                    onChange={(e) =>
                      onSimParamsChange({ ...simParams, sniperComboTier: Number(e.target.value) })
                    }
                    className="mt-0.5 h-7 w-full rounded border border-border bg-background px-1.5 text-[11px]"
                  >
                    <option value={0}>Off</option>
                    {Array.from({ length: SNIPER_MAX_COMBO_TIER }, (_, i) => i + 1).map((t) => (
                      <option key={t} value={t}>
                        {sniperComboMultiplier(t)}× ({sniperComboHitsRequired(SNIPER_DATA[weapon.id].minCombo, t)}+ hits)
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
            <label className="block text-[10px] text-muted-foreground" title="Bane / Expel / Smite apply (1+bonus) on hits and squared on DoTs. Sentient Incision picks its parallel weakness element from this faction.">
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
                <option value="Infested Deimos">Infested Deimos</option>
                <option value="Corrupted">Corrupted / Orokin</option>
                <option value="Sentient">Sentient</option>
                <option value="Murmur">The Murmur</option>
                <option value="Narmer">Narmer</option>
                <option value="Scaldra">Scaldra</option>
                <option value="Techrot">Techrot</option>
                <option value="Anarchs">Anarchs</option>
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
            <label
              className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer"
              title="Steel Path: ×2.5 Health & Shields after level scaling (armor unchanged). Applies to TIME TO KILL below."
            >
              <input
                type="checkbox"
                checked={!!simParams.steelPath}
                onChange={(e) =>
                  onSimParamsChange({ ...simParams, steelPath: e.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-border accent-amber-500"
              />
              <span>
                Steel Path
                <span className="ml-1 text-[9px] text-amber-800/80 dark:text-amber-400/80">
                  ×2.5 HP/Shield
                </span>
              </span>
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
                    <span className="text-cyan-700 dark:text-cyan-400 font-mono">
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
            <div className="text-[10px] text-amber-800 dark:text-amber-400">
              Status damage: +{((stats.statusDamageBonus ?? 0) * 100).toFixed(0)}% (Elementalist)
            </div>
          )}
          {simParams.targetFaction && Object.keys(stats.factionBonuses ?? {}).length > 0 && (
            <div className="text-[10px] text-orange-700 dark:text-orange-400">
              Faction mods active vs {simParams.targetFaction}
            </div>
          )}
        {/* Active conditional summary */}
        {hasConditionals && (
          <div className="border-t border-border/50 pt-1 mt-1 space-y-0.5">
            <div className="text-[9px] text-muted-foreground/70 mb-0.5">Active conditional effects:</div>
            {stats.bloodRushStacks > 0 && (
              <div className="text-[10px] text-red-700 dark:text-red-400">Blood Rush: ×{(1 + stats.bloodRushStacks * Math.max(0, stats.comboMultiplier - 1)).toFixed(2)} crit (coef × (CM−1) = {(stats.bloodRushStacks * Math.max(0, stats.comboMultiplier - 1) * 100).toFixed(0)}%)</div>
            )}
            {stats.weepingWoundsBonus > 0 && (
              <div className="text-[10px] text-teal-700 dark:text-teal-400">Weeping Wounds: ×{(1 + stats.weepingWoundsBonus * Math.max(0, stats.comboMultiplier - 1)).toFixed(2)} status (coef × (CM−1) = {(stats.weepingWoundsBonus * Math.max(0, stats.comboMultiplier - 1) * 100).toFixed(0)}%)</div>
            )}
            {stats.conditionOverloadBonus > 0 && (
              <div className="text-[10px] text-purple-700 dark:text-purple-400">Condition Overload: +{(stats.conditionOverloadBonus * stats.simParams.statusTypesOnTarget * 100).toFixed(0)}% DMG ({stats.simParams.statusTypesOnTarget} types)</div>
            )}
            {stats.galvanizedMultishotOnKill > 0 && (() => {
              const msCap = stats.galvanizedMultishotStackCap ?? 5;
              const msStacks = Math.min(simKs("galvMultishot"), msCap);
              return (
                <div className="text-[10px] text-blue-700 dark:text-blue-400">Galv. Multishot: +{(stats.galvanizedMultishotOnKill * msStacks * 100).toFixed(0)}% MS ({msStacks}/{msCap} stacks)</div>
              );
            })()}
            {stats.galvanizedDamagePerStatus > 0 && (() => {
              const cdCap = stats.galvanizedDamagePerStatusStackCap ?? 5;
              const cdStacks = Math.min(simKs("galvCondition"), cdCap);
              return (
                <div className="text-[10px] text-blue-700 dark:text-blue-400">Galv. Condition: +{(stats.galvanizedDamagePerStatus * cdStacks * stats.simParams.statusTypesOnTarget * 100).toFixed(0)}% DMG ({cdStacks}/{cdCap} stacks × {stats.simParams.statusTypesOnTarget} status)</div>
              );
            })()}
            {onKillBuffTotal > 0 && (
              <div className={stats.simParams.killStacks > 0 ? "text-[10px] text-blue-700 dark:text-blue-400" : "text-[10px] text-muted-foreground/70"}>
                On-kill buffs{stats.simParams.killStacks > 0 ? ": " : " (inactive — needs kill stacks): "}
                {Object.entries(stats.onKillStatBonuses ?? {}).map(([k, v]) => `+${(v * 100).toFixed(0)}% ${getModStatLabel(k)}`).join(", ")}
              </div>
            )}
            {triggerBuffTotal > 0 && (
              <div className={stats.simParams.applyTriggerBuffs ? "text-[10px] text-blue-700 dark:text-blue-400" : "text-[10px] text-muted-foreground/70"}>
                Trigger buffs{stats.simParams.applyTriggerBuffs ? ": " : " (inactive — enable Trigger buffs): "}
                {Object.entries(stats.triggerStatBonuses ?? {}).map(([k, v]) => `+${(v * 100).toFixed(0)}% ${getModStatLabel(k)}`).join(", ")}
              </div>
            )}
            {(stats.galvanizedCritOnHeadshot ?? 0) > 0 && (
              stats.simParams.applyHeadshots ? (
                <div className="text-[10px] text-blue-700 dark:text-blue-400">Galv. Crit: +{(((stats.galvanizedCritOnHeadshot ?? 0) + (stats.galvanizedCritOnHeadshotPerStack ?? 0) * Math.min(simKs("galvCrit"), 5)) * 100).toFixed(0)}% CC while aiming ({Math.min(simKs("galvCrit"), 5)} headshot-kill stacks)</div>
              ) : (
                <div className="text-[10px] text-muted-foreground/70">Galv. Crit: inactive — enable Headshots to model on-headshot crit</div>
              )
            )}
            {stats.berserkerFuryBonus > 0 && (
              <div className="text-[10px] text-yellow-700 dark:text-yellow-400">Berserker Fury: +{(stats.berserkerFuryBonus * Math.min(simKs("berserker"), 2) * 100).toFixed(0)}% AS ({Math.min(simKs("berserker"), 2)}/2 stacks)</div>
            )}
            {stats.vigilanteCritBonus && stats.vigilanteCritBonus > 0 && (
              <div className="text-[10px] text-orange-700 dark:text-orange-400" title="Primary rifles/shotguns/bows/archguns only — does not apply to secondaries or melee. Averaged into DPS as bonus crit chance.">
                Vigilante Set: {(stats.vigilanteCritBonus * 100).toFixed(0)}% crit tier enhance chance (in DPS)
              </div>
            )}
            {(stats.firstShotDamageBonus ?? 0) > 0 && (
              <div className="text-[10px] text-blue-700 dark:text-blue-400">
                First shot: +{((stats.firstShotDamageBonus ?? 0) * 100).toFixed(0)}% damage on first shot in magazine (averaged into DPS)
              </div>
            )}
            {(stats.slashOnImpactProcChance ?? 0) > 0 && (
              <div className="text-[10px] text-red-700 dark:text-red-400">
                Internal Bleeding: {((stats.slashOnImpactProcChance ?? 0) * 100).toFixed(0)}% Slash on Impact procs{stats.fireRate < 2.5 ? " (x2 — fire rate < 2.5)" : ""}
              </div>
            )}
          </div>
        )}
        </div>
  );
}

function sniperZoomBuffLabel(z: SniperZoomLevel): string {
  if (z.critChanceFlat) return `+${Math.round(z.critChanceFlat * 100)}% CC`;
  if (z.critMultBonus) return `+${Math.round(z.critMultBonus * 100)}% CD`;
  if (z.headshotDamageBonus) return `+${Math.round(z.headshotDamageBonus * 100)}% HS`;
  return "";
}
