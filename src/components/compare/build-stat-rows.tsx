"use client";

import type { ArchwingCalculatedStats, CalculatedStats, CompanionCalculatedStats, WarframeCalculatedStats } from "@/lib/types";
import type { CompareSnapshot } from "@/lib/builds/compare-build";
import { CompareRow, CompareSideHeader } from "@/components/compare/stat-diff";

export function WeaponCompareRows({
  a,
  b,
  aLabel = "Build A",
  bLabel = "Build B",
}: {
  a: CalculatedStats | null;
  b: CalculatedStats | null;
  aLabel?: string;
  bLabel?: string;
}) {
  if (!a && !b) return null;
  return (
    <div className="space-y-1">
      <CompareSideHeader aLabel={aLabel} bLabel={bLabel} />
      <CompareRow label="Total Damage" a={a?.totalDamage ?? null} b={b?.totalDamage ?? null} format={(v) => v.toFixed(1)} />
      <CompareRow label="Critical Chance" a={a ? a.criticalChance * 100 : null} b={b ? b.criticalChance * 100 : null} format={(v) => `${v.toFixed(1)}%`} />
      <CompareRow label="Critical Multiplier" a={a?.criticalMultiplier ?? null} b={b?.criticalMultiplier ?? null} format={(v) => `${v.toFixed(1)}x`} />
      <CompareRow label="Status Chance" a={a ? a.statusChance * 100 : null} b={b ? b.statusChance * 100 : null} format={(v) => `${v.toFixed(1)}%`} />
      <CompareRow label="Fire Rate" a={a?.fireRate ?? null} b={b?.fireRate ?? null} format={(v) => v.toFixed(2)} />
      <CompareRow label="Multishot" a={a?.multishot ?? null} b={b?.multishot ?? null} format={(v) => v.toFixed(2)} />
      <CompareRow label="Burst DPS" a={a?.burstDps ?? null} b={b?.burstDps ?? null} />
      <CompareRow label="Sustained DPS" a={a?.sustainedDps ?? null} b={b?.sustainedDps ?? null} />
    </div>
  );
}

export function WarframeCompareRows({
  a,
  b,
  aLabel = "Build A",
  bLabel = "Build B",
}: {
  a: WarframeCalculatedStats | null;
  b: WarframeCalculatedStats | null;
  aLabel?: string;
  bLabel?: string;
}) {
  if (!a || !b) return null;
  return (
    <div className="space-y-1">
      <CompareSideHeader aLabel={aLabel} bLabel={bLabel} />
      <CompareRow label="Health" a={a.totalHealth} b={b.totalHealth} />
      <CompareRow label="Shield" a={a.totalShield} b={b.totalShield} />
      <CompareRow label="Armor" a={a.totalArmor} b={b.totalArmor} />
      <CompareRow label="Energy" a={a.totalEnergy} b={b.totalEnergy} />
      <CompareRow label="Sprint" a={a.totalSprint} b={b.totalSprint} format={(v) => v.toFixed(2)} />
      <CompareRow label="EHP" a={a.effectiveHealth} b={b.effectiveHealth} />
      <CompareRow label="DR %" a={a.damageReduction} b={b.damageReduction} format={(v) => `${v.toFixed(1)}%`} />
      <CompareRow label="Strength" a={a.abilityStrength * 100} b={b.abilityStrength * 100} format={(v) => `${v.toFixed(0)}%`} />
      <CompareRow label="Duration" a={a.abilityDuration * 100} b={b.abilityDuration * 100} format={(v) => `${v.toFixed(0)}%`} />
      <CompareRow label="Efficiency" a={a.abilityEfficiency * 100} b={b.abilityEfficiency * 100} format={(v) => `${v.toFixed(0)}%`} />
      <CompareRow label="Range" a={a.abilityRange * 100} b={b.abilityRange * 100} format={(v) => `${v.toFixed(0)}%`} />
    </div>
  );
}

function pct(n: number): string {
  return `${n.toFixed(0)}%`;
}

function bonusRow(label: string, a: number, b: number, opts?: { always?: boolean; scale?: number }) {
  const scale = opts?.scale ?? 100;
  if (!opts?.always && a === 0 && b === 0) return null;
  return <CompareRow label={label} a={a * scale} b={b * scale} format={pct} />;
}

