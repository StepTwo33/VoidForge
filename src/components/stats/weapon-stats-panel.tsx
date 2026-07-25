"use client";

import { CalculatedStats, Weapon, SimulationParams } from "@/lib/types";
import { weaponSupportsPrimaryStyleSets, weaponAcceptsSynthReloadBonus } from "@/lib/calc/set-bonuses";
import { useMemo } from "react";
import { IncarnonEvolution } from "@/data/incarnon";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";
import { getArcaneDisplayInfo } from "@/lib/display/arcane-display";
import {
  computeDpsContributions,
  formatMarginalPct,
  type DpsContributionCategory,
  type WeaponDpsCalcContext,
} from "@/lib/calc/dps-contributions";
import { avgCritMultiplier, critTierDamage, critTiersToShow, critTierLabel, critTierColorClass, exceedsWarframeInt32 } from "@/lib/calc/crit-utils";
import { CollapsibleSection, StatRow } from "./stat-primitives";
import { TTKSection } from "./ttk-section";
import { WeaponSimControls } from "./weapon-sim-controls";
import { useSimStatChangeFlash } from "./use-sim-stat-change-flash";

const ELEMENT_COLORS: Record<string, string> = {
  heat: "text-orange-700 dark:text-orange-400",
  cold: "text-cyan-800 dark:text-cyan-300",
  toxin: "text-green-700 dark:text-green-400",
  electricity: "text-blue-800 dark:text-blue-300",
  blast: "text-yellow-700 dark:text-yellow-400",
  corrosive: "text-lime-700 dark:text-lime-400",
  gas: "text-emerald-800 dark:text-emerald-300",
  magnetic: "text-indigo-800 dark:text-indigo-300",
  radiation: "text-amber-800 dark:text-amber-300",
  viral: "text-teal-800 dark:text-teal-300",
  tau: "text-violet-800 dark:text-violet-300",
  impact: "text-slate-700 dark:text-slate-300",
  puncture: "text-stone-700 dark:text-stone-300",
  slash: "text-red-700 dark:text-red-300",
};

const RADIAL_DAMAGE_KEYS = [
  "impact", "puncture", "slash", "heat", "cold", "toxin", "electricity",
  "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau",
] as const;

const ELEMENT_LABELS: Record<string, string> = {
  heat: "Heat", cold: "Cold", toxin: "Toxin", electricity: "Electricity",
  blast: "Blast", corrosive: "Corrosive", gas: "Gas", magnetic: "Magnetic",
  radiation: "Radiation", viral: "Viral", tau: "Tau",
};

const CONTRIBUTION_CATEGORY_COLORS: Record<DpsContributionCategory, string> = {
  damage: "text-orange-400",
  crit: "text-red-400",
  rate: "text-yellow-400",
  multishot: "text-blue-400",
  elemental: "text-teal-400",
  conditional: "text-purple-400",
  arcane: "text-amber-400",
  external: "text-cyan-400",
  set: "text-lime-400",
  other: "text-muted-foreground",
};

