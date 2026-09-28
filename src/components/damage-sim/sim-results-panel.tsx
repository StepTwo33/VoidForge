"use client";

import { Crosshair, Flame, Heart, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnemyType } from "@/lib/calc/ttk";
import {
  HEALTH_MODIFIERS,
  ARMOR_MODIFIERS,
  SHIELD_MODIFIERS,
  getMod,
} from "@/lib/calc/ttk";
import type { DamageSimResult } from "@/lib/calc/damage-sim";
import {
  SimSection,
  SimResultRow,
  fmtSimNum,
  SIM_ELEMENT_COLORS,
} from "@/components/damage-sim/sim-section";

export function SimResultsPanel({
  selectedEnemy,
  enemyLevel,
  steelPath = false,
  sim,
  totalRaw,
  multishot,
  magazine,
  reloadTime,
  dmgTypes,
}: {
  selectedEnemy: EnemyType | null;
  enemyLevel: number;
  steelPath?: boolean;
  sim: DamageSimResult | null;
  totalRaw: number;
  multishot: number;
  magazine: number;
  reloadTime: number;
  dmgTypes: Record<string, number>;
}) {
  if (!selectedEnemy || !sim) {
    return (
      <div className="rounded-xl border border-border/60 surface-panel p-8 text-center">
        <Shield className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">No enemy selected</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs text-muted-foreground">
          Pick a faction and enemy on the left to see TTK and DPS.
        </p>
      </div>
    );
  }

  const ttkLabel =
    sim.ttk === Infinity ? "∞" : sim.ttk < 0.01 ? "<0.01s" : `${sim.ttk.toFixed(2)}s`;
  const ttkColor =
    sim.ttk < 1
      ? "text-green-700 dark:text-green-400"
      : sim.ttk < 5
        ? "text-amber-700 dark:text-amber-300"
        : sim.ttk < 15
          ? "text-orange-700 dark:text-orange-400"
          : "text-red-700 dark:text-red-400";

  return (
    <>
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4 surface-panel">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/80 dark:text-amber-200/80">
          {selectedEnemy.name} · Lv.{enemyLevel}
          {steelPath ? " · SP" : ""}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Time to kill</p>
            <p className={cn("font-mono text-2xl font-bold tabular-nums tracking-tight", ttkColor)}>
              {ttkLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Shots to kill</p>
            <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-foreground">
              {sim.shotsToKill === Infinity ? "∞" : sim.shotsToKill.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Burst DPS</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-amber-800 dark:text-amber-300">
              {fmtSimNum(sim.burstDps)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Sustained DPS</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-amber-800 dark:text-amber-300">
              {fmtSimNum(sim.sustainedDps)}
            </p>
          </div>
        </div>
        {magazine > 0 && sim.shotsToKill !== Infinity && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            ~{Math.ceil(sim.shotsToKill / magazine)} magazine
            {Math.ceil(sim.shotsToKill / magazine) === 1 ? "" : "s"}
            {sim.shieldTime > 0 ? ` · shield ${sim.shieldTime.toFixed(2)}s` : ""}
            {sim.healthTime !== Infinity ? ` · health ${sim.healthTime.toFixed(2)}s` : ""}
          </p>
        )}
        <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground/70">
          Discrete TTK (same engine as Arsenal). Enemy armor DR = 0.9×AR/2700 (cap 90%). Viral/Corrosive
          stacking, Elementalist, Bane, optional headshots.
        </p>
      </div>

      <SimSection
        title={`${selectedEnemy.name} Lv.${enemyLevel}${steelPath ? " SP" : ""}`}
        icon={<Heart className="h-3.5 w-3.5" />}
      >
        <SimResultRow label="Health" value={fmtSimNum(sim.hp)} color="text-red-700 dark:text-red-400" />
        {sim.shield > 0 && (
          <SimResultRow label="Shield" value={fmtSimNum(sim.shield)} color="text-cyan-700 dark:text-cyan-300" />
        )}
        {sim.baseArmor > 0 && (
          <SimResultRow
            label="Armor"
            value={`${fmtSimNum(sim.armor)} (${(sim.armorDR * 100).toFixed(1)}% DR)`}
            color="text-amber-700 dark:text-amber-300"
            tooltip="Enemy DR = 0.9 × net armor / 2700 (capped 90%)."
          />
        )}
        {sim.baseArmor > 0 && sim.corrosiveStrippedArmor < sim.baseArmor - 0.5 && (
          <SimResultRow
            label="Armor before strip"
            value={fmtSimNum(sim.baseArmor)}
            color="text-amber-700/70 dark:text-amber-300/70"
          />
        )}
        <SimResultRow label="Effective HP" value={fmtSimNum(sim.effectiveHP)} bold color="text-primary" />
        <div className="mt-1 text-[9px] text-muted-foreground/60">
          {selectedEnemy.healthType} health ·{" "}
          {selectedEnemy.armorType !== "none" ? `${selectedEnemy.armorType} armor` : "no armor"} ·{" "}
          {selectedEnemy.shieldType !== "none" ? `${selectedEnemy.shieldType} shields` : "no shields"}
        </div>
      </SimSection>

      <SimSection title="Per-shot" icon={<Crosshair className="h-3.5 w-3.5" />}>
        <SimResultRow label="Avg Crit Multiplier" value={`${sim.avgCrit.toFixed(2)}x`} />
        <SimResultRow
          label={`Multishot × ${multishot.toFixed(1)}`}
          value={multishot > 1 ? `${multishot.toFixed(1)} pellets` : "1 pellet"}
        />
        <SimResultRow label="Raw / Shot" value={fmtSimNum(sim.rawPerShot)} />
        {sim.shield > 0 && (
          <SimResultRow
            label="vs Shield / Shot"
            value={fmtSimNum(sim.shieldDmgPerShot)}
            color="text-cyan-700 dark:text-cyan-300"
          />
        )}
        <SimResultRow
          label="vs Health / Shot"
          value={fmtSimNum(sim.healthDmgPerShot)}
          color="text-red-700 dark:text-red-300"
          bold
        />
      </SimSection>

      {sim.procsPerSec > 0 && (
        <SimSection title="Status effects" icon={<Zap className="h-3.5 w-3.5" />} defaultOpen={false}>
          <SimResultRow
            label="Procs / Sec"
            value={sim.procsPerSec.toFixed(1)}
            color="text-teal-700 dark:text-teal-400"
          />
          {sim.viralMult > 1 && (
            <SimResultRow
              label="Viral Multiplier"
              value={`${sim.viralMult.toFixed(2)}x health dmg`}
              color="text-teal-700 dark:text-teal-300"
            />
          )}
          {sim.baseArmor > 0 && sim.corrosiveStrippedArmor < sim.baseArmor - 0.5 && (
            <SimResultRow
              label="Corrosive Strip"
              value={`${fmtSimNum(sim.baseArmor)} → ${fmtSimNum(sim.corrosiveStrippedArmor)}`}
              color="text-lime-700 dark:text-lime-400"
            />
          )}
          <div className="mt-1 border-t border-border/50 pt-1" />
          {sim.slashDotDps > 0 && (
            <SimResultRow
              label="Slash DoT DPS"
              value={fmtSimNum(sim.slashDotDps)}
              color="text-red-700 dark:text-red-300"
            />
          )}
          {sim.heatDotDps > 0 && (
            <SimResultRow
              label="Heat DoT DPS"
              value={fmtSimNum(sim.heatDotDps)}
              color="text-orange-700 dark:text-orange-300"
            />
          )}
          {sim.toxinDotDps > 0 && (
            <SimResultRow
              label="Toxin DoT DPS"
              value={fmtSimNum(sim.toxinDotDps)}
              color="text-green-700 dark:text-green-300"
            />
          )}
          {sim.totalDotDps > 0 && (
            <SimResultRow
              label="Total DoT DPS"
              value={fmtSimNum(sim.totalDotDps)}
              bold
              color="text-teal-700 dark:text-teal-400"
            />
          )}
        </SimSection>
      )}

      <SimSection title="Damage breakdown" icon={<Flame className="h-3.5 w-3.5" />} defaultOpen={false}>
        <div className="mb-2 grid min-w-0 grid-cols-4 gap-1 text-[9px] text-muted-foreground sm:text-[10px]">
          <span className="min-w-0 truncate">Type</span>
          <span className="min-w-0 text-right">Raw</span>
          <span className="min-w-0 text-right">vs Shield</span>
          <span className="min-w-0 text-right">vs Health</span>
        </div>
        {sim.typeBreakdown.map((t) => (
          <div key={t.type} className="grid min-w-0 grid-cols-4 gap-1 py-0.5 text-[10px]">
            <span
              className="min-w-0 truncate font-medium capitalize"
              style={{ color: SIM_ELEMENT_COLORS[t.type] }}
            >
              {t.type}
            </span>
            <span className="min-w-0 text-right font-mono tabular-nums">{t.raw.toFixed(0)}</span>
            <span className="min-w-0 text-right font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
              {t.vsShield.toFixed(0)}
            </span>
            <span className="min-w-0 text-right font-mono tabular-nums text-red-700 dark:text-red-300">
              {t.vsHealth.toFixed(0)}
            </span>
          </div>
        ))}
        <div className="mt-1 grid grid-cols-4 gap-1 border-t border-border/50 pt-1 text-[10px] font-bold">
          <span>Total</span>
          <span className="text-right font-mono">{totalRaw.toFixed(0)}</span>
          <span className="text-right font-mono text-cyan-700 dark:text-cyan-300">
            {sim.typeBreakdown.reduce((s, t) => s + t.vsShield, 0).toFixed(0)}
          </span>
          <span className="text-right font-mono text-red-700 dark:text-red-300">
            {sim.typeBreakdown.reduce((s, t) => s + t.vsHealth, 0).toFixed(0)}
          </span>
        </div>
      </SimSection>

      <SimSection title="Type matchups" defaultOpen={false}>
        <div className="space-y-0.5">
          {Object.entries(dmgTypes)
            .filter(([, v]) => v > 0)
            .map(([type]) => {
              const hm = getMod(HEALTH_MODIFIERS, selectedEnemy.healthType, type);
              const am =
                selectedEnemy.armorType !== "none"
                  ? getMod(ARMOR_MODIFIERS, selectedEnemy.armorType, type)
                  : 0;
              const sm =
                selectedEnemy.shieldType !== "none"
                  ? getMod(SHIELD_MODIFIERS, selectedEnemy.shieldType, type)
                  : 0;
              return (
                <div key={type} className="flex min-w-0 flex-wrap items-center gap-1 text-[10px]">
                  <span
                    className="w-14 shrink-0 truncate font-medium capitalize sm:w-16"
                    style={{ color: SIM_ELEMENT_COLORS[type] }}
                  >
                    {type}
                  </span>
                  {hm !== 0 && (
                    <span
                      className={cn(
                        "rounded px-1",
                        hm > 0
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400",
                      )}
                    >
                      HP {hm > 0 ? "+" : ""}
                      {(hm * 100).toFixed(0)}%
                    </span>
                  )}
                  {am !== 0 && (
                    <span
                      className={cn(
                        "rounded px-1",
                        am > 0
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400",
                      )}
                    >
                      AR {am > 0 ? "+" : ""}
                      {(am * 100).toFixed(0)}%
                    </span>
                  )}
                  {sm !== 0 && (
                    <span
                      className={cn(
                        "rounded px-1",
                        sm > 0
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400",
                      )}
                    >
                      SH {sm > 0 ? "+" : ""}
                      {(sm * 100).toFixed(0)}%
                    </span>
                  )}
                  {hm === 0 && am === 0 && sm === 0 && (
                    <span className="text-muted-foreground/40">neutral</span>
                  )}
                </div>
              );
            })}
        </div>
      </SimSection>

      <p className="text-[9px] text-muted-foreground/60">
        Sustained DPS accounts for {reloadTime}s reload every {magazine} shots.
      </p>
    </>
  );
}