export function CompanionCompareRows({
  aBody,
  bBody,
  aWeapon,
  bWeapon,
  aLabel,
  bLabel,
  aWeaponName,
  bWeaponName,
}: {
  aBody: CompanionCalculatedStats;
  bBody: CompanionCalculatedStats;
  aWeapon: CalculatedStats | null;
  bWeapon: CalculatedStats | null;
  aLabel: string;
  bLabel: string;
  aWeaponName: string | null;
  bWeaponName: string | null;
}) {
  return (
    <div className="space-y-1">
      <CompareSideHeader aLabel={aLabel} bLabel={bLabel} />
      <CompareRow label="Health" a={aBody.totalHealth} b={bBody.totalHealth} />
      <CompareRow label="Shield" a={aBody.totalShield} b={bBody.totalShield} />
      <CompareRow label="Armor" a={aBody.totalArmor} b={bBody.totalArmor} />
      <CompareRow label="EHP" a={aBody.effectiveHealth} b={bBody.effectiveHealth} />
      <CompareRow label="DR %" a={aBody.damageReduction} b={bBody.damageReduction} format={(v) => `${v.toFixed(1)}%`} />
      {bonusRow("Melee Dmg", aBody.meleeDamageBonus, bBody.meleeDamageBonus, { always: true })}
      {bonusRow("Atk Speed", aBody.attackSpeedBonus, bBody.attackSpeedBonus, { always: true })}
      {bonusRow("Crit Chance", aBody.critChanceBonus, bBody.critChanceBonus, { always: true })}
      {bonusRow("Crit Dmg", aBody.critDamageBonus, bBody.critDamageBonus, { always: true })}
      {bonusRow("Weakspot", aBody.weakspotDamageBonus, bBody.weakspotDamageBonus)}
      {bonusRow("Finisher", aBody.finisherDamageBonus, bBody.finisherDamageBonus)}
      {bonusRow("Pickup", aBody.pickupDoubleChance, bBody.pickupDoubleChance)}
      {(aWeapon || bWeapon) && (
        <div className="pt-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Weapon · {aWeaponName ?? "–"} / {bWeaponName ?? "–"}
          </p>
          <WeaponCompareRows a={aWeapon} b={bWeapon} aLabel={aLabel} bLabel={bLabel} />
        </div>
      )}
    </div>
  );
}

export function ArchwingCompareRows({
  aFrame,
  bFrame,
  aWeapon,
  bWeapon,
  aLabel,
  bLabel,
  aWeaponName,
  bWeaponName,
}: {
  aFrame: ArchwingCalculatedStats;
  bFrame: ArchwingCalculatedStats;
  aWeapon: CalculatedStats | null;
  bWeapon: CalculatedStats | null;
  aLabel: string;
  bLabel: string;
  aWeaponName: string | null;
  bWeaponName: string | null;
}) {
  return (
    <div className="space-y-1">
      <CompareSideHeader aLabel={aLabel} bLabel={bLabel} />
      <CompareRow label="Health" a={aFrame.totalHealth} b={bFrame.totalHealth} />
      <CompareRow label="Shield" a={aFrame.totalShield} b={bFrame.totalShield} />
      <CompareRow label="Armor" a={aFrame.totalArmor} b={bFrame.totalArmor} />
      <CompareRow label="Energy" a={aFrame.totalEnergy} b={bFrame.totalEnergy} />
      <CompareRow label="Flight" a={aFrame.totalFlightSpeed} b={bFrame.totalFlightSpeed} format={(v) => v.toFixed(2)} />
      <CompareRow label="EHP" a={aFrame.effectiveHealth} b={bFrame.effectiveHealth} />
      <CompareRow label="DR %" a={aFrame.damageReduction} b={bFrame.damageReduction} format={(v) => `${v.toFixed(1)}%`} />
      <CompareRow label="Strength" a={aFrame.abilityStrength * 100} b={bFrame.abilityStrength * 100} format={pct} />
      <CompareRow label="Duration" a={aFrame.abilityDuration * 100} b={bFrame.abilityDuration * 100} format={pct} />
      <CompareRow label="Efficiency" a={aFrame.abilityEfficiency * 100} b={bFrame.abilityEfficiency * 100} format={pct} />
      <CompareRow label="Range" a={aFrame.abilityRange * 100} b={bFrame.abilityRange * 100} format={pct} />
      {(aFrame.kineticDiversionPercent > 0 || bFrame.kineticDiversionPercent > 0) && (
        <CompareRow label="Kinetic Div." a={aFrame.kineticDiversionPercent} b={bFrame.kineticDiversionPercent} format={pct} />
      )}
      {(aWeapon || bWeapon) && (
        <div className="pt-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Weapon · {aWeaponName ?? "–"} / {bWeaponName ?? "–"}
          </p>
          <WeaponCompareRows a={aWeapon} b={bWeapon} aLabel={aLabel} bLabel={bLabel} />
        </div>
      )}
    </div>
  );
}

export function SnapshotCompare({ a, b }: { a: CompareSnapshot; b: CompareSnapshot }) {
  if (a.kind === "weapon" && b.kind === "weapon") {
    return <WeaponCompareRows a={a.stats} b={b.stats} aLabel={a.label} bLabel={b.label} />;
  }
  if (a.kind === "warframe" && b.kind === "warframe") {
    return <WarframeCompareRows a={a.stats} b={b.stats} aLabel={a.label} bLabel={b.label} />;
  }
  if (a.kind === "modular" && b.kind === "modular") {
    return <WeaponCompareRows a={a.stats} b={b.stats} aLabel={a.label} bLabel={b.label} />;
  }
  if (a.kind === "companion" && b.kind === "companion") {
    return (
      <CompanionCompareRows
        aBody={a.body}
        bBody={b.body}
        aWeapon={a.weapon}
        bWeapon={b.weapon}
        aLabel={a.label}
        bLabel={b.label}
        aWeaponName={a.weaponName}
        bWeaponName={b.weaponName}
      />
    );
  }
  if (a.kind === "archwing" && b.kind === "archwing") {
    return (
      <ArchwingCompareRows
        aFrame={a.frame}
        bFrame={b.frame}
        aWeapon={a.weapon}
        bWeapon={b.weapon}
        aLabel={a.label}
        bLabel={b.label}
        aWeaponName={a.weaponName}
        bWeaponName={b.weaponName}
      />
    );
  }
  return null;
}