export function WeaponStatsPanel({ stats, baseStats, weapon, isMelee, selectedEvolutions, allEvolutions, simParams, onSimParamsChange, contributionContext }: {
  stats: CalculatedStats | null; baseStats?: CalculatedStats | null; weapon?: Weapon | null; isMelee?: boolean;
  selectedEvolutions?: Record<number, number>; allEvolutions?: IncarnonEvolution[];
  simParams?: SimulationParams; onSimParamsChange?: (p: SimulationParams) => void;
  contributionContext?: WeaponDpsCalcContext | null;
}) {
  const dpsContributions = useMemo(
    () => (contributionContext ? computeDpsContributions(contributionContext) : []),
    [contributionContext],
  );
  const flash = useSimStatChangeFlash(stats, simParams);

  if (!stats) {
    return (
      <div className="border border-border rounded-xl p-4 bg-card">
        <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-3">STATS</h3>
        <p className="text-xs text-muted-foreground">Select a weapon to see stats</p>
      </div>
    );
  }

  const onKillBuffTotal = Object.values(stats.onKillStatBonuses ?? {}).reduce((s, v) => s + v, 0);
  const triggerBuffTotal = Object.values(stats.triggerStatBonuses ?? {}).reduce((s, v) => s + v, 0);
  const hasConditionals = stats.conditionOverloadBonus > 0 || stats.bloodRushStacks > 0
    || stats.galvanizedMultishotOnKill > 0 || stats.galvanizedDamagePerStatus > 0
    || (stats.galvanizedCritOnHeadshot ?? 0) > 0
    || onKillBuffTotal > 0 || triggerBuffTotal > 0
    || stats.berserkerFuryBonus > 0 || stats.weepingWoundsBonus > 0
    || (stats.firstShotDamageBonus ?? 0) > 0
    || (stats.slashOnImpactProcChance ?? 0) > 0
    || (stats.vigilanteCritBonus ?? 0) > 0;

  const showSustainedColumn = dpsContributions.some(
    (c) => Math.abs(c.sustainedMarginalPct - c.burstMarginalPct) > 0.5,
  );
  const ttkFlash = flash.has("ttk") || flash.has("burstDps") || flash.has("sustainedDps")
    || flash.has("directBurstDps") || flash.has("fireRate") || flash.has("criticalChance")
    || flash.has("avgHit") || flash.has("totalDamage") || flash.has("statusDps");

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-1 min-w-0 overflow-x-hidden">
      <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-2">WEAPON STATS</h3>

      {weapon?.passive && (
        <CollapsibleSection title="PASSIVE" defaultOpen>
          <p className="text-[11px] text-muted-foreground leading-relaxed py-1">{weapon.passive}</p>
        </CollapsibleSection>
      )}

      {simParams && onSimParamsChange && (
        <WeaponSimControls
          stats={stats}
          simParams={simParams}
          onSimParamsChange={onSimParamsChange}
          weapon={weapon}
          isMelee={isMelee}
          hasConditionals={hasConditionals}
          onKillBuffTotal={onKillBuffTotal}
          triggerBuffTotal={triggerBuffTotal}
        />
      )}
      {stats.setBonusSummary && stats.setBonusSummary.length > 0 && (
        <CollapsibleSection title="SET BONUSES" defaultOpen={false}>
          <div className="space-y-1 py-1">
            {stats.setBonusSummary.map((row) => (
              <div key={row.setId} className="text-[10px] leading-snug">
                <span className={row.active ? "text-green-400 font-medium" : "text-muted-foreground"}>
                  {row.label}: {row.pieces}/{row.required}
                  {row.active ? " ✓" : ""}
                </span>
                <div className="text-[9px] text-muted-foreground/80 pl-0.5">{row.description}</div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Physical Damage — arsenal-style: unquantized, total × multishot like in-game */}
      {(() => {
        const dmg = stats.arsenalDamage ?? stats;
        const arsenalTotal = dmg.totalDamage * Math.max(1, stats.multishot);
        return (
          <CollapsibleSection title="DIRECT DAMAGE" defaultOpen>
            <StatRow
              label="Total Damage"
              value={arsenalTotal.toFixed(1)}
              highlighted
              changed={flash.has("arsenalTotal") || flash.has("totalDamage")}
            />
            {stats.multishot > 1 && (
              <div className="text-[9px] text-muted-foreground/60 -mt-0.5 mb-0.5">
                {dmg.totalDamage.toFixed(1)} per pellet × {stats.multishot.toFixed(2)} multishot (projectile / hit)
              </div>
            )}
            {stats.multishot <= 1 && (
              <div className="text-[9px] text-muted-foreground/60 -mt-0.5 mb-0.5">
                Projectile / hit damage (excludes radial explosions)
              </div>
            )}
            {(dmg.impact > 0 || (baseStats && baseStats.impact > 0)) && (
              <StatRow label="Impact" value={dmg.impact.toFixed(1)} color="text-slate-400" changed={flash.has("impact")} />
            )}
            {(dmg.puncture > 0 || (baseStats && baseStats.puncture > 0)) && (
              <StatRow label="Puncture" value={dmg.puncture.toFixed(1)} color="text-stone-400" changed={flash.has("puncture")} />
            )}
            {(dmg.slash > 0 || (baseStats && baseStats.slash > 0)) && (
              <StatRow label="Slash" value={dmg.slash.toFixed(1)} color="text-red-400" changed={flash.has("slash")} />
            )}

            {/* Elemental Damage */}
            {dmg.elements && dmg.elements.length > 0 && (
              <>
                <div className="border-t border-border/50 my-1" />
                {dmg.elements.map((e, i) => (
                  <StatRow
                    key={i}
                    label={ELEMENT_LABELS[e.type] || e.type}
                    value={e.value.toFixed(1)}
                    color={ELEMENT_COLORS[e.type]}
                    changed={flash.has("totalDamage") || flash.has("arsenalTotal")}
                  />
                ))}
              </>
            )}
          </CollapsibleSection>
        );
      })()}

      {/* Per-hit damage — no multishot, fire rate, or DPS averaging */}
      {(() => {
        const hitBase = (stats.arsenalDamage ?? stats).totalDamage;
        const cm = stats.criticalMultiplier;
        const cc = stats.criticalChance;
        const avgHit = hitBase * avgCritMultiplier(cc, cm);
        const tiers = critTiersToShow(cc);
        const hitValues = [
          hitBase,
          ...tiers.map((t) => hitBase * critTierDamage(t, cm)),
          avgHit,
        ];
        const showOverflow = hitValues.some(exceedsWarframeInt32);
        return (
          <CollapsibleSection title="HIT DAMAGE" defaultOpen>
            <p className="text-[9px] text-muted-foreground/70 mb-1 leading-snug">
              Per pellet / swing — not DPS (no multishot or fire rate). Orange/red+ rows are tier hit values; Avg hit only blends tiers your crit chance can roll.
            </p>
            <StatRow
              label="Non-crit hit"
              value={hitBase.toFixed(1)}
              highlighted
              changed={flash.has("nonCritHit")}
              tooltip="Raw hit damage before crit averaging, multishot, and fire rate."
            />
            {tiers.map((tier) => {
              const reachable = tier === 1 ? cc > 0 : cc >= tier - 1;
              const tierKey = tier === 1 ? "yellowHit" : tier === 2 ? "orangeHit" : tier === 3 ? "redHit" : `tier${tier}Hit`;
              return (
                <StatRow
                  key={tier}
                  label={critTierLabel(tier)}
                  value={(hitBase * critTierDamage(tier, cm)).toFixed(1)}
                  color={critTierColorClass(tier)}
                  changed={flash.has(tierKey) || (tier > 3 && flash.has("avgHit"))}
                  tooltip={
                    tier === 1
                      ? `Non-crit × ${cm.toFixed(2)} crit multiplier`
                      : reachable
                        ? `Tier-${tier} crit hit (crit chance ≥ ${(tier - 1) * 100}%)`
                        : `Tier-${tier} crit hit — needs ≥${(tier - 1) * 100}% CC (reference only; not in avg hit yet)`
                  }
                />
              );
            })}
            <StatRow
              label="Avg hit"
              value={avgHit.toFixed(1)}
              highlighted
              changed={flash.has("avgHit")}
              tooltip="Expected hit damage across crit tiers your current crit chance can roll (includes orange/red+ when CC &gt; 100%)."
            />
            {showOverflow && (
              <p className="text-[9px] text-amber-500/90 mt-1.5 leading-snug">
                Note: values above ~2.147B can wrap to large negatives in-game (signed 32-bit). FrameHub shows uncapped math.
              </p>
            )}
          </CollapsibleSection>
        );
      })()}

      {/* Core Stats — arsenal-like order before radial */}
      <CollapsibleSection title="CORE" defaultOpen>
        <StatRow
          label={isMelee ? "Attack Speed" : "Fire Rate"}
          value={(stats.effectiveFireRate ?? stats.fireRate).toFixed(2)}
          changed={flash.has("fireRate")}
          tooltip={
            isMelee
              ? "Melee attacks per second (same field as fire rate for guns in the build engine)."
              : stats.effectiveFireRate != null &&
                  Math.abs(stats.effectiveFireRate - stats.fireRate) > 0.01
                ? `Effective shots/sec (charge/bow/burst timing). Arsenal FR component: ${stats.fireRate.toFixed(2)}`
                : "Shots per second used for DPS."
          }
        />
        <StatRow
          label="Critical Chance"
          value={`${(stats.criticalChance * 100).toFixed(1)}%`}
          changed={flash.has("criticalChance")}
        />
        <StatRow
          label="Critical Multiplier"
          value={`${stats.criticalMultiplier.toFixed(2)}x`}
          changed={flash.has("criticalMultiplier")}
        />
        <StatRow
          label="Status Chance"
          value={`${(stats.statusChancePerShot * 100).toFixed(1)}%`}
          changed={flash.has("statusChance")}
        />
        {!isMelee && (
          <StatRow label="Multishot" value={stats.multishot.toFixed(2)} changed={flash.has("multishot")} />
        )}
        {stats.magazine > 0 && <StatRow label="Magazine" value={stats.magazine.toString()} />}
        {stats.reloadTime > 0 && (
          <StatRow
            label="Reload Time"
            value={`${stats.reloadTime.toFixed(2)}s`}
            changed={flash.has("reloadTime")}
          />
        )}
        {stats.range != null && stats.range !== 0 && (
          <StatRow label="Range" value={`+${stats.range.toFixed(1)}m`} tooltip="Incarnon / reach bonus (display)." />
        )}
        {stats.ammoMax != null && stats.ammoMax > 0 && (
          <StatRow label="Ammo Max" value={stats.ammoMax.toString()} tooltip="Incarnon ammo capacity perk (display)." />
        )}
        {stats.punchThrough != null && stats.punchThrough !== 0 && (
          <StatRow
            label="Punch Through"
            value={`+${stats.punchThrough.toFixed(1)}m`}
            tooltip="Incarnon / riven punch through (display; not modeled in DPS)."
          />
        )}
        {stats.projectileSpeed != null && stats.projectileSpeed !== 0 && (
          <StatRow
            label="Projectile Speed"
            value={`${stats.projectileSpeed > 0 ? "+" : ""}${(stats.projectileSpeed * 100).toFixed(0)}%`}
            tooltip="Incarnon / riven projectile speed (display; not modeled in DPS)."
          />
        )}
        {stats.followThrough != null && stats.followThrough !== 0 && (
          <StatRow
            label="Follow Through"
            value={`${stats.followThrough > 0 ? "+" : ""}${(stats.followThrough * 100).toFixed(0)}%`}
            tooltip="Incarnon follow-through bonus (display; not modeled in DPS)."
          />
        )}
        {stats.accuracy != null && stats.accuracy !== 0 && (
          <StatRow
            label="Accuracy"
            value={`${stats.accuracy > 0 ? "+" : ""}${(stats.accuracy * 100).toFixed(0)}%`}
            tooltip="Incarnon / riven accuracy (display; not modeled in DPS). Aim-gated perks assume uptime."
          />
        )}
        {stats.recoil != null && stats.recoil !== 0 && (
          <StatRow
            label="Recoil"
            value={`${stats.recoil > 0 ? "+" : ""}${(stats.recoil * 100).toFixed(0)}%`}
            color={stats.recoil < 0 ? "text-green-400" : undefined}
            tooltip="Incarnon / riven recoil (display; negative = less recoil). Not modeled in DPS."
          />
        )}
        {stats.zoom != null && stats.zoom !== 0 && (
          <StatRow
            label="Zoom"
            value={`${stats.zoom > 0 ? "+" : ""}${(stats.zoom * 100).toFixed(0)}%`}
            color={stats.zoom < 0 ? "text-green-400" : undefined}
            tooltip="Incarnon / riven zoom (display; negative = less zoom). Not modeled in DPS."
          />
        )}
        {stats.holsterReloadPerSec != null && stats.holsterReloadPerSec !== 0 && (
          <StatRow
            label="Holster Reload"
            value={`${(stats.holsterReloadPerSec * 100).toFixed(0)}%/s`}
            color="text-sky-400"
            tooltip="Magazine fraction reloaded per second while holstered (display; swap-gated — not in same-weapon sustained DPS)."
          />
        )}
        {stats.instantReloadOnKillChance != null && stats.instantReloadOnKillChance > 0 && (
          <StatRow
            label="Instant Reload (Kill)"
            value={`${(stats.instantReloadOnKillChance * 100).toFixed(0)}%`}
            color="text-amber-400"
            tooltip="Chance to instantly reload on kill. Sustained DPS assumes one qualifying opportunity per magazine dump."
          />
        )}
        {stats.instantReloadOnHeadshotChance != null && stats.instantReloadOnHeadshotChance > 0 && (
          <StatRow
            label="Instant Reload (HS)"
            value={`${(stats.instantReloadOnHeadshotChance * 100).toFixed(0)}%`}
            color="text-amber-400"
            tooltip="Chance to instantly reload on headshot / headshot-kill. Sustained DPS assumes one qualifying opportunity per magazine dump."
          />
        )}
        {(stats.sprintSpeedBonus ?? 0) !== 0 && (
          <StatRow
            label="Sprint Speed"
            value={`${(stats.sprintSpeedBonus ?? 0) > 0 ? "+" : ""}${((stats.sprintSpeedBonus ?? 0) * 100).toFixed(0)}%`}
            color="text-cyan-400"
            tooltip="Warframe sprint speed while this weapon is equipped (Amalgam Serration, etc.)."
          />
        )}
        {(stats.slideSpeedBonus ?? 0) !== 0 && (
          <StatRow
            label="Slide Speed"
            value={`${(stats.slideSpeedBonus ?? 0) > 0 ? "+" : ""}${((stats.slideSpeedBonus ?? 0) * 100).toFixed(0)}%`}
            color="text-cyan-400"
            tooltip="Warframe slide speed while this weapon is equipped."
          />
        )}
        {(stats.parkourVelocityBonus ?? 0) !== 0 && (
          <StatRow
            label="Parkour Velocity"
            value={`${(stats.parkourVelocityBonus ?? 0) > 0 ? "+" : ""}${((stats.parkourVelocityBonus ?? 0) * 100).toFixed(0)}%`}
            color="text-cyan-400"
            tooltip="Warframe parkour velocity while this weapon is equipped (display)."
          />
        )}
        {(stats.movementSpeedBonus ?? 0) !== 0 && (
          <StatRow
            label="Movement Speed"
            value={`${(stats.movementSpeedBonus ?? 0) > 0 ? "+" : ""}${((stats.movementSpeedBonus ?? 0) * 100).toFixed(0)}%`}
            color="text-cyan-400"
            tooltip="Warframe movement speed while this weapon is equipped (display; aim-gated perks assume uptime)."
          />
        )}
        {stats.ammoRestoreChance != null && stats.ammoRestoreChance > 0 && (
          <StatRow
            label="Ammo Restore"
            value={
              stats.ammoRestoreMagFraction != null && stats.ammoRestoreMagFraction > 0
                ? `${(stats.ammoRestoreChance * 100).toFixed(0)}% → ${(stats.ammoRestoreMagFraction * 100).toFixed(0)}% mag`
                : `${(stats.ammoRestoreChance * 100).toFixed(0)}% → ${stats.ammoRestoreFlat ?? 0} rnd`
            }
            color="text-amber-400"
            tooltip="Chance to restore ammo on perk trigger. Sustained DPS assumes one opportunity per magazine dump (extends effective mag)."
          />
        )}
        {stats.lingeringFieldDurationMult != null && stats.lingeringFieldDurationMult > 0 && (
          <StatRow
            label="Linger Field Duration"
            value={`×${stats.lingeringFieldDurationMult}`}
            color="text-emerald-400"
            tooltip="Lingering damage-field duration mult after empty reload (display)."
          />
        )}
        {stats.incarnonHeadshotChargeBonus != null && stats.incarnonHeadshotChargeBonus > 0 && (
          <StatRow
            label="Incarnon Charge (HS)"
            value={`+${(stats.incarnonHeadshotChargeBonus * 100).toFixed(0)}%`}
            color="text-violet-400"
            tooltip="Extra Incarnon Transmutation charge from headshots (display)."
          />
        )}
        {stats.silentWeapon && (
          <StatRow
            label="Silent"
            value="Yes"
            color="text-emerald-400"
            tooltip="Weapon fire does not alert enemies (Silent Running)."
          />
        )}
        {stats.comboTimerPauseWhenHolstered && (
          <StatRow
            label="Holster Combo Pause"
            value="Yes"
            color="text-sky-400"
            tooltip="Melee combo timer pauses while this weapon is holstered (Standoff / Abiding Hold)."
          />
        )}
        {stats.comboOnAmmoPickup != null && stats.comboOnAmmoPickup > 0 && (
          <StatRow
            label="Combo on Ammo Pickup"
            value={`+${stats.comboOnAmmoPickup}`}
            color="text-orange-400"
            tooltip="Melee combo counter gained when collecting ammo (display)."
          />
        )}
        {stats.extraJumps != null && stats.extraJumps > 0 && (
          <StatRow
            label="Extra Jumps"
            value={`+${stats.extraJumps}`}
            color="text-cyan-400"
            tooltip="Additional mid-air jumps (display)."
          />
        )}
        {stats.jumpStrength != null && stats.jumpStrength !== 0 && (
          <StatRow
            label="Jump Strength"
            value={`${stats.jumpStrength > 0 ? "+" : ""}${(stats.jumpStrength * 100).toFixed(0)}%`}
            color="text-cyan-400"
            tooltip="Double-jump / jump strength bonus (display)."
          />
        )}
        {stats.healRegenPerSec != null && stats.healRegenPerSec > 0 && (
          <StatRow
            label="Heal Regen"
            value={`${stats.healRegenPerSec}/s`}
            color="text-emerald-400"
            tooltip="Heal regeneration from perk trigger (display; duration not modeled)."
          />
        )}
        {stats.statusChanceVulnerability != null && stats.statusChanceVulnerability > 0 && (
          <StatRow
            label="Status Vuln"
            value={`+${(stats.statusChanceVulnerability * 100).toFixed(0)}%`}
            color="text-purple-400"
            tooltip="Target status-chance vulnerability (assumes uptime; multiplies modded SC for paper DPS)."
          />
        )}
        {stats.punctureStatusOnImpale != null && stats.punctureStatusOnImpale > 0 && (
          <StatRow
            label="Impale Puncture"
            value={`${stats.punctureStatusOnImpale}`}
            color="text-yellow-400"
            tooltip="Puncture status stacks while impaled (display)."
          />
        )}
        {stats.finisherComboCountChance != null && stats.finisherComboCountChance > 0 && (
          <StatRow
            label="Finisher Combo Chance"
            value={`+${(stats.finisherComboCountChance * 100).toFixed(0)}%`}
            color="text-orange-400"
            tooltip="Combo count chance on finishers (display)."
          />
        )}
      </CollapsibleSection>

      {stats.radialAttacks && stats.radialAttacks.length > 0 && (
        <CollapsibleSection title="RADIAL ATTACK" defaultOpen>
          {stats.radialAttacks.map((attack, idx) => (
            <div key={`${attack.name}-${idx}`} className={idx > 0 ? "mt-2 pt-2 border-t border-border/50" : ""}>
              {stats.radialAttacks!.length > 1 && (
                <div className="text-[10px] font-medium text-muted-foreground mb-1">{attack.name}</div>
              )}
              <StatRow label="Total Damage" value={attack.totalDamage.toFixed(1)} highlighted />
              {RADIAL_DAMAGE_KEYS.map((key) => {
                const val = attack[key];
                if (val == null || val <= 0) return null;
                const label = ELEMENT_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <StatRow
                    key={key}
                    label={label}
                    value={val.toFixed(1)}
                    color={ELEMENT_COLORS[key]}
                  />
                );
              })}
              <StatRow label="Radius" value={`${attack.radius.toFixed(1)}m`} />
              {attack.explosionDelay != null && attack.explosionDelay > 0 && (
                <StatRow label="Delay" value={`${attack.explosionDelay.toFixed(1)}s`} />
              )}
              {attack.falloffReduction != null && attack.falloffReduction > 0 && (
                <StatRow
                  label="Falloff"
                  value={`${(attack.falloffReduction * 100).toFixed(0)}%`}
                  tooltip="Damage reduction at the edge of the blast radius (center = full damage)."
                />
              )}
              {"burstDps" in attack && typeof attack.burstDps === "number" && attack.burstDps > 0 && (
                <StatRow
                  label="Burst DPS"
                  value={attack.burstDps.toFixed(0)}
                  highlighted
                  tooltip="Estimated DPS from this radial when it procs at the inferred rate (innate explosions scale with fire rate and multishot)."
                />
              )}
              {"burstDps" in attack && typeof attack.burstDps === "number" && attack.burstDps === 0 && /slam/i.test(attack.name) && (
                <StatRow
                  label="Burst DPS"
                  value="Manual"
                  tooltip="Slam radials are player-triggered; not included in weapon burst/sustained DPS totals."
                />
              )}
              {"includedInDirect" in attack && attack.includedInDirect === true && (
                <StatRow
                  label="Burst DPS"
                  value="In weapon DPS"
                  tooltip="This explosion is already part of the weapon's listed damage, so it's counted in the main DPS instead of added again."
                />
              )}
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Melee-specific */}
      {isMelee && stats.heavyAttackDamage > 0 && (
        <CollapsibleSection title="MELEE" defaultOpen>
          {stats.comboCount !== simParams?.comboCount && (
            <StatRow
              label="Effective combo hits"
              value={String(stats.comboCount)}
              tooltip="Sim slider + innate weapon combo + Corrupt Charge initial combo (and arcane bonuses when equipped)."
            />
          )}
          <StatRow
            label="Combo mult (BR/WW)"
            value={`${stats.comboMultiplier.toFixed(1)}x`}
            tooltip="Combo counter multiplier used by Blood Rush, Weeping Wounds, and Gladiator (1× below first tier, then 2×…12×). Bonus = mod% × (CM−1), additive with other chance mods."
          />
          <StatRow
            label="Heavy attack mult"
            value={`${stats.heavyAttackComboMultiplier.toFixed(1)}x`}
            tooltip="Heavy Attack Multiplier (same track as combo mult: 2× at first tier, +1× per tier to 12× at 220+ hits on standard weapons)."
          />
          <StatRow label="Combo Duration" value={`${stats.comboDuration.toFixed(0)}s`} />
          <StatRow label="Heavy Attack" value={stats.heavyAttackDamage.toFixed(0)} highlighted changed={flash.has("heavyAttack")} />
          {stats.finisherDamage != null && stats.finisherDamage !== 0 && (
            <StatRow
              label="Finisher Damage"
              value={`${stats.finisherDamage > 0 ? "+" : ""}${(stats.finisherDamage * 100).toFixed(0)}%`}
              color="text-orange-400"
              tooltip="Incarnon finisher damage bonus (display; not modeled in DPS)."
            />
          )}
          {stats.slamRadius != null && stats.slamRadius !== 0 && (
            <StatRow
              label="Slam Radius"
              value={`${stats.slamRadius > 0 ? "+" : ""}${(stats.slamRadius * 100).toFixed(0)}%`}
              color="text-orange-400"
              tooltip="Incarnon slam radius bonus (display; not modeled in DPS)."
            />
          )}
          {stats.comboOnFinisher != null && stats.comboOnFinisher > 0 && (
            <StatRow
              label="Combo on Finisher"
              value={`+${stats.comboOnFinisher}`}
              color="text-orange-400"
              tooltip="Flat combo granted on finisher (display)."
            />
          )}
          {stats.comboOnSlashStatus != null && stats.comboOnSlashStatus > 0 && (
            <StatRow
              label="Combo on Slash Status"
              value={`+${stats.comboOnSlashStatus}`}
              color="text-orange-400"
              tooltip="Extra combo on Slash-status targets (display)."
            />
          )}
          {stats.comboOnToxinStatus != null && stats.comboOnToxinStatus > 0 && (
            <StatRow
              label="Combo on Toxin Status"
              value={`+${stats.comboOnToxinStatus}`}
              color="text-orange-400"
              tooltip="Extra combo on Toxin-status targets (display)."
            />
          )}
          {stats.comboOnColdStatus != null && stats.comboOnColdStatus > 0 && (
            <StatRow
              label="Combo on Cold Status"
              value={`+${stats.comboOnColdStatus}`}
              color="text-orange-400"
              tooltip="Extra combo on Cold-status targets (display)."
            />
          )}
          {stats.comboOnUndamaged != null && stats.comboOnUndamaged > 0 && (
            <StatRow
              label="Combo on Undamaged"
              value={`+${stats.comboOnUndamaged}`}
              color="text-orange-400"
              tooltip="Extra combo on undamaged enemies (display)."
            />
          )}
          {stats.comboPerSlamHit != null && stats.comboPerSlamHit > 0 && (
            <StatRow
              label="Combo per Slam Hit"
              value={`+${stats.comboPerSlamHit}`}
              color="text-orange-400"
              tooltip="Combo per enemy hit by slam radius (display)."
            />
          )}
          {stats.comboPerSlideHit != null && stats.comboPerSlideHit > 0 && (
            <StatRow
              label="Combo per Slide Hit"
              value={`+${stats.comboPerSlideHit}`}
              color="text-orange-400"
              tooltip="Combo per enemy hit by slide attack (display)."
            />
          )}
          {stats.comboPerSlideMeters != null && stats.comboPerSlideMeters > 0 && (
            <StatRow
              label="Combo per Slide"
              value={`+${stats.comboPerSlideMeters}/${stats.comboSlideMeterInterval ?? 10}m`}
              color="text-orange-400"
              tooltip="Combo gained per continuous slide distance (display)."
            />
          )}
          {stats.comboOnShardDamage != null && stats.comboOnShardDamage > 0 && (
            <StatRow
              label="Combo on Shard"
              value={`+${stats.comboOnShardDamage}`}
              color="text-orange-400"
              tooltip="Combo granted on shard damage (display)."
            />
          )}
          {stats.stunRadiusOnFinisher != null && stats.stunRadiusOnFinisher > 0 && (
            <StatRow
              label="Finisher Stun Radius"
              value={`${stats.stunRadiusOnFinisher}m`}
              color="text-yellow-400"
              tooltip="Stun radius on finisher (display)."
            />
          )}
          {stats.knockdownRadiusOnFinisher != null && stats.knockdownRadiusOnFinisher > 0 && (
            <StatRow
              label="Finisher KD Radius"
              value={`${stats.knockdownRadiusOnFinisher}m`}
              color="text-yellow-400"
              tooltip="Knockdown radius on ground finisher (display)."
            />
          )}
          {stats.shardDuration != null && stats.shardDuration > 0 && (
            <StatRow
              label="Shard Duration"
              value={`${stats.shardDuration}s`}
              color="text-violet-400"
              tooltip="Embedded shard duration (display)."
            />
          )}
          {stats.shardWeakSpotCritBonus != null && stats.shardWeakSpotCritBonus !== 0 && (
            <StatRow
              label="Shard Weak Spot CC"
              value={`+${(stats.shardWeakSpotCritBonus * 100).toFixed(0)}%`}
              color="text-violet-400"
              tooltip="Extra crit chance vs shard weak spots (display)."
            />
          )}
          {stats.shardDamageMult != null && stats.shardDamageMult !== 0 && (
            <StatRow
              label="Shard Damage"
              value={`${stats.shardDamageMult > 0 ? "+" : ""}${(stats.shardDamageMult * 100).toFixed(0)}%`}
              color="text-violet-400"
              tooltip="Shard damage multiplier (display)."
            />
          )}
          {stats.shardFullyGrownDamageMult != null && stats.shardFullyGrownDamageMult > 0 && (
            <StatRow
              label="Grown Shard Erupt"
              value={`×${stats.shardFullyGrownDamageMult}`}
              color="text-violet-400"
              tooltip="Fully grown shard erupt damage mult (display)."
            />
          )}
          {stats.bloodRushStacks > 0 && (
            <StatRow
              label="Blood Rush"
              value={`+${(stats.bloodRushStacks * 100).toFixed(0)}% × (CM−1)`}
              color="text-red-400"
              tooltip="Multiplies modded crit chance by (1 + this × (melee scaling multiplier − 1))"
            />
          )}
          {stats.conditionOverloadBonus > 0 && (
            <StatRow
              label="Condition Overload"
              value={`+${(stats.conditionOverloadBonus * 100).toFixed(0)}%/status`}
              color="text-purple-400"
              tooltip="Damage bonus per unique status type on target"
            />
          )}
        </CollapsibleSection>
      )}

      {/* DPS — direct hit vs radial shown separately; totals include both when radial applies */}
      <CollapsibleSection title="DPS" defaultOpen>
        {(() => {
          const radialBurst = stats.radialBurstDps ?? 0;
          const radialSustained = stats.radialSustainedDps ?? 0;
          const contagionCloud = stats.contagionCloudDps ?? 0;
          const mechaSpread = stats.mechaSpreadDps ?? 0;
          const shardChain = stats.shardChainDps ?? 0;
          const extraAoE = contagionCloud + mechaSpread + shardChain;
          const directBurst = Math.max(0, stats.burstDps - radialBurst - extraAoE);
          const directSustained = Math.max(0, stats.sustainedDps - radialSustained - extraAoE);
          const showOverflow = [directBurst, directSustained, stats.burstDps, stats.sustainedDps].some(
            exceedsWarframeInt32,
          );
          const showTotals = radialBurst > 0 || extraAoE > 0;
          return (
            <>
              <StatRow
                label="Direct Burst DPS"
                value={directBurst.toFixed(0)}
                highlighted
                changed={flash.has("directBurstDps") || flash.has("burstDps")}
                tooltip="Projectile / hit DPS only (no radial / Contagion / Mecha spread / shards). dmg × multishot × fire rate × avg crit × (faction × headshot × stance when enabled)."
              />
              <StatRow
                label="Direct Sustained DPS"
                value={directSustained.toFixed(0)}
                highlighted
                changed={flash.has("directSustainedDps") || flash.has("sustainedDps")}
                tooltip="Direct burst × (mag time / mag+reload cycle). Melee uses burst (no reload)."
              />
              {radialBurst > 0 && (
                <>
                  <StatRow
                    label="Radial Burst DPS"
                    value={radialBurst.toFixed(0)}
                    color="text-orange-300"
                    changed={flash.has("radialBurstDps")}
                    tooltip="Innate explosion / AoE DPS (not slam radials)."
                  />
                  <StatRow
                    label="Radial Sustained DPS"
                    value={radialSustained.toFixed(0)}
                    color="text-orange-300"
                    changed={flash.has("radialSustainedDps")}
                    tooltip="Radial DPS adjusted for magazine and reload cycle."
                  />
                </>
              )}
              {contagionCloud > 0 && (
                <StatRow
                  label="Contagion Cloud DPS"
                  value={contagionCloud.toFixed(0)}
                  color="text-lime-300"
                  changed={flash.has("contagionCloudDps")}
                  tooltip="Toxic Lash Contagion Cloud (augment): ability toxin DPS × Strength (×2 melee) × sim enemies. Not in TTK."
                />
              )}
              {mechaSpread > 0 && (
                <StatRow
                  label="Mecha Spread DPS"
                  value={mechaSpread.toFixed(0)}
                  color="text-cyan-300"
                  changed={flash.has("mechaSpreadDps")}
                  tooltip="Mecha mark-kill status spread: transferred DoT ticks × claw elemental × (spread + cascade) enemies / mark cooldown. Cascade is a sim estimate, not AI. Not in TTK."
                />
              )}
              {shardChain > 0 && (
                <StatRow
                  label="Shard Chain DPS"
                  value={shardChain.toFixed(0)}
                  color="text-violet-300"
                  changed={flash.has("shardChainDps")}
                  tooltip="Thalys form embed triggers (+ Explosive Growth ×2 erupts) + Chain Shatter heavy detonations (sim shard hosts). Combo on host only. Not in TTK."
                />
              )}
              {showTotals && (
                <>
                  <div className="border-t border-border/50 my-1" />
                  <StatRow
                    label="Total Burst DPS"
                    value={stats.burstDps.toFixed(0)}
                    changed={flash.has("burstDps")}
                    tooltip="Direct + radial + Contagion / Mecha spread / shard chain burst DPS combined."
                  />
                  <StatRow
                    label="Total Sustained DPS"
                    value={stats.sustainedDps.toFixed(0)}
                    changed={flash.has("sustainedDps")}
                    tooltip="Direct + radial + Contagion / Mecha spread / shard chain sustained DPS combined."
                  />
                </>
              )}
              {showOverflow && (
                <p className="text-[9px] text-amber-500/90 mt-1.5 leading-snug">
                  Note: DPS above ~2.147B can wrap to large negatives in-game (signed 32-bit). FrameHub shows uncapped math.
                </p>
              )}
            </>
          );
        })()}
        {stats.statusProcs && stats.statusProcs.length > 0 && (() => {
          const efr = stats.effectiveFireRate ?? stats.fireRate;
          const procsPerSec = stats.statusProcs.reduce(
            (sum, p) => sum + efr * stats.multishot * p.chance,
            0,
          );
          const dotProcs = stats.statusProcs.filter(p => p.totalDamage > 0);
          const statusDps = dotProcs.reduce((sum, p) => {
            const pps = efr * stats.multishot * p.chance;
            return sum + pps * p.totalDamage / p.duration;
          }, 0);
          return (
            <>
              <div className="border-t border-border/50 my-1" />
              <StatRow label="Procs / Sec" value={procsPerSec.toFixed(1)} color="text-teal-400" changed={flash.has("procsPerSec")} />
              {statusDps > 0 && (
                <StatRow label="Status DPS" value={statusDps.toFixed(0)} color="text-teal-400"
                  changed={flash.has("statusDps")}
                  tooltip="Estimated DPS from DoT status effects (Slash, Heat, Toxin, Gas)" />
              )}
            </>
          );
        })()}
      </CollapsibleSection>

      {dpsContributions.length > 0 && (
        <CollapsibleSection title="DPS CONTRIBUTIONS" defaultOpen={false}>
          <p className="text-[9px] text-muted-foreground/70 pb-1.5 leading-relaxed">
            Effective DPS gain from each source with everything else equipped. Additive stats show diminishing returns when stacked.
          </p>
          <div className="space-y-0.5">
            {dpsContributions.map((row) => {
              const color = CONTRIBUTION_CATEGORY_COLORS[row.category];
              const tooltip = [
                row.nominal ? `Nominal: ${row.nominal}` : null,
                row.tooltip,
                `Burst: ${formatMarginalPct(row.burstMarginalPct)} DPS`,
                showSustainedColumn ? `Sustained: ${formatMarginalPct(row.sustainedMarginalPct)} DPS` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <div key={row.id} className="flex items-start justify-between gap-2 py-0.5" title={tooltip}>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs truncate ${color}`}>{row.label}</div>
                    {row.nominal && (
                      <div className="text-[9px] text-muted-foreground/60 truncate">{row.nominal}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-mono text-blue-400">{formatMarginalPct(row.burstMarginalPct)}</div>
                    {showSustainedColumn && (
                      <div className="text-[9px] font-mono text-muted-foreground">
                        sus {formatMarginalPct(row.sustainedMarginalPct)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Status Procs */}
      {stats.statusProcs && stats.statusProcs.length > 0 && (
        <CollapsibleSection title="STATUS EFFECTS" defaultOpen={false}>
          {stats.statusProcs.map((proc, i) => (
            <div key={i} className="py-0.5">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${ELEMENT_COLORS[proc.type] || "text-muted-foreground"}`}>
                  {proc.type.charAt(0).toUpperCase() + proc.type.slice(1)}
                </span>
                <span className="text-xs font-mono">
                  {(proc.chance * 100).toFixed(1)}%
                </span>
              </div>
              {proc.totalDamage > 0 && (
                <div className="text-[10px] text-muted-foreground ml-2">
                  {proc.damagePerTick.toFixed(0)}/tick × {proc.ticks} = {proc.totalDamage.toFixed(0)} over {proc.duration}s
                </div>
              )}
              <div className="text-[10px] text-muted-foreground/60 ml-2">{proc.description}</div>
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Incarnon Evolutions Summary */}
      {selectedEvolutions && allEvolutions && Object.keys(selectedEvolutions).length > 0 && (
        <CollapsibleSection title="INCARNON EVOLUTIONS" defaultOpen>
          {Object.entries(selectedEvolutions).map(([tierStr, slot]) => {
            const tier = Number(tierStr);
            const evo = allEvolutions.find((e) => e.tier === tier && e.slot === slot);
            if (!evo) return null;
            const hasStats =
              Object.keys(evo.statChanges).length > 0 ||
              (evo.formStatChanges != null && Object.keys(evo.formStatChanges).length > 0);
            return (
              <div key={tier} className="py-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-orange-400 font-medium">T{tier}: {evo.name}</span>
                  {hasStats && (
                    <span className="text-[9px] font-mono text-orange-300/80">
                      {Object.entries(evo.statChanges).map(([s, v]) => {
                        const n = v as number;
                        if (s === "flatBaseDamage") return `baseDamage: +${n}`;
                        if (s === "flatMagazine") return `magazine: +${n}`;
                        if (s === "flatAmmoMax") return `ammoMax: +${n}`;
                        if (s === "ammoMaxSet") return `ammoMax: ${n}`;
                        if (s === "range") return `range: +${n}m`;
                        if (s === "punchThrough") return `PT: +${n}m`;
                        if (s === "projectileSpeed") return `projSpeed: +${(n * 100).toFixed(0)}%`;
                        if (s === "followThrough") return `followThrough: +${(n * 100).toFixed(0)}%`;
                        if (s === "accuracy") return `acc: +${(n * 100).toFixed(0)}%`;
                        if (s === "recoil") return `recoil: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "zoom") return `zoom: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "sprintSpeed") return `sprint: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "slideSpeed") return `slide: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "parkourVelocity") return `parkour: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "movementSpeed") return `move: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "finisherDamage") return `finisher: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "slamRadius") return `slamR: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                        if (s === "comboTimerPauseWhenHolstered") return "holster combo pause";
                        if (s === "ammoRestoreChance") return `ammoChance: ${(n * 100).toFixed(0)}%`;
                        if (s === "ammoRestoreFlat") return `ammo: +${n}`;
                        if (s === "ammoRestoreMagFraction") return `ammo: ${(n * 100).toFixed(0)}% mag`;
                        if (s === "incarnonHeadshotChargeBonus") return `charge@HS: +${(n * 100).toFixed(0)}%`;
                        if (s === "silentWeapon") return "silent";
                        if (s === "comboOnAmmoPickup") return `combo@ammo: +${n}`;
                        if (s === "extraJumps") return `jumps: +${n}`;
                        if (s === "jumpStrength") return `jump: +${(n * 100).toFixed(0)}%`;
                        if (s === "healRegenPerSec") return `heal: ${n}/s`;
                        if (s === "statusChanceVulnerability") return `SC vuln: +${(n * 100).toFixed(0)}%`;
                        if (s === "punctureStatusOnImpale") return `impale PT status: ${n}`;
                        if (s === "finisherComboCountChance") return `finisher combo: +${(n * 100).toFixed(0)}%`;
                        if (s === "comboOnFinisher") return `combo@finisher: +${n}`;
                        if (s === "comboOnSlashStatus") return `combo@slash: +${n}`;
                        if (s === "comboOnToxinStatus") return `combo@toxin: +${n}`;
                        if (s === "comboOnColdStatus") return `combo@cold: +${n}`;
                        if (s === "comboOnUndamaged") return `combo@undamaged: +${n}`;
                        if (s === "comboPerSlamHit") return `combo@slam: +${n}`;
                        if (s === "comboPerSlideHit") return `combo@slide: +${n}`;
                        if (s === "comboPerSlideMeters") return `combo@slide: +${n}`;
                        if (s === "comboSlideMeterInterval") return `every ${n}m`;
                        if (s === "comboOnShardDamage") return `combo@shard: +${n}`;
                        if (s === "bodyshotCritChanceMult") return `body CC: ×${n}`;
                        if (s === "additiveBaseDamage") return `+dmg (Serration): +${(n * 100).toFixed(0)}%`;
                        if (s === "halfHealthAdditiveDamage") return `half-HP +dmg: +${(n * 100).toFixed(0)}%`;
                        if (s === "capacityMsDamageMult") return `MS-pellet dmg: +${(n * 100).toFixed(0)}%`;
                        if (s === "capacityMsBonusMult") return `MS bonus ×${(1 + n).toFixed(2)}`;
                        if (s === "flatMsPelletDamage") return `MS-pellet flat: +${n}`;
                        if (s === "airborneKillAdditivePerStack") return `airborne +dmg/stack: +${(n * 100).toFixed(0)}%`;
                        if (s === "heavyKillPuncturePerStack") return `HA-kill Puncture/stack: +${(n * 100).toFixed(0)}%`;
                        if (s === "shardTriggerMult") return `shard trigger: ×${n}`;
                        if (s === "chainShatterDetonateMult") return `Chain Shatter: ×${n}`;
                        if (s === "stunRadiusOnFinisher") return `stun: ${n}m`;
                        if (s === "knockdownRadiusOnFinisher") return `KD: ${n}m`;
                        if (s === "shardDuration") return `shard: ${n}s`;
                        if (s === "shardWeakSpotCritBonus") return `shard CC: +${(n * 100).toFixed(0)}%`;
                        if (s === "shardDamageMult") return `shard dmg: ${(n * 100).toFixed(0)}%`;
                        if (s === "shardFullyGrownDamageMult") return `grown shard: ×${n}`;
                        if (s === "lingeringFieldDurationMult") return `linger: ×${n}`;
                        if (s === "holsterReloadPerSec") return `holster: ${(n * 100).toFixed(0)}%/s`;
                        if (s === "instantReloadOnKillChance") return `reload@kill: ${(n * 100).toFixed(0)}%`;
                        if (s === "instantReloadOnHeadshotChance") return `reload@HS: ${(n * 100).toFixed(0)}%`;
                        if (s === "criticalMultiplier") return `critMult: ${n > 0 ? "+" : ""}${n}x`;
                        if (s === "devouringAttrition") return `nonCritDmg: +${(n * 100).toFixed(0)}% (50%)`;
                        return `${s}: ${n > 0 ? "+" : ""}${(n * 100).toFixed(0)}%`;
                      }).join(", ")}
                      {evo.formStatChanges && Object.keys(evo.formStatChanges).length > 0
                        ? ` | form: ${Object.entries(evo.formStatChanges)
                            .map(([s, v]) => {
                              const n = v as number;
                              if (s === "criticalMultiplier") return `critMult +${n}x`;
                              return `${s} +${(n * 100).toFixed(0)}%`;
                            })
                            .join(", ")}`
                        : ""}
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground/70">{evo.description}</div>
              </div>
            );
          })}
        </CollapsibleSection>
      )}

      {/* TTK */}
      <TTKSection stats={stats} flash={ttkFlash} />
    </div>
  );
}


