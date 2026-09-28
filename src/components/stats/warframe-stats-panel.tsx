"use client";

import { WarframeCalculatedStats, Warframe, Mod, EquippedMod } from "@/lib/types";
import { useMemo, useState } from "react";
import { formatAbilityDescription } from "@/lib/display/ability-text";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";
import { getArcaneDisplayInfo } from "@/lib/display/arcane-display";
import {
  ADAPTATION_MAX_STACKS,
  computeAdaptationSurvivability,
} from "@/lib/calc/calculator";
import {
  computeGaussPassiveShieldRecharge,
  computeGaussPassiveRechargeDelayReduction,
  computeBaruukRestraintDr,
  computeValkyrRageMeleeBonus,
  valkyrRageDeathPreventionActive,
  computeEmberPassiveAbilityStrength,
  computeGarudaPassiveDamageBonus,
  computeFrostPassiveArmor,
  computeCyte09PracticedAimCritChance,
  computeGrendelPassiveArmor,
  computeCalibanAdaptiveArmorDr,
  computeProteaPassiveStrengthBonus,
  computeStyanaxHopliteCritChance,
  computeYareliCriticalFlowCritChance,
  computeZephyrAirborneCritChance,
  computeXakuPassiveEvasion,
  computeVoltStaticDischargeDamage,
  computeTrinityLifegiverBonusHealth,
  computeMesaPassiveBonuses,
  computeQorvexPassivePunchThrough,
  computeExcaliburSwordsmanshipBonuses,
  computeSarynPassiveStatusDurationMultiplier,
  computeKullervoMeleePassiveBonuses,
  computeVaubanIncapacitatedDamageBonus,
  computeAshSlashPassiveBonuses,
  computeHydroidCorrosiveArmorStrip,
  computeDanteChroniclersMarkStatusChance,
  computeDagathAbundantAbyss,
  computeEquinoxOrbConversion,
  computeRevenantShieldDepletionPulse,
  computeRevenantShieldPulseDamageAtDistance,
  computeOctaviaInspirationPassive,
  computeNekrosDeathHealPassive,
  computeNekrosDeathHealTotal,
  computeNovaPassiveOrbChances,
  computeNovaPassiveExpectedOrbs,
  computeIvaraEnemyRadarRange,
  DEFAULT_ENEMY_RADAR_M,
  computeNezhaSlidePassiveBonuses,
  computeMirageParkourPassiveBonuses,
  computeLokiWallLatchPassive,
  DEFAULT_WALL_LATCH_SEC,
  computeLavosValenceBlockPassive,
  computeKhoraVenariPassive,
  computeOberonRighteousNegationPassive,
  computeOberonRighteousNegationStacks,
  computeJadeJudgmentPassive,
  computeJadeJudgmentDamageMultiplier,
  computeTempleBackbeatEfficiencyBonus,
  computeOraxiaPredatorsLurkPassive,
  computeRhinoHardLandingPulse,
  computeRhinoHardLandingDamageAtDistance,
  computeGaraPassiveBlind,
  computeGaraPassiveBlindChance,
  computeLimboRiftPassive,
  computeLimboRiftEnergyGained,
  computeMagVacuumPassive,
  computeKoumeiFatePassive,
  computeBansheeSilencePassive,
  computeNyxPsychicCritChance,
  computeHarrowPassive,
  computeGyreAbilityCritChance,
  computeCitrineGeoluminesence,
  computeChromaDragonFlightPassive,
  computeChromaElementCycle,
  computeTitaniaUpsurgePassive,
  computeHildrynShieldGatePassive,
  computeNidusUndyingPassive,
  computeSiriusOrionPassive,
  computeFollieInkblotPassive,
  computeFollieInkblotExpected,
  computeSevagothTombstonePassive,
  computeInarosPassive,
  computeInarosFinisherHeal,
  computeNokkoVitalDecayPassive,
  computeWukongFiveTechniquesPassive,
  computeVorunaWolvesPassive,
  computeUrielLegionPassive,
  type ChromaElement,
} from "@/lib/codex/ability-misc-stats";
import { computeMechaSetMarkStats } from "@/lib/calc/set-bonuses";
import { cn } from "@/lib/utils";
import { CollapsibleSection, SimSlider, StatRow } from "./stat-primitives";

function GaussPassiveBattery({
  batteryPct,
  onBatteryPctChange,
}: {
  batteryPct: number;
  onBatteryPctChange: (n: number) => void;
}) {
  const batteryT = Math.min(1, Math.max(0, batteryPct / 100));
  const recharge = computeGaussPassiveShieldRecharge(batteryT);
  const delay = computeGaussPassiveRechargeDelayReduction(batteryT);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Battery %"
        value={batteryPct}
        min={0}
        max={100}
        onChange={onBatteryPctChange}
        tooltip="Shared battery gauge for Kinetic Plating DR, Thermal Sunder damage, Redline buffs, and passive shield recharge."
      />
      <StatRow
        label="Shield Recharge"
        value={`+${(recharge * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Max +120% at full battery (not affected by Ability Strength)."
      />
      <StatRow
        label="Recharge Delay"
        value={`−${(delay * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Max −80% delay at full battery (not affected by Ability Strength)."
      />
    </div>
  );
}

function BaruukRestraintPassive() {
  const [erodedPct, setErodedPct] = useState(0);
  const dr = computeBaruukRestraintDr(erodedPct / 100);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Restraint Eroded %"
        value={erodedPct}
        min={0}
        max={100}
        onChange={setErodedPct}
        tooltip="Baruuk passive: DR scales linearly with eroded Restraint (wiki: full erosion → 50% DR)."
      />
      <StatRow
        label="Restraint DR"
        value={`${(dr * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Max 50% at fully eroded meter (not affected by Ability Strength)."
      />
    </div>
  );
}

function ValkyrRagePassive() {
  const [ragePct, setRagePct] = useState(150);
  const meleeBonus = computeValkyrRageMeleeBonus(ragePct);
  const deathPrev = valkyrRageDeathPreventionActive(ragePct);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Rage %"
        value={ragePct}
        min={0}
        max={300}
        onChange={setRagePct}
        tooltip="Valkyr Rage: melee damage bonus equals meter % (cap 300%). Death prevention at ≥150%."
      />
      <StatRow
        label="Melee Damage"
        value={`+${(meleeBonus * 100).toFixed(0)}%`}
        color="text-red-700 dark:text-red-400"
        tooltip="Flat additive melee damage bonus from Rage (not × Ability Strength)."
      />
      <StatRow
        label="Death Prevention"
        value={deathPrev ? "Ready (≥150%)" : "Inactive"}
        color={deathPrev ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
        tooltip="Fatal hit consumes Rage, grants 5s invuln and full heal (wiki)."
      />
    </div>
  );
}

function EmberHeatPassive({
  immolationHeatPct,
  onImmolationHeatPctChange,
}: {
  immolationHeatPct: number;
  onImmolationHeatPctChange: (n: number) => void;
}) {
  const [heatEnemies, setHeatEnemies] = useState(5);
  const bonusStr = computeEmberPassiveAbilityStrength(heatEnemies);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Immolation Heat %"
        value={immolationHeatPct}
        min={0}
        max={100}
        onChange={onImmolationHeatPctChange}
        tooltip="Shared heat gauge for Fireball combo, Immolation DR, Fire Blast energy/strip, and Inferno Ring DPS."
      />
      <SimSlider
        label="Heat Enemies"
        value={heatEnemies}
        min={0}
        max={40}
        onChange={setHeatEnemies}
        tooltip="Ember passive: +5% Ability Strength per enemy with active Heat status in Affinity Range."
      />
      <StatRow
        label="Passive Strength"
        value={`+${(bonusStr * 100).toFixed(0)}%`}
        color="text-orange-700 dark:text-orange-400"
        tooltip="Additive Ability Strength from Heat-status enemies (not multiplied by Ability Strength)."
      />
    </div>
  );
}

function GarudaDeathsGatePassive() {
  const [kills, setKills] = useState(10);
  const dmgBonus = computeGarudaPassiveDamageBonus(kills);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Kill Stacks"
        value={kills}
        min={0}
        max={20}
        onChange={setKills}
        tooltip="Garuda Death's Gate: +5% weapon/melee damage per kill (cap 100% / 20 kills)."
      />
      <StatRow
        label="Damage Bonus"
        value={`+${(dmgBonus * 100).toFixed(0)}%`}
        color="text-red-700 dark:text-red-400"
        tooltip="Multiplicative universal weapon bonus (panel-only; not wired into weapon DPS)."
      />
    </div>
  );
}

function FrostFortifyingFreezePassive({
  moddedArmor,
  coldEnemies,
  onColdEnemiesChange,
}: {
  moddedArmor: number;
  coldEnemies: number;
  onColdEnemiesChange: (n: number) => void;
}) {
  const bonusArmor = computeFrostPassiveArmor(coldEnemies);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Cold Enemies"
        value={coldEnemies}
        min={0}
        max={40}
        onChange={onColdEnemiesChange}
        tooltip="Frost Fortifying Freeze: +50 Armor per enemy with Cold status in Affinity Range. Also fortifies Snow Globe Initial Health."
      />
      <StatRow
        label="Bonus Armor"
        value={`+${bonusArmor}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Flat armor after mods (not × Ability Strength). Ability Cold status also lasts +100%."
      />
      <StatRow
        label="Armor w/ Passive"
        value={(moddedArmor + bonusArmor).toFixed(0)}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Modded armor + Fortifying Freeze bonus (used by Snow Globe)."
      />
    </div>
  );
}

function Cyte09PracticedAimPassive() {
  const [wpKills, setWpKills] = useState(0);
  const wpCc = computeCyte09PracticedAimCritChance(wpKills);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="WP Kills"
        value={wpKills}
        min={0}
        max={300}
        onChange={setWpKills}
        tooltip="Cyte-09 Practiced Aim: +1% Weak Point Critical Chance per WP kill (mission-long, cap 300%)."
      />
      <StatRow
        label="WP Crit Chance"
        value={`+${(wpCc * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Additive to weapon crit chance vs weak points (not × Ability Strength)."
      />
    </div>
  );
}

function GrendelBellyArmorPassive({ moddedArmor }: { moddedArmor: number }) {
  const [gutEnemies, setGutEnemies] = useState(3);
  const bonusArmor = computeGrendelPassiveArmor(gutEnemies);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Enemies in Gut"
        value={gutEnemies}
        min={0}
        max={5}
        onChange={setGutEnemies}
        tooltip="Grendel passive: +250 Armor per living Feast victim (cap 5 → +1,250). Catgut not included."
      />
      <StatRow
        label="Bonus Armor"
        value={`+${bonusArmor}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Flat armor after mods (not × Ability Strength)."
      />
      <StatRow
        label="Armor w/ Passive"
        value={(moddedArmor + bonusArmor).toFixed(0)}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Modded armor + belly armor. Max +1,250 at 5 enemies (base; Catgut can raise per-enemy)."
      />
    </div>
  );
}

function CalibanAdaptiveArmorPassive({
  effectiveHealth,
  armorDrFraction,
}: {
  effectiveHealth: number;
  armorDrFraction: number;
}) {
  const [hits, setHits] = useState(0);
  const typedDr = computeCalibanAdaptiveArmorDr(hits);
  const armorMult = 1 - Math.min(Math.max(armorDrFraction, 0), 0.99);
  const combinedMult = armorMult * (1 - typedDr);
  const combinedDrPct = (1 - combinedMult) * 100;
  const adaptedEhp = typedDr < 1 ? effectiveHealth / (1 - typedDr) : effectiveHealth;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Hits Taken"
        value={hits}
        min={0}
        max={10}
        onChange={setHits}
        tooltip="Caliban Adaptive Armor: +5% typed resistance per hit (cap 50%). Decays after 5s without damage."
      />
      <StatRow
        label="Typed Resist"
        value={`${(typedDr * 100).toFixed(0)}%`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Per damage type; does not stack with Adaptation (higher of the two)."
      />
      <StatRow
        label="Combined DR"
        value={`${combinedDrPct.toFixed(1)}%`}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Armor DR × Adaptive Armor vs that type."
      />
      <StatRow
        label="Adapted EHP"
        value={adaptedEhp.toFixed(0)}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Effective health vs fully adapted single-type damage (typed resist only on EHP row)."
      />
    </div>
  );
}

function ProteaPowerRecorderPassive({ abilityStrength }: { abilityStrength: number }) {
  const [powerBars, setPowerBars] = useState(3);
  const bonus = computeProteaPassiveStrengthBonus(powerBars);
  const nextStr = abilityStrength + bonus;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Power Bars"
        value={powerBars}
        min={0}
        max={3}
        onChange={setPowerBars}
        tooltip="Protea: 1 bar per cast; at 3 bars the next cast gets +100% Ability Strength, then resets."
      />
      <StatRow
        label="Next Cast STR"
        value={bonus > 0 ? `+${(bonus * 100).toFixed(0)}% Ready` : "Charging"}
        color={bonus > 0 ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
        tooltip="Additive +100% Ability Strength on the empowered cast only."
      />
      <StatRow
        label="Effective STR"
        value={`${(nextStr * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Current Ability Strength + passive bonus if power recorder is full."
      />
    </div>
  );
}

function StyanaxHoplitePassive({ moddedShield }: { moddedShield: number }) {
  const shields = Math.max(0, Math.round(moddedShield));
  const cc = computeStyanaxHopliteCritChance(shields);
  const speargunCc = computeStyanaxHopliteCritChance(shields, { speargun: true });

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="At Full Shields"
        value={shields.toFixed(0)}
        color="text-muted-foreground"
        tooltip="Uses this build’s modded Shield capacity. Overshields are not included here."
      />
      <StatRow
        label="Hoplite CC"
        value={`+${(cc * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Styanax Hoplite: +1% weapon Critical Chance per 40 shields (additive; primary/secondary/melee)."
      />
      <StatRow
        label="w/ Speargun"
        value={`+${(speargunCc * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Doubled while a Speargun primary is equipped (Afentis, Scytax, etc.)."
      />
    </div>
  );
}

function YareliCriticalFlowPassive() {
  const cc = computeYareliCriticalFlowCritChance(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        After 1.5s of movement (until idle 1s).
      </p>
      <StatRow
        label="Secondary CC"
        value={`+${(cc * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Additive to secondary weapon base crit chance mods (panel-only)."
      />
    </div>
  );
}

function ZephyrAirbornePassive() {
  const cc = computeZephyrAirborneCritChance(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        While airborne (also slower fall / more maneuverable).
      </p>
      <StatRow
        label="Weapon CC"
        value={`+${(cc * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Additive to all equipped weapons' crit chance while airborne (panel-only)."
      />
    </div>
  );
}

function XakuEvasionPassive() {
  const base = computeXakuPassiveEvasion(false);
  const untamed = computeXakuPassiveEvasion(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Dodge (base)"
        value={`${(base.dodgeChance * 100).toFixed(0)}%`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Chance to phase through enemy weapon attacks (separate from Evasion)."
      />
      <StatRow
        label="AoE DR (base)"
        value={`${(base.aoeDamageReduction * 100).toFixed(0)}%`}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Damage reduction vs area-of-effect damage (explosions are not dodged)."
      />
      <StatRow
        label="w/ Vast Untime"
        value={`${(untamed.dodgeChance * 100).toFixed(0)}% dodge · ${(untamed.aoeDamageReduction * 100).toFixed(0)}% AoE DR`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Both rise to 75% while The Vast Untime is active."
      />
    </div>
  );
}

function VoltStaticDischargePassive() {
  const perMeter = 10;
  const cap = 1000;
  const exampleMeters = 50;
  const exampleDmg = computeVoltStaticDischargeDamage(exampleMeters);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Charge Rate"
        value={`+${perMeter} / m`}
        color="text-yellow-700 dark:text-yellow-400"
        tooltip="Electricity damage stored per grounded meter traveled. Discharges on next weapon attack or ability hit. Not × Ability Strength."
      />
      <StatRow
        label="Cap"
        value={`${cap}`}
        color="text-muted-foreground"
        tooltip={`${cap / perMeter}m of grounded travel fills the gauge.`}
      />
      <StatRow
        label={`Example (${exampleMeters}m)`}
        value={`+${exampleDmg}`}
        color="text-muted-foreground"
        tooltip={`${exampleMeters} × ${perMeter} = ${exampleDmg} Electricity bonus.`}
      />
    </div>
  );
}

function TrinityLifegiverPassive({ maxEnergy }: { maxEnergy: number }) {
  const bonusHealth = computeTrinityLifegiverBonusHealth(maxEnergy);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Ally Bonus Health"
        value={`+${bonusHealth.toFixed(0)}`}
        color="text-green-700 dark:text-green-400"
        tooltip="Lifegiver: allies in Affinity Range gain Health equal to 50% of Trinity's max Energy (scales with Flow/shards)."
      />
      <StatRow
        label="From Max Energy"
        value={maxEnergy.toFixed(0)}
        color="text-muted-foreground"
        tooltip="Current modded max Energy pool used for the 50% conversion."
      />
    </div>
  );
}

  const dual = computeMesaPassiveBonuses({ sidearmStyle: "dual", meleeEquipped: false });
  const single = computeMesaPassiveBonuses({ sidearmStyle: "single", meleeEquipped: false });
  const withMelee = computeMesaPassiveBonuses({ sidearmStyle: "none", meleeEquipped: true });

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Dual Sidearms FR"
        value={`+${(dual.fireRateBonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Fire rate bonus while dual-wielding sidearms."
      />
      <StatRow
        label="One-Hand Reload"
        value={`+${(single.reloadSpeedBonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Reload speed bonus for single one-handed sidearms."
      />
      <StatRow
        label="Health (no melee)"
        value={`+${dual.bonusHealth} → ${(moddedHealth + dual.bonusHealth).toFixed(0)}`}
        color="text-green-700 dark:text-green-400"
        tooltip={`+50 flat Health when no melee is equipped (Archmelee still allowed). With melee: ${moddedHealth.toFixed(0)}.`}
      />
      <StatRow
        label="Health (w/ melee)"
        value={moddedHealth.toFixed(0)}
        color="text-muted-foreground"
        tooltip={`No Health bonus when a melee weapon is equipped (${withMelee.bonusHealth} bonus).`}
      />
    </div>
  );
}

function QorvexCoreExposurePassive() {
  const pt = computeQorvexPassivePunchThrough();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Punch Through"
        value={`+${pt}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Core Exposure: +3 Punch Through on primary, secondary, and melee (panel-only; not wired into weapon DPS)."
      />
    </div>
  );
}

function ExcaliburSwordsmanshipPassive() {
  const { damageBonus, attackSpeedBonus } = computeExcaliburSwordsmanshipBonuses(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug">
        Active while wielding swords, dual swords, nikanas, or rapiers.
      </p>
      <StatRow
        label="Melee Damage"
        value={`+${(damageBonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Additive melee damage bonus (panel-only)."
      />
      <StatRow
        label="Attack Speed"
        value={`+${(attackSpeedBonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Additive attack speed (panel-only). Umbra also keeps sentience outside Transference."
      />
    </div>
  );
}

function SarynStatusDurationPassive() {
  const mult = computeSarynPassiveStatusDurationMultiplier();
  const exampleBase = 6; // default Slash proc duration
  const exampleScaled = exampleBase * mult;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Status Duration"
        value={`+${((mult - 1) * 100).toFixed(0)}%`}
        color="text-green-700 dark:text-green-400"
        tooltip="Saryn passive: status effects from weapons and abilities last 25% longer (additive with duration mods)."
      />
      <StatRow
        label="Example Slash Proc"
        value={`${exampleBase}s → ${exampleScaled.toFixed(1)}s`}
        color="text-muted-foreground"
        tooltip="Default 6s Slash DoT stretched by the passive alone (before other duration mods)."
      />
    </div>
  );
}

function KullervoMeleePassive() {
  const { heavyAttackEfficiency, heavyAttackWindUpSpeed } = computeKullervoMeleePassiveBonuses();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Heavy Efficiency"
        value={`+${(heavyAttackEfficiency * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Kullervo passive on all melee. HAE hard-caps at 90% with other sources."
      />
      <StatRow
        label="Heavy Wind Up"
        value={`+${(heavyAttackWindUpSpeed * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="+100% Heavy Attack Wind Up Speed on all melee weapons (panel-only)."
      />
    </div>
  );
}

function VaubanIncapacitatedPassive() {
  const bonus = computeVaubanIncapacitatedDamageBonus(true);
  const exampleHit = 100 * (1 + bonus);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Vs incapacitated enemies (stun, freeze at 10 stacks, Bastille, etc.).
      </p>
      <StatRow
        label="Damage Bonus"
        value={`+${(bonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Multiplicative to total damage (and again on status DoTs applied while incapacitated)."
      />
      <StatRow
        label="Example 100 Hit"
        value={exampleHit.toFixed(0)}
        color="text-muted-foreground"
        tooltip="100 × (1 + 0.25) when the passive applies."
      />
    </div>
  );
}

function AshSlashPassive() {
  const { statusDamageBonus, statusDurationBonus } = computeAshSlashPassiveBonuses();
  const baseSlashSec = 6;
  const scaledSlashSec = baseSlashSec * (1 + statusDurationBonus);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Slash Status Dmg"
        value={`+${(statusDamageBonus * 100).toFixed(0)}%`}
        color="text-red-700 dark:text-red-400"
        tooltip="Ash passive: Slash (Bleed) status damage +25%, additive with other Status Damage bonuses."
      />
      <StatRow
        label="Slash Status Dur"
        value={`+${(statusDurationBonus * 100).toFixed(0)}%`}
        color="text-red-700 dark:text-red-400"
        tooltip="Slash status lasts 50% longer (6s → 9s before other duration mods)."
      />
      <StatRow
        label="Example Bleed"
        value={`${baseSlashSec}s → ${scaledSlashSec.toFixed(0)}s`}
        color="text-muted-foreground"
        tooltip="Default Slash DoT duration with Ash's duration bonus alone."
      />
    </div>
  );
}

function HydroidCorrosivePassive() {
  const normal = computeHydroidCorrosiveArmorStrip(false);
  const marked = computeHydroidCorrosiveArmorStrip(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        After Hydroid damages an enemy, Corrosive from any source strips more armor.
      </p>
      <StatRow
        label="1st Stack (normal)"
        value={`${(normal.firstStackStrip * 100).toFixed(0)}%`}
        color="text-muted-foreground"
        tooltip="Standard Corrosive first-stack armor strip."
      />
      <StatRow
        label="1st Stack (marked)"
        value={`${(marked.firstStackStrip * 100).toFixed(0)}%`}
        color="text-lime-700 dark:text-lime-400"
        tooltip="Hydroid-marked: first Corrosive stack strips 50% armor (vs 26%)."
      />
      <StatRow
        label="Full Stacks (normal)"
        value={`${(normal.fullStackStrip * 100).toFixed(0)}%`}
        color="text-muted-foreground"
        tooltip="Standard Corrosive full-stack cap (80%)."
      />
      <StatRow
        label="Full Stacks (marked)"
        value={`${(marked.fullStackStrip * 100).toFixed(0)}%`}
        color="text-lime-700 dark:text-lime-400"
        tooltip="Hydroid-marked: Corrosive can fully strip armor (100% vs 80%)."
      />
    </div>
  );
}

function DanteChroniclersMarkPassive() {
  const [baseScPct, setBaseScPct] = useState(40);
  const base = baseScPct / 100;
  const unscanned = computeDanteChroniclersMarkStatusChance(base, false);
  const scanned = computeDanteChroniclersMarkStatusChance(base, true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Weapon SC %"
        value={baseScPct}
        min={0}
        max={100}
        onChange={setBaseScPct}
        tooltip="Post-mod Status Chance before Chronicler's Mark (multiplicative ×1.5 on fully Codex-scanned foes)."
      />
      <StatRow
        label="Unscanned"
        value={`${(unscanned * 100).toFixed(0)}%`}
        color="text-muted-foreground"
        tooltip="Status Chance vs enemies without completed Codex research (no Chronicler's Mark)."
      />
      <StatRow
        label="Fully Scanned"
        value={`${(scanned * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="×1.5 vs fully researched enemies. Wiki example: 40% × 1.5 = 60%."
      />
    </div>
  );
}

function DagathAbundantAbyssPassive() {
  // Small Energy/Health = 25, large = 50, Empowered Health = 100
  const [orbValue, setOrbValue] = useState(25);
  const off = computeDagathAbundantAbyss(orbValue, { forceProc: false });
  const on = computeDagathAbundantAbyss(orbValue, { forceProc: true });
  const avg = computeDagathAbundantAbyss(orbValue);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <div className="flex flex-wrap gap-1 pt-0.5">
        {[
          { v: 25, label: "Small (25)" },
          { v: 50, label: "Large (50)" },
          { v: 100, label: "Empowered (100)" },
        ].map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setOrbValue(opt.v)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              orbValue === opt.v
                ? "border-violet-500/50 bg-violet-500/15 text-violet-800 dark:text-violet-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <StatRow
        label="Proc Chance"
        value={`${(avg.procChance * 100).toFixed(0)}%`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Abundant Abyss: 35% chance per Health or Energy orb (+300% more effective = ×4 yield). Universal Orbs roll separately for each."
      />
      <StatRow
        label="If Procs"
        value={on.effectiveValue.toFixed(0)}
        color="text-violet-700 dark:text-violet-400"
        tooltip={`×${on.procYieldMultiplier} yield (+300%). Base ${orbValue} → ${on.effectiveValue.toFixed(0)}.`}
      />
      <StatRow
        label="Expected"
        value={avg.effectiveValue.toFixed(1)}
        color="text-violet-700 dark:text-violet-400"
        tooltip={`Average over many pickups: ×${avg.expectedYieldMultiplier.toFixed(2)} (${(avg.procChance * 100).toFixed(0)}% at ×${avg.procYieldMultiplier}, else base ${off.effectiveValue.toFixed(0)}).`}
      />
    </div>
  );
}

function EquinoxOrbConversionPassive() {
  const [orbKind, setOrbKind] = useState<"health" | "energy">("health");
  const [orbValue, setOrbValue] = useState(50);
  const result = computeEquinoxOrbConversion(orbValue, orbKind);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <div className="flex flex-wrap gap-1 pt-0.5">
        {(
          [
            { v: "health" as const, label: "Health Orb" },
            { v: "energy" as const, label: "Energy Orb" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setOrbKind(opt.v)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              orbKind === opt.v
                ? "border-sky-500/50 bg-sky-500/15 text-sky-800 dark:text-sky-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {[
          { v: 25, label: "Small (25)" },
          { v: 50, label: "Large (50)" },
          { v: 100, label: "Empowered (100)" },
        ].map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setOrbValue(opt.v)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              orbValue === opt.v
                ? "border-violet-500/50 bg-violet-500/15 text-violet-800 dark:text-violet-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <StatRow
        label={orbKind === "health" ? "Health" : "Energy"}
        value={`+${result.primaryAmount.toFixed(0)}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Full orb value applied to its primary resource."
      />
      <StatRow
        label={result.convertedResource === "energy" ? "→ Energy" : "→ Health"}
        value={`+${result.convertedAmount.toFixed(1)}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="10% of the orb value converted to the other resource (stacks additively with Equilibrium)."
      />
    </div>
  );
}

function RevenantShieldPulsePassive() {
  const pulse = computeRevenantShieldDepletionPulse();
  const edgeDmg = computeRevenantShieldPulseDamageAtDistance(1, pulse);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Pulse Damage (center)"
        value={pulse.damage.toFixed(0)}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Impact knockdown on shield depletion. Not affected by Ability Strength."
      />
      <StatRow
        label="Pulse Damage (edge)"
        value={edgeDmg.toFixed(0)}
        color="text-muted-foreground"
        tooltip={`${(pulse.maxFalloff * 100).toFixed(0)}% falloff at the edge of the pulse.`}
      />
      <StatRow
        label="Radius"
        value={`${pulse.radius}m`}
        color="text-muted-foreground"
        tooltip="Fixed radial pulse on shield depletion."
      />
    </div>
  );
}

function OctaviaInspirationPassivePanel() {
  const insp = computeOctaviaInspirationPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Energy/s"
        value={`${insp.energyPerSecond}/s`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`Casting an ability grants this to Octavia and allies within ${insp.radiusM}m for ${insp.durationSec}s (recast refreshes). Not affected by Ability Strength/Duration.`}
      />
      <StatRow
        label="Duration"
        value={`${insp.durationSec}s`}
        color="text-muted-foreground"
        tooltip={`Full buff restores ${insp.totalEnergy} energy over ${insp.durationSec}s.`}
      />
      <StatRow
        label="Total Energy"
        value={`+${insp.totalEnergy}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`If the buff runs its full ${insp.durationSec}s without refresh.`}
      />
    </div>
  );
}

function NekrosDeathHealPassivePanel() {
  const heal = computeNekrosDeathHealPassive();
  const [deaths, setDeaths] = useState(10);
  const total = computeNekrosDeathHealTotal(deaths);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Enemy Deaths"
        value={deaths}
        min={0}
        max={50}
        onChange={setDeaths}
        tooltip={`Nekros: +${heal.healthPerDeath} Health per enemy death within ${heal.radiusM}m (also heals companions).`}
      />
      <StatRow
        label="Heal / Death"
        value={`+${heal.healthPerDeath}`}
        color="text-green-700 dark:text-green-400"
        tooltip="Flat heal, not × Ability Strength."
      />
      <StatRow
        label="Total Heal"
        value={`+${total}`}
        color="text-green-700 dark:text-green-400"
        tooltip={`${deaths} deaths × ${heal.healthPerDeath} Health.`}
      />
    </div>
  );
}

function NovaOrbDropPassive() {
  const slowed = computeNovaPassiveOrbChances("slowed");
  const sped = computeNovaPassiveOrbChances("sped");
  const sampleKills = 20;
  const expectedSlow = computeNovaPassiveExpectedOrbs(sampleKills, "slowed");
  const expectedSped = computeNovaPassiveExpectedOrbs(sampleKills, "sped");

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Any slow/speed source works (incl. Molecular Prime). Mutually exclusive per kill.
      </p>
      <StatRow
        label="Health Orb (slowed)"
        value={`${(slowed.healthOrbChance * 100).toFixed(0)}%`}
        color="text-green-700 dark:text-green-400"
        tooltip={`Kill while slowed → ${(slowed.healthOrbChance * 100).toFixed(0)}% Health Orb. ≈${expectedSlow.expectedHealthOrbs.toFixed(0)} per ${sampleKills} kills.`}
      />
      <StatRow
        label="Energy Orb (sped up)"
        value={`${(sped.energyOrbChance * 100).toFixed(0)}%`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`Kill while sped up → ${(sped.energyOrbChance * 100).toFixed(0)}% Energy Orb. ≈${expectedSped.expectedEnergyOrbs.toFixed(0)} per ${sampleKills} kills.`}
      />
      <StatRow
        label={`Expected / ${sampleKills} kills`}
        value={`${expectedSlow.expectedHealthOrbs.toFixed(0)} HP · ${expectedSped.expectedEnergyOrbs.toFixed(0)} EN`}
        color="text-muted-foreground"
        tooltip="Average orbs if all sample kills were slowed vs all sped up (not both at once)."
      />
    </div>
  );
}

function IvaraRadarPassive() {
  const range = computeIvaraEnemyRadarRange(0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Enemy Radar"
        value={`${range}m`}
        color="text-emerald-700 dark:text-emerald-400"
        tooltip={`Ivara innate enemy radar (wiki). Default Warframes sense ${DEFAULT_ENEMY_RADAR_M}m. Stacks additively with Enemy Radar / Animal Instinct / auras.`}
      />
      <StatRow
        label="vs Default"
        value={`+${range - DEFAULT_ENEMY_RADAR_M}m`}
        color="text-muted-foreground"
        tooltip="Difference versus the standard 30m enemy radar."
      />
    </div>
  );
}

function NezhaSlidePassive() {
  const { slideSpeedBonus, slideDistanceBonus } = computeNezhaSlidePassiveBonuses();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Slide Speed"
        value={`+${(slideSpeedBonus * 100).toFixed(0)}%`}
        color="text-orange-700 dark:text-orange-400"
        tooltip="Nezha passive: +60% slide speed (additive with Maglev / Cunning Drift). Can be disabled by Controlled Slide."
      />
      <StatRow
        label="Slide Distance"
        value={`+${(slideDistanceBonus * 100).toFixed(0)}%`}
        color="text-orange-700 dark:text-orange-400"
        tooltip="+35% slide distance (additive with other slide distance sources)."
      />
    </div>
  );
}

function MirageParkourPassive() {
  const { slideDurationBonus, maneuverSpeedBonus } = computeMirageParkourPassiveBonuses();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Slide Duration"
        value={`+${(slideDurationBonus * 100).toFixed(0)}%`}
        color="text-pink-700 dark:text-pink-400"
        tooltip="Mirage passive: sliding lasts 85% longer."
      />
      <StatRow
        label="Maneuver Speed"
        value={`+${(maneuverSpeedBonus * 100).toFixed(0)}%`}
        color="text-pink-700 dark:text-pink-400"
        tooltip="+50% faster acrobatic maneuvers (parkour velocity)."
      />
    </div>
  );
}

function LokiWallLatchPassive() {
  const latch = computeLokiWallLatchPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Wall Latch"
        value={`${latch.durationSec}s`}
        color="text-emerald-700 dark:text-emerald-400"
        tooltip={`Loki: hang from walls ${latch.multiplier}× longer than normal (${DEFAULT_WALL_LATCH_SEC}s → ${latch.durationSec}s).`}
      />
      <StatRow
        label="vs Default"
        value={`×${latch.multiplier}`}
        color="text-muted-foreground"
        tooltip={`Default wall latch is ${DEFAULT_WALL_LATCH_SEC}s.`}
      />
    </div>
  );
}

function LavosValenceBlockPassivePanel() {
  const valence = computeLavosValenceBlockPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Status Immunity"
        value={`${valence.immunityDurationSec}s`}
        color="text-cyan-700 dark:text-cyan-400"
        tooltip="Energy/Universal Orbs grant status immunity (cleanses and blocks negatives). Renewed to full on a new qualifying orb pickup."
      />
      <StatRow
        label="Orb Cooldown"
        value={`${valence.orbPickupCooldownSec}s`}
        color="text-muted-foreground"
        tooltip="Cooldown before another Energy/Universal Orb can refresh Valence Block (Universal still heals if injured)."
      />
    </div>
  );
}

function KhoraVenariPassivePanel() {
  const venari = computeKhoraVenariPassive(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        While Venari is alive (respawns after {venari.respawnSec}s if killed).
      </p>
      <StatRow
        label="Move Speed"
        value={`+${(venari.moveSpeedBonus * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Tied to Venari's presence (modifiable via Venari ability mods)."
      />
      <StatRow
        label="Respawn"
        value={`${venari.respawnSec}s`}
        color="text-muted-foreground"
        tooltip="Passive respawn timer when Venari dies; summoning via ability is instant for an energy cost."
      />
    </div>
  );
}

function OberonRighteousNegationPassivePanel() {
  const negation = computeOberonRighteousNegationPassive();
  const [stacks, setStacks] = useState(3);
  const clamped = computeOberonRighteousNegationStacks(stacks);
  const nextInvuln =
    clamped <= 0 ? 0 : clamped === 1 ? negation.invulnOnFinalSec : negation.invulnOnConsumeSec;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Negation Stacks"
        value={stacks}
        min={0}
        max={negation.maxStacks}
        onChange={setStacks}
        tooltip="Oberon: Health Orbs grant Righteous Negation (cap 3). Each stack blocks the next instance of damage."
      />
      <StatRow
        label="Stacks"
        value={`${clamped} / ${negation.maxStacks}`}
        color={clamped > 0 ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
        tooltip="Granted to Oberon and allies in Affinity Range; each ally consumes their own stacks."
      />
      <StatRow
        label="Next Hit Invuln"
        value={clamped > 0 ? `${nextInvuln}s` : "—"}
        color={clamped > 0 ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
        tooltip={`0.25s on a normal consume; 0.5s when consuming the final charge.`}
      />
    </div>
  );
}

function JadeJudgmentPassivePanel() {
  const judgment = computeJadeJudgmentPassive();
  const dmgMult = computeJadeJudgmentDamageMultiplier(true);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Some abilities apply Judgment: enemies take more damage for {judgment.durationSec}s.
      </p>
      <StatRow
        label="Judgment Vulnerability"
        value={`+${(judgment.damageVulnerability * 100).toFixed(0)}%`}
        color="text-rose-700 dark:text-rose-400"
        tooltip={`Judged enemies take ×${dmgMult.toFixed(1)} damage for ${judgment.durationSec}s.`}
      />
      <StatRow
        label="Aura Slots"
        value={`${judgment.auraSlots}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Jade uniquely has two Aura polarity slots."
      />
    </div>
  );
}

function TempleBackbeatPassivePanel({ abilityEfficiency }: { abilityEfficiency: number }) {
  const bonus = computeTempleBackbeatEfficiencyBonus(true);
  const onBeatEff = abilityEfficiency + bonus;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Cast while the metronome is in the Backbeat zone to amplify the ability and gain Efficiency.
      </p>
      <StatRow
        label="Backbeat EFF"
        value={`+${(bonus * 100).toFixed(0)}%`}
        color="text-fuchsia-700 dark:text-fuchsia-400"
        tooltip="Additive Ability Efficiency on timed casts (also fuels Exalted and per-ability bonuses)."
      />
      <StatRow
        label="EFF on Backbeat"
        value={`${(onBeatEff * 100).toFixed(0)}%`}
        color="text-amber-800 dark:text-amber-400"
        tooltip={`Your Ability Efficiency (${(abilityEfficiency * 100).toFixed(0)}%) + Backbeat bonus.`}
      />
      <StatRow
        label="EFF off Beat"
        value={`${(abilityEfficiency * 100).toFixed(0)}%`}
        color="text-muted-foreground"
        tooltip="Ability Efficiency without a Backbeat cast."
      />
    </div>
  );
}

function OraxiaPredatorsLurkPassivePanel() {
  const lurk = computeOraxiaPredatorsLurkPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Invisibility"
        value={`${lurk.invisibilitySec}s`}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Wall latch (or Silken Thread latch) grants Predator's Lurk invisibility. Refresh by re-latching. Does not break on attacks. Also applies to Oraxia's companion."
      />
    </div>
  );
}

function RhinoHardLandingPassivePanel() {
  const pulse = computeRhinoHardLandingPulse();
  const edgeDmg = computeRhinoHardLandingDamageAtDistance(1, pulse);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Pulse Damage (center)"
        value={pulse.damage.toFixed(0)}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Impact knockdown on hard landing. Not affected by Ability Strength. Stacks with Heavy Impact."
      />
      <StatRow
        label="Pulse Damage (edge)"
        value={edgeDmg.toFixed(0)}
        color="text-muted-foreground"
        tooltip={`${(pulse.maxFalloff * 100).toFixed(0)}% falloff at the edge of the pulse.`}
      />
      <StatRow
        label="Radius"
        value={`${pulse.radius}m`}
        color="text-muted-foreground"
        tooltip="Fixed radial pulse on hard landing."
      />
    </div>
  );
}

function GaraPassiveBlindPanel() {
  const blind = computeGaraPassiveBlind();
  /** Consecutive casts that failed to blind — pity adds +20% each until a proc resets. */
  const [missStreak, setMissStreak] = useState(0);
  const chance = computeGaraPassiveBlindChance(missStreak);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Each ability cast: {(blind.baseChance * 100).toFixed(0)}% blind, then +
        {(blind.chanceIncreasePerMiss * 100).toFixed(0)}% per failed cast until it procs.
      </p>
      <div className="flex flex-wrap gap-1">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setMissStreak(n)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              missStreak === n
                ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-800 dark:text-cyan-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {n === 0 ? "Fresh" : `${n} miss${n === 1 ? "" : "es"}`}
          </button>
        ))}
      </div>
      <StatRow
        label="Blind Chance"
        value={`${(chance * 100).toFixed(0)}%`}
        color="text-cyan-700 dark:text-cyan-400"
        tooltip={`Base ${(blind.baseChance * 100).toFixed(0)}% + ${(blind.chanceIncreasePerMiss * 100).toFixed(0)}% × consecutive misses (cap 100%). Resets when it blinds.`}
      />
      <StatRow
        label="Blind"
        value={`${blind.durationSec}s / ${blind.radiusM}m`}
        color="text-muted-foreground"
        tooltip="Exposes enemies to Melee Finishers. Requires LoS."
      />
    </div>
  );
}

function LimboRiftPassivePanel() {
  const rift = computeLimboRiftPassive();
  const [riftKills, setRiftKills] = useState(5);
  const [secondsInRift, setSecondsInRift] = useState(10);
  const energy = computeLimboRiftEnergyGained(riftKills, secondsInRift, rift);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Rift Kills"
        value={riftKills}
        min={0}
        max={40}
        onChange={setRiftKills}
        tooltip={`Limbo: +${rift.energyPerKill} Energy per enemy killed in the Rift (regardless of Limbo's plane).`}
      />
      <SimSlider
        label="Seconds in Rift"
        value={secondsInRift}
        min={0}
        max={60}
        onChange={setSecondsInRift}
        tooltip={`+${rift.energyPerSecondInRift} Energy/s while in the Rift (paused by most channeled abilities).`}
      />
      <StatRow
        label="Energy Gained"
        value={`+${energy.toFixed(0)}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`Kills × ${rift.energyPerKill} + time × ${rift.energyPerSecondInRift}/s.`}
      />
      <StatRow
        label="Rift Portal"
        value={`${rift.portalDurationSec}s → ${rift.portalBanishDurationSec}s Banish`}
        color="text-muted-foreground"
        tooltip="Dodge leaves a 5s portal; touching it Banishes for 15s (not × Ability Duration)."
      />
    </div>
  );
}

function MagVacuumPassivePanel() {
  const vacuum = computeMagVacuumPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Vacuum Radius"
        value={`${vacuum.radiusM}m`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Mag: pickups within 8m gravitate to her. Overridden by larger vacuum sources (e.g. Fetch / Vacuum)."
      />
    </div>
  );
}

function KoumeiFatePassivePanel() {
  const fate = computeKoumeiFatePassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Status Window"
        value={`${fate.durationSec}s`}
        color="text-rose-700 dark:text-rose-400"
        tooltip={`Every ${fate.intervalSec}s, fate picks one equipped weapon to inflict random Status Effects for ${fate.durationSec}s. Can select unequipped weapon types.`}
      />
      <StatRow
        label="Cycle Interval"
        value={`${fate.intervalSec}s`}
        color="text-muted-foreground"
        tooltip="How often a new weapon is chosen. Separate from The Five Fates dice rolls on ability casts."
      />
    </div>
  );
}

function BansheeSilencePassivePanel() {
  const silence = computeBansheeSilencePassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Weapon Noise"
        value={silence.weaponsSilent ? "Silent" : "Normal"}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Banshee: all equipped weapons (incl. Gunblades and Sentinel weapons) are treated as silent so enemies cannot hear them."
      />
      <StatRow
        label="Ability Cast"
        value="Max Puncture · 10m"
        color="text-violet-800 dark:text-violet-300"
        tooltip="Casting an ability applies maximum Puncture status to enemies within 10m."
      />
    </div>
  );
}

function AtlasKnockdownPassivePanel() {
  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Knockdown (grounded)"
        value="Immune"
        color="text-amber-800 dark:text-amber-400"
        tooltip="Atlas is immune to Knockdown while on the ground. Does not apply in the air or to pushback. Rubble armor from petrified enemies is a separate mechanic."
      />
    </div>
  );
}

function NyxPsychicPassivePanel() {
  const [confused, setConfused] = useState(3);
  const cc = computeNyxPsychicCritChance(confused);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Confused Enemies"
        value={confused}
        min={0}
        max={8}
        onChange={setConfused}
        tooltip="Nyx: +40% Primary/Secondary Critical Chance per Confused enemy within Affinity Range (cap +200%)."
      />
      <StatRow
        label="Gun Crit Chance"
        value={`+${(cc * 100).toFixed(0)}%`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Additive to Primary/Secondary crit chance mods. Cap at 5 Confused enemies."
      />
    </div>
  );
}

function HarrowPassivePanel() {
  const harrow = computeHarrowPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Overshield Cap"
        value={`${harrow.overshieldCap}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`Harrow: overshield capacity doubled (${harrow.baseOvershieldCap} → ${harrow.overshieldCap}).`}
      />
      <StatRow
        label="Mission Start"
        value={harrow.startAtMaxEnergy ? "Max Energy" : "Normal"}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Starts missions at maximum Energy."
      />
    </div>
  );
}

function GyreAbilityCritPassivePanel() {
  const [stacks, setStacks] = useState(5);
  const crit = computeGyreAbilityCritChance(stacks);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Electric Stacks"
        value={stacks}
        min={0}
        max={30}
        onChange={setStacks}
        tooltip="Gyre: +10% ability Critical Chance per Electricity status on the target (cap 300% with Cathode Grace)."
      />
      <StatRow
        label="Ability Crit"
        value={`+${(crit.critChance * 100).toFixed(0)}%`}
        color="text-yellow-800 dark:text-yellow-300"
        tooltip="Flat ability Critical Chance vs that enemy. Helminth/Railjack abilities do not benefit."
      />
      <StatRow
        label="Crit Tier"
        value={
          crit.tier === "none"
            ? "—"
            : `${crit.tier[0].toUpperCase()}${crit.tier.slice(1)} ×${crit.critMultiplier.toFixed(1)}`
        }
        color={
          crit.tier === "red"
            ? "text-red-700 dark:text-red-400"
            : crit.tier === "orange"
              ? "text-orange-700 dark:text-orange-400"
              : crit.tier === "yellow"
                ? "text-yellow-800 dark:text-yellow-300"
                : "text-muted-foreground"
        }
        tooltip="Orange from 11 stacks (110%); red from 21 stacks (210%)."
      />
    </div>
  );
}

function CitrineGeoluminesencePassivePanel() {
  const [orbs, setOrbs] = useState(0);
  const geo = computeCitrineGeoluminesence(orbs);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Health Orbs"
        value={orbs}
        min={0}
        max={geo.orbsToMax}
        onChange={setOrbs}
        tooltip="Citrine Geoluminesence: +0.1 Health/s per Health/Universal Orb permanently (mission), up to 25/s."
      />
      <StatRow
        label="Heal / s"
        value={`${geo.healPerSec.toFixed(1)}`}
        color="text-green-700 dark:text-green-400"
        tooltip={`Base ${geo.baseHealPerSec}/s + ${geo.healPerOrb}/s per orb. Allies in ${geo.radiusM}m gain the buff.`}
      />
      <StatRow
        label="Aura Radius"
        value={`${geo.radiusM}m`}
        color="text-muted-foreground"
        tooltip="Matches Affinity Range distance but is a separate aura (not affected by Affinity Range mods)."
      />
    </div>
  );
}

const CHROMA_ELEMENTS: ChromaElement[] = ["heat", "electricity", "toxin", "cold"];

function ChromaPassivePanel() {
  const flight = computeChromaDragonFlightPassive();
  const [elemIdx, setElemIdx] = useState(0);
  const element = CHROMA_ELEMENTS[Math.min(3, Math.max(0, elemIdx))] ?? "heat";
  const cycle = computeChromaElementCycle(element);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Dragon's Flight"
        value={flight.extraAirJump ? "Extra Jump" : "—"}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Chroma: additional midair jump and bullet jump (wings match energy color)."
      />
      <SimSlider
        label="Element (0 Heat / 1 Elec / 2 Toxin / 3 Cold)"
        value={elemIdx}
        min={0}
        max={3}
        onChange={setElemIdx}
        tooltip="Emission color or Spectral Scream tap-cycle sets Heat / Electricity / Toxin / Cold for all abilities."
      />
      <StatRow
        label="Active Element"
        value={cycle.label}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Secondary emission / energy colors do not change the element."
      />
    </div>
  );
}

function TitaniaUpsurgePassivePanel() {
  const upsurge = computeTitaniaUpsurgePassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Parkour Dist."
        value={`+${(upsurge.parkourDistanceBonus * 100).toFixed(0)}%`}
        color="text-pink-800 dark:text-pink-300"
        tooltip="Titania: +25% Bullet Jump and Rolling distance."
      />
      <StatRow
        label="Upsurge Heal"
        value={`${upsurge.healPerSec}/s`}
        color="text-green-700 dark:text-green-400"
        tooltip={`Casting an ability heals Titania and allies within ${upsurge.healRadiusM}m for ${upsurge.healPerSec} HP/s (refreshes on cast).`}
      />
      <StatRow
        label="Upsurge Duration"
        value={`${upsurge.durationSec}s`}
        color="text-muted-foreground"
        tooltip={`${upsurge.healRadiusM}m radius · refreshes when you cast again.`}
      />
    </div>
  );
}

function HildrynShieldGatePassivePanel() {
  const gate = computeHildrynShieldGatePassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Full Shield Gate"
        value={`${gate.fullGateSec}s`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="Hildryn: 3.5s invulnerability when Shields break from a full charge (longer than the default gate)."
      />
      <StatRow
        label="Energy Orb → Shield"
        value={`+${gate.energyOrbShieldRestore}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Energy Orbs restore 25 Shields and reset recharge delay; cannot create Overshields."
      />
      <StatRow
        label="Ability Cost"
        value={gate.abilitiesUseShields ? "Shields" : "Energy"}
        color="text-muted-foreground"
        tooltip="Abilities drain Shields/Overshields. Efficiency mods reduce shield costs."
      />
    </div>
  );
}

function NidusUndyingPassivePanel() {
  const [stacks, setStacks] = useState(30);
  const undying = computeNidusUndyingPassive(stacks);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Mutation Stacks"
        value={stacks}
        min={0}
        max={undying.stackCap}
        onChange={setStacks}
        tooltip="Nidus Undying: at ≥15 Mutation stacks on lethal damage, consume 15 stacks for 5s invuln and 50% Health."
      />
      <StatRow
        label="Undying"
        value={undying.undyingReady ? "Ready" : "Need 15"}
        color={undying.undyingReady ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
        tooltip={`${undying.invulnSec}s invulnerability · restore ${(undying.healFraction * 100).toFixed(0)}% Health. Cap ${undying.stackCap} stacks.`}
      />
      <StatRow
        label="After Proc"
        value={`${undying.stacksAfterUndying} stacks`}
        color="text-amber-800 dark:text-amber-400"
        tooltip={
          undying.undyingReady
            ? `Consumes ${undying.stacksRequired} stacks (${stacks} → ${undying.stacksAfterUndying}).`
            : "Fatal damage below 15 stacks consumes all stacks without Undying."
        }
      />
    </div>
  );
}

function SiriusOrionPassivePanel() {
  const passive = computeSiriusOrionPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        After swapping forms, the next {passive.casts} ability casts get the Efficiency buff.
      </p>
      <StatRow
        label="Post-Swap EFF"
        value={`+${(passive.efficiencyBonus * 100).toFixed(0)}% × ${passive.casts}`}
        color="text-sky-700 dark:text-sky-400"
        tooltip={`+${(passive.efficiencyBonus * 100).toFixed(0)}% Ability Efficiency for the next ${passive.casts} casts after each form swap.`}
      />
      <StatRow
        label="Energy Steal"
        value={`<${passive.energyStealThreshold} Energy`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="When either form is below 50 Energy, they steal energy from each other."
      />
    </div>
  );
}

function WispAirborneInvisPassivePanel() {
  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="While Airborne"
        value="Invisible"
        color="text-violet-800 dark:text-violet-300"
        tooltip="Wisp is invisible to enemies in the air. Landing ends the cloak until airborne again."
      />
    </div>
  );
}

function FollieInkblotPassivePanel() {
  const ink = computeFollieInkblotPassive();
  const [kills, setKills] = useState(10);
  const expected = computeFollieInkblotExpected(kills, ink);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Inkblot Slow"
        value={`${(ink.slowFraction * 100).toFixed(0)}% · ${ink.durationSec}s`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Follie: abilities apply Inkblot (50% slow for 10s). Not dismissed by Nullifiers."
      />
      <SimSlider
        label="Ink Kills"
        value={kills}
        min={0}
        max={50}
        onChange={setKills}
        tooltip="While coated in ink, slain foes have a 20% chance to spawn an ink balloon that drops 3 mixed Health/Energy Orbs."
      />
      <StatRow
        label="Expected Balloons"
        value={expected.expectedBalloons.toFixed(1)}
        color="text-amber-800 dark:text-amber-400"
        tooltip={`${(ink.balloonChance * 100).toFixed(0)}% × ${kills} kills → ~${expected.expectedOrbs.toFixed(1)} orbs.`}
      />
    </div>
  );
}

function SevagothTombstonePassivePanel() {
  const tomb = computeSevagothTombstonePassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Souls to Revive"
        value={`${tomb.soulsRequired}`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="On fatal damage, control Shadow and harvest enemy souls to rebuild the tombstone (allies can also interact). Consume (passive) costs 0 Energy and instantly kills non-bosses."
      />
      <StatRow
        label="Track Range"
        value={`${tomb.soulTrackRangeM}m`}
        color="text-muted-foreground"
        tooltip="Targeted enemy must be within this range to count toward the soul counter."
      />
    </div>
  );
}

function InarosPassivePanel({ maxHealth }: { maxHealth: number }) {
  const passive = computeInarosPassive();
  const heal = computeInarosFinisherHeal(maxHealth, passive);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Sarcophagus"
        value={passive.sarcophagusOnFatal ? "On Fatal" : "—"}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Inaros: fatal damage entombs him; sand form melee-siphons to revive (allies can also interact)."
      />
      <StatRow
        label="Finisher Heal"
        value={`+${(passive.finisherHealFraction * 100).toFixed(0)}% (${heal.toFixed(0)})`}
        color="text-green-700 dark:text-green-400"
        tooltip={`Melee Finisher / Mercy kills restore 20% of max Health (~${heal.toFixed(0)} at current max HP).`}
      />
    </div>
  );
}

function NokkoVitalDecayPassivePanel() {
  const decay = computeNokkoVitalDecayPassive();

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Needs ≥1 Stinkbrain or Brightbonnet placed. Fatal hit → Sprodling; touch a glowing mushroom to revive.
      </p>
      <StatRow
        label="Sprodling Window"
        value={`${decay.timeLimitSec}s`}
        color="text-green-700 dark:text-green-400"
        tooltip="Time to reach a glowing mushroom. Miss it and Nokko uses a self-revive. Fungal Spores grant move speed but not healing. Does not work in Arbitrations."
      />
      <StatRow
        label="Post-Revive Invuln"
        value={`${decay.postReviveInvulnSec}s`}
        color="text-muted-foreground"
        tooltip="Invulnerability after the ~3s revive animation."
      />
    </div>
  );
}

function WukongFiveTechniquesPassivePanel() {
  const five = computeWukongFiveTechniquesPassive();
  const [techId, setTechId] = useState(five.techniques[0]!.id);
  const tech = five.techniques.find((t) => t.id === techId) ?? five.techniques[0]!;

  return (
    <div className="py-1 space-y-1.5 border-t border-border/60 mt-1">
      <StatRow
        label="Per Mission"
        value={`${five.techniquesPerMission} of ${five.techniques.length}`}
        color="text-amber-800 dark:text-amber-400"
        tooltip={`On fatal damage: ${five.deathGateInvulnSec}s invuln + ${(five.deathGateHealFraction * 100).toFixed(0)}% Health, then a random remaining technique buff.`}
      />
      <div className="flex flex-wrap gap-1">
        {five.techniques.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTechId(t.id)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              techId === t.id
                ? "border-violet-500/50 bg-violet-500/15 text-violet-800 dark:text-violet-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="rounded border border-border/50 bg-muted/20 px-2 py-1.5 space-y-0.5">
        <div className="text-[11px] font-medium text-violet-800 dark:text-violet-300">{tech.name}</div>
        <p className="text-[10px] text-muted-foreground leading-snug">
          {tech.summary} · {tech.durationSec}s
        </p>
      </div>
    </div>
  );
}

function VorunaWolvesPassivePanel() {
  const pack = computeVorunaWolvesPassive();
  const [wolfId, setWolfId] = useState(pack.wolves[0]!.id);
  const wolf = pack.wolves.find((w) => w.id === wolfId) ?? pack.wolves[0]!;

  return (
    <div className="py-1 space-y-1.5 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Hold ability 1–4 to invoke that wolf. Helminth replacements disable the matching wolf.
      </p>
      <div className="flex flex-wrap gap-1">
        {pack.wolves.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWolfId(w.id)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              wolfId === w.id
                ? "border-rose-500/50 bg-rose-500/15 text-rose-800 dark:text-rose-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {w.name}
          </button>
        ))}
      </div>
      <div className="rounded border border-border/50 bg-muted/20 px-2 py-1.5 space-y-0.5">
        <div className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
          {wolf.name}
          <span className="ml-1.5 font-normal text-muted-foreground">Hold {wolf.abilitySlot}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-snug">{wolf.summary}</p>
        {wolf.id === "lycath" && (
          <p className="text-[10px] text-muted-foreground leading-snug">
            Heavy Attack Efficiency hard-caps at {(pack.heavyAttackEfficiencyCap * 100).toFixed(0)}%.
          </p>
        )}
        {wolf.id === "ulfrun" && (
          <p className="text-[10px] text-muted-foreground leading-snug">
            {wolf.invulnSec}s invuln + full Health/Shields · {wolf.cooldownSec}s cooldown after sacrifice or swap-out.
          </p>
        )}
      </div>
    </div>
  );
}

function MechaMarkTimingPanel({ pieces }: { pieces: number }) {
  const mark = computeMechaSetMarkStats(pieces);
  if (!mark) return null;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Mark Cooldown"
        value={`${mark.cooldownSec}s`}
        color="text-amber-800 dark:text-amber-400"
        tooltip="Mecha Set: companion marks a target on this interval (Kubrow/Predasite required)."
      />
      <StatRow
        label="Mark Duration"
        value={`${mark.markDurationSec}s`}
        color="text-sky-700 dark:text-sky-400"
        tooltip="How long the mark lasts. Killing the marked target spreads statuses to nearby enemies."
      />
      <StatRow
        label="Spread Range"
        value={`${mark.spreadRangeM}m`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Status types (not stacks) transfer with remaining duration. DoT spread damage is not modeled in paper DPS."
      />
      <StatRow
        label="Empowered vs Marked"
        value="+150% (toggle)"
        color="text-muted-foreground"
        tooltip="Mecha Empowered aura: squad +150% damage vs the marked enemy — enable via weapon SIMULATION toggle."
      />
    </div>
  );
}

function UrielLegionPassivePanel() {
  const legion = computeUrielLegionPassive();
  const [demonId, setDemonId] = useState(legion.demons[0]!.id);
  const demon = legion.demons.find((d) => d.id === demonId) ?? legion.demons[0]!;

  let detail = "";
  if (demon.id === "catenach") {
    const c = legion.catenach;
    detail = `${c.maxChained} chained · ${c.damagePerSec}/s · ${(c.slowFraction * 100).toFixed(0)}% slow · ${(c.damageShare * 100).toFixed(0)}% share · ${c.durationSec}s`;
  } else if (demon.id === "gulphagor") {
    const g = legion.gulphagor;
    detail = `${g.damagePerTick}×${g.ticksPerSec}/s latch · ${(g.healthOrbChance * 100).toFixed(0)}% HP orb · pain ${g.painRadiusM}m ${g.painHeatPerSec} Heat/s`;
  } else {
    const v = legion.vythelas;
    detail = `+${(v.fireRateBonus * 100).toFixed(0)}% FR · +${(v.heatDamageBonus * 100).toFixed(0)}% Heat Extra Hit · ${v.runeDurationSec}s · max ${v.maxRunes}`;
  }

  return (
    <div className="py-1 space-y-1.5 border-t border-border/60 mt-1">
      <p className="text-[10px] text-muted-foreground leading-snug pt-0.5">
        Three Health-based intangible summons. Helminth keeps a demon but freezes its stats at defaults.
      </p>
      <div className="flex flex-wrap gap-1">
        {legion.demons.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDemonId(d.id)}
            className={cn(
              "inline-flex min-h-9 items-center rounded border px-2 py-1 text-[10px] transition-colors",
              demonId === d.id
                ? "border-orange-500/50 bg-orange-500/15 text-orange-800 dark:text-orange-300"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {d.name}
          </button>
        ))}
      </div>
      <div className="rounded border border-border/50 bg-muted/20 px-2 py-1.5 space-y-1">
        <div className="text-[11px] font-medium text-orange-800 dark:text-orange-300">
          {demon.name}
          <span className="ml-1.5 font-normal text-muted-foreground">via {demon.unlockAbility}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-snug">{demon.summary}</p>
        <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-snug break-words">{detail}</p>
      </div>
      <StatRow
        label="Auto-Resurrect"
        value={`${legion.resurrectSec}s`}
        color="text-muted-foreground"
        tooltip={`Demons auto-resurrect after ${legion.resurrectSec}s. Remedium heals/revives instantly. Teleport if >${legion.teleportRangeM}m from Uriel.`}
      />
    </div>
  );
}

function AdaptationSurvivability({ stats }: { stats: WarframeCalculatedStats }) {
  const [stacks, setStacks] = useState(ADAPTATION_MAX_STACKS);
  const armorDR = stats.damageReduction / 100;
  const { typedDRPercent, combinedDRPercent, adaptedEHP } = computeAdaptationSurvivability(
    stats.effectiveHealth,
    armorDR,
    stacks,
  );

  return (
    <div className="py-1 space-y-1 border-t border-violet-500/20 mt-1">
      <div className="text-[10px] font-medium text-violet-700/90 dark:text-violet-400/90">Adaptation (typed DR)</div>
      <SimSlider
        label="Stacks"
        value={stacks}
        min={0}
        max={ADAPTATION_MAX_STACKS}
        onChange={setStacks}
        tooltip="+10% resistance per stack to the damage type you're taking (20s)"
      />
      <StatRow
        label="Typed resist"
        value={`${typedDRPercent.toFixed(0)}%`}
        color="text-violet-800 dark:text-violet-300"
        tooltip="Resistance to the adapted damage type only"
      />
      <StatRow
        label="Combined DR"
        value={`${combinedDRPercent.toFixed(1)}%`}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Armor DR and Adaptation stack multiplicatively vs that type"
      />
      <StatRow
        label="Adapted EHP"
        value={adaptedEHP.toFixed(0)}
        color="text-violet-700 dark:text-violet-400"
        tooltip="Effective health vs fully adapted single-type damage"
      />
      <p className="text-[9px] text-muted-foreground/80 leading-snug">
        Ramps when you take hits; each element tracks separately. Uses base EHP/DR above.
      </p>
    </div>
  );
}

export function WarframeStatsPanel({
  stats,
  warframe,
  equippedMods,
  allMods,
  equippedArcanes,
  arcaneRanks,
  frostColdEnemies: frostColdEnemiesProp,
  onFrostColdEnemiesChange,
  emberImmolationHeatPct: emberImmolationHeatPctProp,
  onEmberImmolationHeatPctChange,
  gaussBatteryPct: gaussBatteryPctProp,
  onGaussBatteryPctChange,
}: {
  stats: WarframeCalculatedStats | null;
  warframe?: Warframe | null;
  equippedMods?: EquippedMod[];
  allMods?: Map<string, Mod>;
  equippedArcanes?: (Mod | null)[];
  arcaneRanks?: number[];
  /** Controlled Fortifying Freeze sim (builder wires this into Snow Globe). */
  frostColdEnemies?: number;
  onFrostColdEnemiesChange?: (n: number) => void;
  /** Controlled Immolation heat gauge (builder wires into Ember ability cards). */
  emberImmolationHeatPct?: number;
  onEmberImmolationHeatPctChange?: (n: number) => void;
  /** Controlled Gauss battery gauge (builder wires into ability cards + passive). */
  gaussBatteryPct?: number;
  onGaussBatteryPctChange?: (n: number) => void;
}) {
  const [frostColdEnemiesLocal, setFrostColdEnemiesLocal] = useState(5);
  const frostColdEnemies = frostColdEnemiesProp ?? frostColdEnemiesLocal;
  const [emberHeatLocal, setEmberHeatLocal] = useState(0);
  const emberImmolationHeatPct = emberImmolationHeatPctProp ?? emberHeatLocal;
  const setEmberImmolationHeatPct = onEmberImmolationHeatPctChange ?? setEmberHeatLocal;
  const [gaussBatteryLocal, setGaussBatteryLocal] = useState(80);
  const gaussBatteryPct = gaussBatteryPctProp ?? gaussBatteryLocal;
  const setGaussBatteryPct = onGaussBatteryPctChange ?? setGaussBatteryLocal;
  const setFrostColdEnemies = onFrostColdEnemiesChange ?? setFrostColdEnemiesLocal;

  const arcaneDisplays = useMemo(() => {
    if (!equippedArcanes || !stats) return [];
    return equippedArcanes
      .map((arcane, i) => {
        if (!arcane) return null;
        const rank = arcaneRanks?.[i] ?? arcane.maxRank;
        return getArcaneDisplayInfo(arcane, rank, {
          totalArmor: stats.totalArmor,
          persistenceActive: stats.persistenceActive,
        });
      })
      .filter(Boolean);
  }, [equippedArcanes, arcaneRanks, stats]);

  if (!stats) {
    return (
      <div className="border border-border rounded-xl p-4 bg-card">
        <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-3">STATS</h3>
        <p className="text-xs text-muted-foreground">Select a warframe to see stats</p>
      </div>
    );
  }

  // Detect equipped augments (with rank for display)
  const equippedAugments: { mod: Mod; rank: number }[] = [];
  if (equippedMods && allMods) {
    for (const em of equippedMods) {
      const mod = allMods.get(em.modId);
      if (mod && mod.category === "augment") {
        equippedAugments.push({ mod, rank: em.rank });
      }
    }
  }

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-1">
      <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-2">WARFRAME STATS</h3>

      {warframe?.passive && (
        <CollapsibleSection title="PASSIVE" defaultOpen>
          <p className="text-[11px] text-muted-foreground leading-relaxed py-1">{formatAbilityDescription(warframe.passive)}</p>
          {(warframe.id === "gauss" || warframe.id === "gauss_prime") && (
            <GaussPassiveBattery
              batteryPct={gaussBatteryPct}
              onBatteryPctChange={setGaussBatteryPct}
            />
          )}
          {(warframe.id === "baruuk" || warframe.id === "baruuk_prime") && <BaruukRestraintPassive />}
          {(warframe.id === "valkyr" || warframe.id === "valkyr_prime") && <ValkyrRagePassive />}
          {(warframe.id === "ember" || warframe.id === "ember_prime") && (
            <EmberHeatPassive
              immolationHeatPct={emberImmolationHeatPct}
              onImmolationHeatPctChange={setEmberImmolationHeatPct}
            />
          )}
          {(warframe.id === "garuda" || warframe.id === "garuda_prime") && <GarudaDeathsGatePassive />}
          {(warframe.id === "frost" || warframe.id === "frost_prime") && (
            <FrostFortifyingFreezePassive
              moddedArmor={stats.totalArmor}
              coldEnemies={frostColdEnemies}
              onColdEnemiesChange={setFrostColdEnemies}
            />
          )}
          {warframe.id === "cyte_09" && <Cyte09PracticedAimPassive />}
          {(warframe.id === "grendel" || warframe.id === "grendel_prime") && (
            <GrendelBellyArmorPassive moddedArmor={stats.totalArmor} />
          )}
          {(warframe.id === "caliban" || warframe.id === "caliban_prime") && (
            <CalibanAdaptiveArmorPassive
              effectiveHealth={stats.effectiveHealth}
              armorDrFraction={stats.damageReduction / 100}
            />
          )}
          {(warframe.id === "protea" || warframe.id === "protea_prime") && (
            <ProteaPowerRecorderPassive abilityStrength={stats.abilityStrength} />
          )}
          {(warframe.id === "styanax" || warframe.id === "styanax_prime") && (
            <StyanaxHoplitePassive moddedShield={stats.totalShield} />
          )}
          {(warframe.id === "yareli" || warframe.id === "yareli_prime") && <YareliCriticalFlowPassive />}
          {(warframe.id === "zephyr" || warframe.id === "zephyr_prime") && <ZephyrAirbornePassive />}
          {(warframe.id === "xaku" || warframe.id === "xaku_prime") && <XakuEvasionPassive />}
          {(warframe.id === "volt" || warframe.id === "volt_prime") && <VoltStaticDischargePassive />}
          {(warframe.id === "trinity" || warframe.id === "trinity_prime") && (
            <TrinityLifegiverPassive maxEnergy={stats.totalEnergy} />
          )}
          {(warframe.id === "mesa" || warframe.id === "mesa_prime") && (
            <MesaPassiveBonusesPanel moddedHealth={stats.totalHealth} />
          )}
          {warframe.id === "qorvex" && <QorvexCoreExposurePassive />}
          {(warframe.id === "excalibur" ||
            warframe.id === "excalibur_prime" ||
            warframe.id === "excalibur_umbra") && <ExcaliburSwordsmanshipPassive />}
          {(warframe.id === "saryn" || warframe.id === "saryn_prime") && <SarynStatusDurationPassive />}
          {warframe.id === "kullervo" && <KullervoMeleePassive />}
          {(warframe.id === "vauban" || warframe.id === "vauban_prime") && <VaubanIncapacitatedPassive />}
          {(warframe.id === "ash" || warframe.id === "ash_prime") && <AshSlashPassive />}
          {(warframe.id === "hydroid" || warframe.id === "hydroid_prime") && <HydroidCorrosivePassive />}
          {warframe.id === "dante" && <DanteChroniclersMarkPassive />}
          {warframe.id === "dagath" && <DagathAbundantAbyssPassive />}
          {(warframe.id === "equinox" || warframe.id === "equinox_prime") && <EquinoxOrbConversionPassive />}
          {(warframe.id === "revenant" || warframe.id === "revenant_prime") && <RevenantShieldPulsePassive />}
          {(warframe.id === "octavia" || warframe.id === "octavia_prime") && <OctaviaInspirationPassivePanel />}
          {(warframe.id === "nekros" || warframe.id === "nekros_prime") && <NekrosDeathHealPassivePanel />}
          {(warframe.id === "nova" || warframe.id === "nova_prime") && <NovaOrbDropPassive />}
          {(warframe.id === "ivara" || warframe.id === "ivara_prime") && <IvaraRadarPassive />}
          {(warframe.id === "nezha" || warframe.id === "nezha_prime") && <NezhaSlidePassive />}
          {(warframe.id === "mirage" || warframe.id === "mirage_prime") && <MirageParkourPassive />}
          {(warframe.id === "loki" || warframe.id === "loki_prime") && <LokiWallLatchPassive />}
          {(warframe.id === "lavos" || warframe.id === "lavos_prime") && <LavosValenceBlockPassivePanel />}
          {(warframe.id === "khora" || warframe.id === "khora_prime") && <KhoraVenariPassivePanel />}
          {(warframe.id === "oberon" || warframe.id === "oberon_prime") && <OberonRighteousNegationPassivePanel />}
          {warframe.id === "jade" && <JadeJudgmentPassivePanel />}
          {warframe.id === "temple" && (
            <TempleBackbeatPassivePanel abilityEfficiency={stats.abilityEfficiency} />
          )}
          {warframe.id === "oraxia" && <OraxiaPredatorsLurkPassivePanel />}
          {(warframe.id === "rhino" || warframe.id === "rhino_prime") && <RhinoHardLandingPassivePanel />}
          {(warframe.id === "gara" || warframe.id === "gara_prime") && <GaraPassiveBlindPanel />}
          {(warframe.id === "limbo" || warframe.id === "limbo_prime") && <LimboRiftPassivePanel />}
          {(warframe.id === "mag" || warframe.id === "mag_prime") && <MagVacuumPassivePanel />}
          {warframe.id === "koumei" && <KoumeiFatePassivePanel />}
          {(warframe.id === "banshee" || warframe.id === "banshee_prime") && <BansheeSilencePassivePanel />}
          {(warframe.id === "atlas" || warframe.id === "atlas_prime") && <AtlasKnockdownPassivePanel />}
          {(warframe.id === "nyx" || warframe.id === "nyx_prime") && <NyxPsychicPassivePanel />}
          {(warframe.id === "harrow" || warframe.id === "harrow_prime") && <HarrowPassivePanel />}
          {(warframe.id === "gyre" || warframe.id === "gyre_prime") && <GyreAbilityCritPassivePanel />}
          {(warframe.id === "citrine" || warframe.id === "citrine_prime") && <CitrineGeoluminesencePassivePanel />}
          {(warframe.id === "chroma" || warframe.id === "chroma_prime") && <ChromaPassivePanel />}
          {(warframe.id === "titania" || warframe.id === "titania_prime") && <TitaniaUpsurgePassivePanel />}
          {(warframe.id === "hildryn" || warframe.id === "hildryn_prime") && <HildrynShieldGatePassivePanel />}
          {(warframe.id === "nidus" || warframe.id === "nidus_prime") && <NidusUndyingPassivePanel />}
          {warframe.id === "sirius_orion" && <SiriusOrionPassivePanel />}
          {(warframe.id === "wisp" || warframe.id === "wisp_prime") && <WispAirborneInvisPassivePanel />}
          {warframe.id === "follie" && <FollieInkblotPassivePanel />}
          {(warframe.id === "sevagoth" || warframe.id === "sevagoth_prime") && (
            <SevagothTombstonePassivePanel />
          )}
          {(warframe.id === "inaros" || warframe.id === "inaros_prime") && (
            <InarosPassivePanel maxHealth={stats.totalHealth} />
          )}
          {warframe.id === "nokko" && <NokkoVitalDecayPassivePanel />}
          {(warframe.id === "wukong" || warframe.id === "wukong_prime") && (
            <WukongFiveTechniquesPassivePanel />
          )}
          {(warframe.id === "voruna" || warframe.id === "voruna_prime") && <VorunaWolvesPassivePanel />}
          {warframe.id === "uriel" && <UrielLegionPassivePanel />}
        </CollapsibleSection>
      )}

      <CollapsibleSection title="SURVIVABILITY" defaultOpen>
        <StatRow label="Health" value={stats.totalHealth.toFixed(0)} />
        <StatRow label="Shield" value={stats.totalShield.toFixed(0)} />
        <StatRow label="Armor" value={stats.totalArmor.toFixed(0)} />
        <StatRow label="Energy" value={stats.totalEnergy.toFixed(0)} />
        <StatRow label="Sprint Speed" value={stats.totalSprint.toFixed(2)} />
        {stats.slideSpeedBonus !== 0 && (
          <StatRow
            label="Slide Speed"
            value={`${stats.slideSpeedBonus > 0 ? "+" : ""}${(stats.slideSpeedBonus * 100).toFixed(0)}%`}
            color={stats.slideSpeedBonus > 0 ? "text-cyan-700 dark:text-cyan-400" : "text-red-700 dark:text-red-400"}
            tooltip="From Maglev / Cunning Drift / Streamlined Form, etc."
          />
        )}
        {stats.parkourVelocityBonus > 0 && (
          <StatRow label="Parkour Velocity" value={`+${(stats.parkourVelocityBonus * 100).toFixed(0)}%`} color="text-cyan-700 dark:text-cyan-400" />
        )}
        {stats.healthRegenPerSec > 0 && (
          <StatRow label="Health Regen" value={`${stats.healthRegenPerSec.toFixed(1)}/s`} color="text-green-700 dark:text-green-400" />
        )}
        {stats.elementalResistance > 0 && (
          <StatRow label="Elemental Resist" value={`${stats.elementalResistance.toFixed(0)}%`} color="text-cyan-700 dark:text-cyan-400" />
        )}
        {stats.persistenceDamageCapPerSecond != null && (
          <p
            className={`text-[10px] leading-snug pt-0.5 ${stats.persistenceActive ? "text-amber-800/90 dark:text-amber-400/90" : "text-muted-foreground"}`}
            title="Shields removed while equipped. Magnetic and nullify disable the damage cap."
          >
            Arcane Persistence: shields removed
            {stats.persistenceActive
              ? ` — damage capped at ${stats.persistenceDamageCapPerSecond}/s (armor ≥ 700)`
              : ` — needs 700+ armor for ${stats.persistenceDamageCapPerSecond}/s damage cap (currently ${stats.totalArmor.toFixed(0)} armor)`}
            {" "}(not included in EHP).
          </p>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="ABILITY MODS" defaultOpen>
        <StatRow label="Strength" value={`${(stats.abilityStrength * 100).toFixed(0)}%`}
          color={stats.abilityStrength > 1 ? "text-orange-700 dark:text-orange-400" : stats.abilityStrength < 1 ? "text-red-700 dark:text-red-400" : undefined} />
        <StatRow label="Duration" value={`${(stats.abilityDuration * 100).toFixed(0)}%`}
          color={stats.abilityDuration > 1 ? "text-cyan-700 dark:text-cyan-400" : stats.abilityDuration < 1 ? "text-red-700 dark:text-red-400" : undefined} />
        <StatRow label="Efficiency" value={`${(stats.abilityEfficiency * 100).toFixed(0)}%`}
          color={stats.abilityEfficiency > 1 ? "text-blue-400" : stats.abilityEfficiency < 1 ? "text-red-700 dark:text-red-400" : undefined} />
        <StatRow label="Range" value={`${(stats.abilityRange * 100).toFixed(0)}%`}
          color={stats.abilityRange > 1 ? "text-green-700 dark:text-green-400" : stats.abilityRange < 1 ? "text-red-700 dark:text-red-400" : undefined} />
      </CollapsibleSection>

      <CollapsibleSection title="EFFECTIVE HEALTH" defaultOpen>
        <StatRow label="Effective Health" value={stats.effectiveHealth.toFixed(0)} highlighted />
        <StatRow label="Damage Reduction" value={`${stats.damageReduction.toFixed(1)}%`} highlighted />
        {stats.adaptationNoteMaxTypedDRPercent != null && (
          <AdaptationSurvivability stats={stats} />
        )}
      </CollapsibleSection>

      {stats.setBonusSummary && stats.setBonusSummary.length > 0 && (
        <CollapsibleSection title="SET BONUSES" defaultOpen={false}>
          <div className="space-y-1 py-1">
            {stats.setBonusSummary.map((row) => (
              <div key={row.setId} className="text-[10px] leading-snug">
                <span className={row.active ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"}>
                  {row.label}: {row.pieces}/{row.required}
                  {row.active ? " ✓" : ""}
                </span>
                <div className="text-[9px] text-muted-foreground/80 pl-0.5">{row.description}</div>
              </div>
            ))}
            {(stats.augurEnergyToShieldsPercent ?? 0) > 0 && (
              <StatRow
                label="Augur (shields)"
                value={`${stats.augurEnergyToShieldsPercent}% of energy → shields`}
                color="text-sky-700 dark:text-sky-400"
                tooltip="Shields gained per cast are shown on each ability card from that ability’s energy cost."
              />
            )}
            {(stats.hunterCompanionVsStatusDamagePercent ?? 0) > 0 && (
              <StatRow
                label="Hunter (companion)"
                value={`+${stats.hunterCompanionVsStatusDamagePercent}% dmg vs Slash (${(1 + (stats.hunterCompanionVsStatusDamagePercent ?? 0) / 100).toFixed(2)}×)`}
                color="text-amber-800 dark:text-amber-400"
                tooltip="Applies to beast claws / sentinel weapons when the Hunter vs Slash DPS toggle is on (companion builder / loadout sim)."
              />
            )}
            {(stats.mechaSetPieces ?? 0) > 0 && (
              <>
                <StatRow
                  label="Mecha (mark)"
                  value={`${stats.mechaSetPieces}/4 pieces`}
                  color="text-orange-700 dark:text-orange-400"
                  tooltip="Companion mark + status spread on kill. Requires Kubrow or Predasite."
                />
                <MechaMarkTimingPanel pieces={stats.mechaSetPieces ?? 0} />
              </>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Arcane Bonuses */}
      {arcaneDisplays.length > 0 && (
        <CollapsibleSection title="ARCANE BONUSES" defaultOpen>
          {arcaneDisplays.map((info) => info && (
            <div key={info.name} className="py-1.5 border-b border-border/30 last:border-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-purple-300">{info.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">R{info.rank}/{info.maxRank}</span>
              </div>
              {info.applied.map((line, i) => (
                <div key={`a-${i}`} className="py-0.5">
                  <StatRow
                    label={line.label}
                    value={line.value}
                    color={line.active === false ? "text-muted-foreground" : "text-purple-700 dark:text-purple-400"}
                  />
                  {line.note && (
                    <p className="text-[9px] text-muted-foreground/80 pl-0.5">{line.note}</p>
                  )}
                </div>
              ))}
              {info.conditional.map((line, i) => (
                <div key={`c-${i}-${line.label}`} className="py-0.5">
                  <StatRow
                    label={line.label}
                    value={line.value}
                    color={line.active ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}
                  />
                  {line.note && (
                    <p className="text-[9px] text-muted-foreground/80 pl-0.5">{line.note}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Equipped Augments */}
      {equippedAugments.length > 0 && (
        <CollapsibleSection title="AUGMENTS" defaultOpen>
          {equippedAugments.map(({ mod, rank }) => {
            const statLines = getModStatDisplayLines(mod, rank);
            return (
              <div key={mod.id} className="py-1.5 border-b border-border/30 last:border-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-purple-300">{mod.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    R{rank}/{mod.maxRank} · ⚡{mod.drain + rank}
                  </span>
                </div>
                {mod.description && (
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {cleanModDescription(mod.description)}
                  </p>
                )}
                {statLines.length > 0 ? (
                  <ul className="space-y-0.5">
                    {statLines.map((line) => (
                      <li key={line.statKey} className="flex justify-between gap-2 text-[10px]">
                        <span className="text-muted-foreground truncate">{line.label}</span>
                        <span className="font-mono text-purple-300/90 shrink-0 text-right">
                          {line.atRank}
                          {rank < mod.maxRank && (
                            <span className="text-muted-foreground/70"> ({line.atMax} max)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-muted-foreground/80 italic">Ability effect — see description</p>
                )}
              </div>
            );
          })}
        </CollapsibleSection>
      )}
    </div>
  );
}

