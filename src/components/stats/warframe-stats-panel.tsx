"use client";

import { WarframeCalculatedStats, Warframe, Mod, EquippedMod, EquippedArchonShard } from "@/lib/types";
import { useMemo, useState } from "react";
import { formatAbilityDescription } from "@/lib/display/ability-text";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";
import { buildShardBonusLines } from "@/lib/display/shard-display";
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
  computeOctaviaInspirationEnergyRemaining,
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
  computeLavosValenceBlockRemaining,
  computeKhoraVenariPassive,
  computeOberonRighteousNegationPassive,
  computeOberonRighteousNegationStacks,
  computeJadeJudgmentPassive,
  computeJadeJudgmentRemaining,
  computeJadeJudgmentDamageMultiplier,
  computeTempleBackbeatEfficiencyBonus,
  computeOraxiaPredatorsLurkPassive,
  computeOraxiaPredatorsLurkRemaining,
  computeRhinoHardLandingPulse,
  computeRhinoHardLandingDamageAtDistance,
  computeGaraPassiveBlind,
  computeGaraPassiveBlindChance,
  computeLimboRiftPassive,
  computeLimboRiftEnergyGained,
  computeMagVacuumPassive,
  computeKoumeiFatePassive,
  computeKoumeiFateRemaining,
  computeBansheeSilencePassive,
  computeAtlasKnockdownPassive,
  computeNyxPsychicCritChance,
  computeHarrowPassive,
  computeGyreAbilityCritChance,
  computeCitrineGeoluminesence,
  computeChromaDragonFlightPassive,
  computeChromaElementCycle,
  computeTitaniaUpsurgePassive,
  computeTitaniaUpsurgeRemaining,
  computeHildrynShieldGatePassive,
  computeNidusUndyingPassive,
  computeSiriusOrionPassive,
  computeSiriusOrionEfficiencyCastsRemaining,
  computeWispAirborneInvisPassive,
  computeFollieInkblotPassive,
  computeFollieInkblotExpected,
  computeSevagothTombstonePassive,
  computeSevagothTombstoneSoulsRemaining,
  computeInarosPassive,
  computeInarosFinisherHeal,
  computeNokkoVitalDecayPassive,
  computeNokkoVitalDecayRemaining,
  computeWukongFiveTechniquesPassive,
  computeVorunaWolvesPassive,
  computeVorunaUlfrunCooldownRemaining,
  computeUrielLegionPassive,
  computeUrielDemonResurrectRemaining,
  scaledAbilityEnergyCost,
  type MesaSidearmStyle,
  type NovaSpeedState,
  type ChromaElement,
} from "@/lib/codex/ability-misc-stats";
import { augurShieldsFromEnergySpent, computeMechaSetMarkStats } from "@/lib/calc/set-bonuses";
import { CollapsibleSection, SimSlider, StatRow } from "./stat-primitives";

function GaussPassiveBattery() {
  const [batteryPct, setBatteryPct] = useState(80);
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
        onChange={setBatteryPct}
        tooltip="Gauss passive: shield recharge and delay reduction scale linearly with battery (wiki: 80% → 96%/64%)."
      />
      <StatRow
        label="Shield Recharge"
        value={`+${(recharge * 100).toFixed(0)}%`}
        color="text-sky-400"
        tooltip="Max +120% at full battery (not affected by Ability Strength)."
      />
      <StatRow
        label="Recharge Delay"
        value={`−${(delay * 100).toFixed(0)}%`}
        color="text-sky-400"
        tooltip="Max −80% delay at full battery (not affected by Ability Strength)."
      />
    </div>
  );
}

function BaruukRestraintPassive() {
  const [erodedPct, setErodedPct] = useState(100);
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
        color="text-amber-400"
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
        color="text-red-400"
        tooltip="Flat additive melee damage bonus from Rage (not × Ability Strength)."
      />
      <StatRow
        label="Death Prevention"
        value={deathPrev ? "Ready (≥150%)" : "Inactive"}
        color={deathPrev ? "text-green-400" : "text-muted-foreground"}
        tooltip="Fatal hit consumes Rage, grants 5s invuln and full heal (wiki)."
      />
    </div>
  );
}

function EmberHeatPassive() {
  const [heatEnemies, setHeatEnemies] = useState(5);
  const bonusStr = computeEmberPassiveAbilityStrength(heatEnemies);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
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
        color="text-orange-400"
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
        color="text-red-400"
        tooltip="Multiplicative universal weapon bonus (panel-only; not wired into weapon DPS)."
      />
    </div>
  );
}

function FrostFortifyingFreezePassive({ moddedArmor }: { moddedArmor: number }) {
  const [coldEnemies, setColdEnemies] = useState(5);
  const bonusArmor = computeFrostPassiveArmor(coldEnemies);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Cold Enemies"
        value={coldEnemies}
        min={0}
        max={40}
        onChange={setColdEnemies}
        tooltip="Frost Fortifying Freeze: +50 Armor per enemy with Cold status in Affinity Range."
      />
      <StatRow
        label="Bonus Armor"
        value={`+${bonusArmor}`}
        color="text-sky-400"
        tooltip="Flat armor after mods (not × Ability Strength). Ability Cold status also lasts +100%."
      />
      <StatRow
        label="Armor w/ Passive"
        value={(moddedArmor + bonusArmor).toFixed(0)}
        color="text-sky-400"
        tooltip="Modded armor + Fortifying Freeze bonus."
      />
    </div>
  );
}

function Cyte09PracticedAimPassive() {
  const [wpKills, setWpKills] = useState(100);
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
        color="text-amber-400"
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
        color="text-amber-400"
        tooltip="Flat armor after mods (not × Ability Strength)."
      />
      <StatRow
        label="Armor w/ Passive"
        value={(moddedArmor + bonusArmor).toFixed(0)}
        color="text-amber-400"
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
  const [hits, setHits] = useState(10);
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
        color="text-violet-300"
        tooltip="Per damage type; does not stack with Adaptation (higher of the two)."
      />
      <StatRow
        label="Combined DR"
        value={`${combinedDrPct.toFixed(1)}%`}
        color="text-violet-400"
        tooltip="Armor DR × Adaptive Armor vs that type."
      />
      <StatRow
        label="Adapted EHP"
        value={adaptedEhp.toFixed(0)}
        color="text-violet-400"
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
        color={bonus > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip="Additive +100% Ability Strength on the empowered cast only."
      />
      <StatRow
        label="Effective STR"
        value={`${(nextStr * 100).toFixed(0)}%`}
        color="text-amber-400"
        tooltip="Current Ability Strength + passive bonus if power recorder is full."
      />
    </div>
  );
}

function StyanaxHoplitePassive({ moddedShield }: { moddedShield: number }) {
  const maxShields = Math.max(2000, Math.ceil(moddedShield + 1200));
  const [currentShields, setCurrentShields] = useState(Math.round(moddedShield));
  const cc = computeStyanaxHopliteCritChance(currentShields);
  const speargunCc = computeStyanaxHopliteCritChance(currentShields, { speargun: true });

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Current Shields"
        value={currentShields}
        min={0}
        max={maxShields}
        onChange={setCurrentShields}
        tooltip="Styanax Hoplite: +1% weapon Critical Chance per 40 shields (includes Overshields)."
      />
      <StatRow
        label="Hoplite CC"
        value={`+${(cc * 100).toFixed(0)}%`}
        color="text-sky-400"
        tooltip="Additive weapon crit chance (primary/secondary/melee)."
      />
      <StatRow
        label="w/ Speargun"
        value={`+${(speargunCc * 100).toFixed(0)}%`}
        color="text-amber-400"
        tooltip="Doubled while a Speargun primary is equipped (Afentis, Scytax, etc.)."
      />
    </div>
  );
}

function YareliCriticalFlowPassive() {
  const [moving, setMoving] = useState(1);
  const cc = computeYareliCriticalFlowCritChance(moving > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Moving"
        value={moving}
        min={0}
        max={1}
        onChange={setMoving}
        tooltip="Yareli Critical Flow: after 1.5s of movement, +200% Secondary Critical Chance until idle 1s."
      />
      <StatRow
        label="Secondary CC"
        value={cc > 0 ? `+${(cc * 100).toFixed(0)}%` : "Inactive"}
        color={cc > 0 ? "text-sky-400" : "text-muted-foreground"}
        tooltip="Additive to secondary weapon base crit chance mods (panel-only)."
      />
    </div>
  );
}

function ZephyrAirbornePassive() {
  const [airborne, setAirborne] = useState(1);
  const cc = computeZephyrAirborneCritChance(airborne > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Airborne"
        value={airborne}
        min={0}
        max={1}
        onChange={setAirborne}
        tooltip="Zephyr passive: +150% weapon Critical Chance while airborne (also slower fall / more maneuverable)."
      />
      <StatRow
        label="Weapon CC"
        value={cc > 0 ? `+${(cc * 100).toFixed(0)}%` : "Inactive"}
        color={cc > 0 ? "text-sky-400" : "text-muted-foreground"}
        tooltip="Additive to all equipped weapons' crit chance while airborne (panel-only)."
      />
    </div>
  );
}

function XakuEvasionPassive() {
  const [vastUntime, setVastUntime] = useState(0);
  const { dodgeChance, aoeDamageReduction } = computeXakuPassiveEvasion(vastUntime > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Vast Untime"
        value={vastUntime}
        min={0}
        max={1}
        onChange={setVastUntime}
        tooltip="Xaku passive: 25% dodge + 25% AoE DR; both become 75% while The Vast Untime is active."
      />
      <StatRow
        label="Dodge Chance"
        value={`${(dodgeChance * 100).toFixed(0)}%`}
        color="text-violet-300"
        tooltip="Chance to phase through enemy weapon attacks (separate from Evasion)."
      />
      <StatRow
        label="AoE DR"
        value={`${(aoeDamageReduction * 100).toFixed(0)}%`}
        color="text-violet-400"
        tooltip="Damage reduction vs area-of-effect damage (explosions are not dodged)."
      />
    </div>
  );
}

function VoltStaticDischargePassive() {
  const [meters, setMeters] = useState(50);
  const bonusDmg = computeVoltStaticDischargeDamage(meters);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Meters Traveled"
        value={meters}
        min={0}
        max={100}
        onChange={setMeters}
        tooltip="Volt Static Discharge: +10 Electricity damage per grounded meter (cap 1000). Discharges on next hit."
      />
      <StatRow
        label="Bonus Damage"
        value={`+${bonusDmg.toFixed(0)}`}
        color="text-yellow-400"
        tooltip="Separate Electricity hit on next weapon attack or ability; not × Ability Strength."
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
        color="text-green-400"
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

const MESA_SIDEARM_STYLES: MesaSidearmStyle[] = ["none", "single", "dual"];

function MesaPassiveBonusesPanel({ moddedHealth }: { moddedHealth: number }) {
  const [sidearmIdx, setSidearmIdx] = useState(2); // dual
  const [meleeEquipped, setMeleeEquipped] = useState(0);
  const style = MESA_SIDEARM_STYLES[Math.min(2, Math.max(0, sidearmIdx))] ?? "dual";
  const bonuses = computeMesaPassiveBonuses({
    sidearmStyle: style,
    meleeEquipped: meleeEquipped > 0,
  });

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Sidearm (0 none / 1 single / 2 dual)"
        value={sidearmIdx}
        min={0}
        max={2}
        onChange={setSidearmIdx}
        tooltip="Mesa: dual-wield +15% fire rate; one-handed +25% reload. Archmelee still allowed for the health bonus."
      />
      <SimSlider
        label="Melee Equipped"
        value={meleeEquipped}
        min={0}
        max={1}
        onChange={setMeleeEquipped}
        tooltip="+50 Health when no melee weapon is equipped in the loadout."
      />
      <StatRow
        label="Fire Rate"
        value={bonuses.fireRateBonus > 0 ? `+${(bonuses.fireRateBonus * 100).toFixed(0)}%` : "—"}
        color={bonuses.fireRateBonus > 0 ? "text-amber-400" : "text-muted-foreground"}
        tooltip="Dual-wielded sidearms only."
      />
      <StatRow
        label="Reload Speed"
        value={bonuses.reloadSpeedBonus > 0 ? `+${(bonuses.reloadSpeedBonus * 100).toFixed(0)}%` : "—"}
        color={bonuses.reloadSpeedBonus > 0 ? "text-amber-400" : "text-muted-foreground"}
        tooltip="One-handed sidearms only."
      />
      <StatRow
        label="Health w/ Passive"
        value={(moddedHealth + bonuses.bonusHealth).toFixed(0)}
        color="text-green-400"
        tooltip={bonuses.bonusHealth > 0 ? "+50 flat Health (no melee)." : "Melee equipped — no Health bonus."}
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
        color="text-amber-400"
        tooltip="Core Exposure: +3 Punch Through on primary, secondary, and melee (panel-only; not wired into weapon DPS)."
      />
    </div>
  );
}

function ExcaliburSwordsmanshipPassive() {
  const [wieldingSword, setWieldingSword] = useState(1);
  const { damageBonus, attackSpeedBonus } = computeExcaliburSwordsmanshipBonuses(wieldingSword > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Wielding Sword"
        value={wieldingSword}
        min={0}
        max={1}
        onChange={setWieldingSword}
        tooltip="Excalibur Swordsmanship: +10% damage and +10% attack speed with swords, dual swords, nikanas, and rapiers."
      />
      <StatRow
        label="Melee Damage"
        value={damageBonus > 0 ? `+${(damageBonus * 100).toFixed(0)}%` : "Inactive"}
        color={damageBonus > 0 ? "text-amber-400" : "text-muted-foreground"}
        tooltip="Additive melee damage bonus (panel-only)."
      />
      <StatRow
        label="Attack Speed"
        value={attackSpeedBonus > 0 ? `+${(attackSpeedBonus * 100).toFixed(0)}%` : "Inactive"}
        color={attackSpeedBonus > 0 ? "text-amber-400" : "text-muted-foreground"}
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
        color="text-green-400"
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
        color="text-amber-400"
        tooltip="Kullervo passive on all melee. HAE hard-caps at 90% with other sources."
      />
      <StatRow
        label="Heavy Wind Up"
        value={`+${(heavyAttackWindUpSpeed * 100).toFixed(0)}%`}
        color="text-amber-400"
        tooltip="+100% Heavy Attack Wind Up Speed on all melee weapons (panel-only)."
      />
    </div>
  );
}

function VaubanIncapacitatedPassive() {
  const [incapacitated, setIncapacitated] = useState(1);
  const bonus = computeVaubanIncapacitatedDamageBonus(incapacitated > 0);
  const exampleHit = 100 * (1 + bonus);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Target Incapacitated"
        value={incapacitated}
        min={0}
        max={1}
        onChange={setIncapacitated}
        tooltip="Vauban: +25% multiplicative damage vs incapacitated enemies (stun, freeze at 10 stacks, Bastille, etc.)."
      />
      <StatRow
        label="Damage Bonus"
        value={bonus > 0 ? `+${(bonus * 100).toFixed(0)}%` : "Inactive"}
        color={bonus > 0 ? "text-amber-400" : "text-muted-foreground"}
        tooltip="Multiplicative to total damage (and again on status DoTs applied while incapacitated)."
      />
      <StatRow
        label="Example 100 Hit"
        value={bonus > 0 ? `${exampleHit.toFixed(0)}` : "100"}
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
        color="text-red-400"
        tooltip="Ash passive: Slash (Bleed) status damage +25%, additive with other Status Damage bonuses."
      />
      <StatRow
        label="Slash Status Dur"
        value={`+${(statusDurationBonus * 100).toFixed(0)}%`}
        color="text-red-400"
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
  const [marked, setMarked] = useState(1);
  const strip = computeHydroidCorrosiveArmorStrip(marked > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Marked by Hydroid"
        value={marked}
        min={0}
        max={1}
        onChange={setMarked}
        tooltip="Hydroid: after he damages an enemy, Corrosive from any source gets boosted armor strip."
      />
      <StatRow
        label="1st Stack Strip"
        value={`${(strip.firstStackStrip * 100).toFixed(0)}%`}
        color="text-lime-400"
        tooltip="Normal Corrosive first stack is 26%; Hydroid-marked enemies take 50%."
      />
      <StatRow
        label="Full Stack Strip"
        value={`${(strip.fullStackStrip * 100).toFixed(0)}%`}
        color="text-lime-400"
        tooltip="Normal Corrosive caps at 80% armor strip; Hydroid-marked can reach 100%."
      />
    </div>
  );
}

function DanteChroniclersMarkPassive() {
  const [scanned, setScanned] = useState(1);
  const [baseScPct, setBaseScPct] = useState(40);
  const scaled = computeDanteChroniclersMarkStatusChance(baseScPct / 100, scanned > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Weapon SC %"
        value={baseScPct}
        min={0}
        max={100}
        onChange={setBaseScPct}
        tooltip="Post-mod Status Chance before Chronicler's Mark (multiplicative ×1.5 on fully scanned foes)."
      />
      <SimSlider
        label="Fully Scanned"
        value={scanned}
        min={0}
        max={1}
        onChange={setScanned}
        tooltip="Dante: completed Codex research on the enemy type grants Chronicler's Mark."
      />
      <StatRow
        label="Status Chance"
        value={`${(scaled * 100).toFixed(0)}%`}
        color={scanned > 0 ? "text-amber-400" : "text-muted-foreground"}
        tooltip="Wiki example: 40% × 1.5 = 60% vs fully researched enemies."
      />
    </div>
  );
}

function DagathAbundantAbyssPassive() {
  const [orbValue, setOrbValue] = useState(25);
  const [forceProc, setForceProc] = useState(2); // 0=off, 1=on, 2=expected
  const result = computeDagathAbundantAbyss(
    orbValue,
    forceProc === 2 ? undefined : { forceProc: forceProc === 1 },
  );

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Base Orb Value"
        value={orbValue}
        min={25}
        max={100}
        onChange={setOrbValue}
        tooltip="Small Energy/Health orb is 25; large 50; Empowered Health 100."
      />
      <SimSlider
        label="Proc (0 off / 1 on / 2 avg)"
        value={forceProc}
        min={0}
        max={2}
        onChange={setForceProc}
        tooltip="Dagath Abundant Abyss: 35% chance orbs are +300% more effective (×4 yield)."
      />
      <StatRow
        label="Proc Chance"
        value={`${(result.procChance * 100).toFixed(0)}%`}
        color="text-violet-300"
        tooltip="Rolled separately for Health and Energy on Universal Orbs."
      />
      <StatRow
        label="Orb Yield"
        value={result.effectiveValue.toFixed(1)}
        color="text-violet-400"
        tooltip={
          forceProc === 2
            ? `Expected value at ${((result.expectedYieldMultiplier - 1) * 100).toFixed(0)}% average uplift (×${result.expectedYieldMultiplier.toFixed(2)}).`
            : forceProc === 1
              ? "Proc active: ×4 yield (+300%)."
              : "No proc: base orb value."
        }
      />
    </div>
  );
}

function EquinoxOrbConversionPassive() {
  const [orbKind, setOrbKind] = useState(0); // 0 health, 1 energy
  const [orbValue, setOrbValue] = useState(50);
  const kind = orbKind > 0 ? "energy" : "health";
  const result = computeEquinoxOrbConversion(orbValue, kind);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Orb (0 Health / 1 Energy)"
        value={orbKind}
        min={0}
        max={1}
        onChange={setOrbKind}
        tooltip="Equinox: 10% of Health Orbs convert to Energy; 10% of Energy Orbs convert to Health."
      />
      <SimSlider
        label="Orb Value"
        value={orbValue}
        min={25}
        max={100}
        onChange={setOrbValue}
        tooltip="Primary restore amount before conversion (small 25 / large 50 / Empowered 100)."
      />
      <StatRow
        label={kind === "health" ? "Health" : "Energy"}
        value={`+${result.primaryAmount.toFixed(0)}`}
        color="text-sky-400"
        tooltip="Full orb value applied to its primary resource."
      />
      <StatRow
        label={result.convertedResource === "energy" ? "→ Energy" : "→ Health"}
        value={`+${result.convertedAmount.toFixed(1)}`}
        color="text-amber-400"
        tooltip="10% of the orb value converted to the other resource (stacks additively with Equilibrium)."
      />
    </div>
  );
}

function RevenantShieldPulsePassive() {
  const pulse = computeRevenantShieldDepletionPulse();
  const [distancePct, setDistancePct] = useState(0);
  const dmg = computeRevenantShieldPulseDamageAtDistance(distancePct / 100, pulse);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Distance % of Radius"
        value={distancePct}
        min={0}
        max={100}
        onChange={setDistancePct}
        tooltip={`Revenant: on shield break, ${pulse.damage} Impact knockdown in ${pulse.radius}m (${(pulse.maxFalloff * 100).toFixed(0)}% falloff at edge).`}
      />
      <StatRow
        label="Pulse Damage"
        value={dmg.toFixed(0)}
        color="text-violet-400"
        tooltip="Not affected by Ability Strength. Knocks down enemies in range."
      />
      <StatRow
        label="Radius"
        value={`${pulse.radius}m`}
        color="text-muted-foreground"
        tooltip="Fixed 7.5m radial pulse on shield depletion."
      />
    </div>
  );
}

function OctaviaInspirationPassivePanel() {
  const insp = computeOctaviaInspirationPassive();
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeOctaviaInspirationEnergyRemaining(elapsedSec, insp);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={insp.durationSec}
        onChange={setElapsedSec}
        tooltip="Octavia Inspiration: casting an ability grants 1 energy/s for 30s to allies within 15m (recast refreshes)."
      />
      <StatRow
        label="Energy/s"
        value={`${insp.energyPerSecond}/s`}
        color="text-sky-400"
        tooltip={`Within ${insp.radiusM}m. Not affected by Ability Strength/Duration.`}
      />
      <StatRow
        label="Remaining Energy"
        value={`+${remaining.toFixed(0)}`}
        color="text-sky-400"
        tooltip={`Full buff restores ${insp.totalEnergy} energy over ${insp.durationSec}s.`}
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
        color="text-green-400"
        tooltip="Flat heal, not × Ability Strength."
      />
      <StatRow
        label="Total Heal"
        value={`+${total}`}
        color="text-green-400"
        tooltip={`${deaths} deaths × ${heal.healthPerDeath} Health.`}
      />
    </div>
  );
}

const NOVA_SPEED_STATES: NovaSpeedState[] = ["none", "slowed", "sped"];

function NovaOrbDropPassive() {
  const [speedIdx, setSpeedIdx] = useState(1); // slowed
  const [kills, setKills] = useState(20);
  const speedState = NOVA_SPEED_STATES[Math.min(2, Math.max(0, speedIdx))] ?? "slowed";
  const chances = computeNovaPassiveOrbChances(speedState);
  const expected = computeNovaPassiveExpectedOrbs(kills, speedState);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Speed (0 none / 1 slow / 2 sped)"
        value={speedIdx}
        min={0}
        max={2}
        onChange={setSpeedIdx}
        tooltip="Nova: kills while slowed drop Health Orbs (15%); while sped up drop Energy Orbs (15%). Any slow/speed source."
      />
      <SimSlider
        label="Kills"
        value={kills}
        min={0}
        max={100}
        onChange={setKills}
        tooltip="Expected orb count = kills × drop chance."
      />
      <StatRow
        label="Health Orb Chance"
        value={chances.healthOrbChance > 0 ? `${(chances.healthOrbChance * 100).toFixed(0)}%` : "—"}
        color={chances.healthOrbChance > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip="Only while the enemy is slowed at death."
      />
      <StatRow
        label="Energy Orb Chance"
        value={chances.energyOrbChance > 0 ? `${(chances.energyOrbChance * 100).toFixed(0)}%` : "—"}
        color={chances.energyOrbChance > 0 ? "text-sky-400" : "text-muted-foreground"}
        tooltip="Only while the enemy is sped up at death."
      />
      <StatRow
        label="Expected Orbs"
        value={
          expected.expectedHealthOrbs > 0
            ? `${expected.expectedHealthOrbs.toFixed(1)} Health`
            : expected.expectedEnergyOrbs > 0
              ? `${expected.expectedEnergyOrbs.toFixed(1)} Energy`
              : "0"
        }
        color="text-amber-400"
        tooltip="Average orbs from the selected kill count and speed state."
      />
    </div>
  );
}

function IvaraRadarPassive() {
  const [extraRadar, setExtraRadar] = useState(0);
  const range = computeIvaraEnemyRadarRange(extraRadar);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Extra Radar (m)"
        value={extraRadar}
        min={0}
        max={160}
        onChange={setExtraRadar}
        tooltip="Ivara innate radar is 50m (vs normal 30m). Add Enemy Radar / Animal Instinct / squad auras here."
      />
      <StatRow
        label="Enemy Radar"
        value={`${range}m`}
        color="text-emerald-400"
        tooltip={`Ivara base 50m + extras. Default Warframes sense ${DEFAULT_ENEMY_RADAR_M}m.`}
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
        color="text-orange-400"
        tooltip="Nezha passive: +60% slide speed (additive with Maglev / Cunning Drift). Can be disabled by Controlled Slide."
      />
      <StatRow
        label="Slide Distance"
        value={`+${(slideDistanceBonus * 100).toFixed(0)}%`}
        color="text-orange-400"
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
        color="text-pink-400"
        tooltip="Mirage passive: sliding lasts 85% longer."
      />
      <StatRow
        label="Maneuver Speed"
        value={`+${(maneuverSpeedBonus * 100).toFixed(0)}%`}
        color="text-pink-400"
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
        color="text-emerald-400"
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
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeLavosValenceBlockRemaining(elapsedSec, valence);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={valence.immunityDurationSec}
        onChange={setElapsedSec}
        tooltip="Lavos Valence Block: Energy/Universal Orbs grant status immunity for 10s (orb pickup cooldown 5s)."
      />
      <StatRow
        label="Status Immunity"
        value={remaining > 0 ? `${remaining.toFixed(0)}s left` : "Inactive"}
        color={remaining > 0 ? "text-cyan-400" : "text-muted-foreground"}
        tooltip="Cleanses and blocks negative status effects while active. Renewed to full on a new orb pickup."
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
  const [venariAlive, setVenariAlive] = useState(1);
  const venari = computeKhoraVenariPassive(venariAlive > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Venari Alive"
        value={venariAlive}
        min={0}
        max={1}
        onChange={setVenariAlive}
        tooltip="Khora: Venari grants +15% move speed while alive; respawns after 45s if killed (or instantly via Venari ability)."
      />
      <StatRow
        label="Move Speed"
        value={venari.moveSpeedBonus > 0 ? `+${(venari.moveSpeedBonus * 100).toFixed(0)}%` : "Inactive"}
        color={venari.moveSpeedBonus > 0 ? "text-amber-400" : "text-muted-foreground"}
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
        color={clamped > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip="Granted to Oberon and allies in Affinity Range; each ally consumes their own stacks."
      />
      <StatRow
        label="Next Hit Invuln"
        value={clamped > 0 ? `${nextInvuln}s` : "—"}
        color={clamped > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip={`0.25s on a normal consume; 0.5s when consuming the final charge.`}
      />
    </div>
  );
}

function JadeJudgmentPassivePanel() {
  const judgment = computeJadeJudgmentPassive();
  const [judged, setJudged] = useState(1);
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeJadeJudgmentRemaining(elapsedSec, judgment);
  const active = judged > 0 && remaining > 0;
  const dmgMult = computeJadeJudgmentDamageMultiplier(active);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Judged"
        value={judged}
        min={0}
        max={1}
        onChange={setJudged}
        tooltip="Jade Judgments: +50% damage vulnerability for 10s. Also has two Aura mod slots."
      />
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={judgment.durationSec}
        onChange={setElapsedSec}
        tooltip="Judgment duration countdown (kills while Judged can extend ability durations separately)."
      />
      <StatRow
        label="Vulnerability"
        value={active ? `+${(judgment.damageVulnerability * 100).toFixed(0)}%` : "Inactive"}
        color={active ? "text-rose-400" : "text-muted-foreground"}
        tooltip={`Enemy takes ×${dmgMult.toFixed(1)} damage while Judged (${remaining.toFixed(0)}s left).`}
      />
      <StatRow
        label="Aura Slots"
        value={`${judgment.auraSlots}`}
        color="text-amber-400"
        tooltip="Jade uniquely has two Aura polarity slots."
      />
    </div>
  );
}

function TempleBackbeatPassivePanel({ abilityEfficiency }: { abilityEfficiency: number }) {
  const [onBeat, setOnBeat] = useState(1);
  const bonus = computeTempleBackbeatEfficiencyBonus(onBeat > 0);
  const effectiveEff = abilityEfficiency + bonus;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="On Backbeat"
        value={onBeat}
        min={0}
        max={1}
        onChange={setOnBeat}
        tooltip="Temple: casting while the metronome is in the Backbeat zone grants +50% Ability Efficiency and amplifies the ability."
      />
      <StatRow
        label="Backbeat EFF"
        value={bonus > 0 ? `+${(bonus * 100).toFixed(0)}%` : "Missed"}
        color={bonus > 0 ? "text-fuchsia-400" : "text-muted-foreground"}
        tooltip="Additive Ability Efficiency on timed casts (also fuels Exalted and per-ability bonuses)."
      />
      <StatRow
        label="Effective EFF"
        value={`${(effectiveEff * 100).toFixed(0)}%`}
        color="text-amber-400"
        tooltip="Current Ability Efficiency + Backbeat bonus when on beat."
      />
    </div>
  );
}

function OraxiaPredatorsLurkPassivePanel() {
  const lurk = computeOraxiaPredatorsLurkPassive();
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeOraxiaPredatorsLurkRemaining(elapsedSec, lurk);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={lurk.invisibilitySec}
        onChange={setElapsedSec}
        tooltip="Oraxia Predator's Lurk: wall latch grants 8s invisibility (refresh by re-latching). Does not break on attacks."
      />
      <StatRow
        label="Invisibility"
        value={remaining > 0 ? `${remaining.toFixed(0)}s left` : "Inactive"}
        color={remaining > 0 ? "text-violet-400" : "text-muted-foreground"}
        tooltip="Also applies to Oraxia's companion. Silken Thread wall latch triggers the same duration."
      />
    </div>
  );
}

function RhinoHardLandingPassivePanel() {
  const pulse = computeRhinoHardLandingPulse();
  const [distancePct, setDistancePct] = useState(0);
  const dmg = computeRhinoHardLandingDamageAtDistance(distancePct / 100, pulse);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Distance % of Radius"
        value={distancePct}
        min={0}
        max={100}
        onChange={setDistancePct}
        tooltip={`Rhino: hard landing shockwave deals ${pulse.damage} Impact in ${pulse.radius}m (${(pulse.maxFalloff * 100).toFixed(0)}% falloff at edge). Stacks with Heavy Impact.`}
      />
      <StatRow
        label="Pulse Damage"
        value={dmg.toFixed(0)}
        color="text-amber-400"
        tooltip="Not affected by Ability Strength. Knocks down enemies in range."
      />
      <StatRow
        label="Radius"
        value={`${pulse.radius}m`}
        color="text-muted-foreground"
        tooltip="Fixed 6m radial pulse on hard landing."
      />
    </div>
  );
}

function GaraPassiveBlindPanel() {
  const blind = computeGaraPassiveBlind();
  const [missedCasts, setMissedCasts] = useState(0);
  const chance = computeGaraPassiveBlindChance(missedCasts);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Missed Casts"
        value={missedCasts}
        min={0}
        max={5}
        onChange={setMissedCasts}
        tooltip="Gara: each ability cast has a chance to radial blind. Chance rises +20% after each miss until it procs, then resets."
      />
      <StatRow
        label="Blind Chance"
        value={`${(chance * 100).toFixed(0)}%`}
        color="text-cyan-400"
        tooltip={`Base ${(blind.baseChance * 100).toFixed(0)}% + ${(blind.chanceIncreasePerMiss * 100).toFixed(0)}% × misses (cap 100%).`}
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
        color="text-sky-400"
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
        color="text-sky-400"
        tooltip="Mag: pickups within 8m gravitate to her. Overridden by larger vacuum sources (e.g. Fetch / Vacuum)."
      />
    </div>
  );
}

function KoumeiFatePassivePanel() {
  const fate = computeKoumeiFatePassive();
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeKoumeiFateRemaining(elapsedSec, fate);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={fate.durationSec}
        onChange={setElapsedSec}
        tooltip="Koumei: every 60s, fate picks one equipped weapon to inflict random Status Effects for 60s."
      />
      <StatRow
        label="Fate Status"
        value={remaining > 0 ? `${remaining.toFixed(0)}s left` : "Waiting"}
        color={remaining > 0 ? "text-rose-400" : "text-muted-foreground"}
        tooltip={`Interval ${fate.intervalSec}s · Duration ${fate.durationSec}s. Can select unequipped weapon types.`}
      />
      <StatRow
        label="Cycle"
        value={`${fate.intervalSec}s / ${fate.durationSec}s`}
        color="text-muted-foreground"
        tooltip="Separate from The Five Fates dice rolls on ability casts."
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
        color="text-violet-300"
        tooltip="Banshee: all equipped weapons (incl. Gunblades and Sentinel weapons) are treated as silent so enemies cannot hear them."
      />
    </div>
  );
}

function AtlasKnockdownPassivePanel() {
  const [grounded, setGrounded] = useState(1);
  const kd = computeAtlasKnockdownPassive(grounded > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Grounded"
        value={grounded}
        min={0}
        max={1}
        onChange={setGrounded}
        tooltip="Atlas: immune to Knockdown while on the ground. Does not apply in the air or to pushback."
      />
      <StatRow
        label="Knockdown"
        value={kd.knockdownImmuneWhileGrounded ? "Immune" : "Vulnerable"}
        color={kd.knockdownImmuneWhileGrounded ? "text-amber-400" : "text-muted-foreground"}
        tooltip="Rubble armor from petrified enemies is a separate Atlas passive mechanic."
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
        color="text-violet-300"
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
        color="text-sky-400"
        tooltip={`Harrow: overshield capacity doubled (${harrow.baseOvershieldCap} → ${harrow.overshieldCap}).`}
      />
      <StatRow
        label="Mission Start"
        value={harrow.startAtMaxEnergy ? "Max Energy" : "Normal"}
        color="text-amber-400"
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
        color="text-yellow-300"
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
            ? "text-red-400"
            : crit.tier === "orange"
              ? "text-orange-400"
              : crit.tier === "yellow"
                ? "text-yellow-300"
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
        color="text-green-400"
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
        color="text-amber-400"
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
        color="text-violet-300"
        tooltip="Secondary emission / energy colors do not change the element."
      />
    </div>
  );
}

function TitaniaUpsurgePassivePanel() {
  const upsurge = computeTitaniaUpsurgePassive();
  const [elapsedSec, setElapsedSec] = useState(0);
  const remaining = computeTitaniaUpsurgeRemaining(elapsedSec, upsurge);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Parkour Dist."
        value={`+${(upsurge.parkourDistanceBonus * 100).toFixed(0)}%`}
        color="text-pink-300"
        tooltip="Titania: +25% Bullet Jump and Rolling distance."
      />
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={upsurge.durationSec}
        onChange={setElapsedSec}
        tooltip="Upsurge: casting an ability heals Titania and allies within 15m for 4 HP/s over 20s (refreshes)."
      />
      <StatRow
        label="Upsurge Heal"
        value={remaining > 0 ? `${upsurge.healPerSec}/s · ${remaining.toFixed(0)}s` : "Inactive"}
        color={remaining > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip={`${upsurge.healRadiusM}m radius · ${upsurge.durationSec}s duration.`}
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
        color="text-sky-400"
        tooltip="Hildryn: 3.5s invulnerability when Shields break from a full charge (longer than the default gate)."
      />
      <StatRow
        label="Energy Orb → Shield"
        value={`+${gate.energyOrbShieldRestore}`}
        color="text-amber-400"
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
        color={undying.undyingReady ? "text-green-400" : "text-muted-foreground"}
        tooltip={`${undying.invulnSec}s invulnerability · restore ${(undying.healFraction * 100).toFixed(0)}% Health. Cap ${undying.stackCap} stacks.`}
      />
      <StatRow
        label="After Proc"
        value={`${undying.stacksAfterUndying} stacks`}
        color="text-amber-400"
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
  const [castsSinceSwap, setCastsSinceSwap] = useState(0);
  const remaining = computeSiriusOrionEfficiencyCastsRemaining(castsSinceSwap, passive);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Casts Since Swap"
        value={castsSinceSwap}
        min={0}
        max={passive.casts}
        onChange={setCastsSinceSwap}
        tooltip="Sirius & Orion: swapping forms grants +45% Ability Efficiency for the next 2 casts."
      />
      <StatRow
        label="Efficiency Buff"
        value={remaining > 0 ? `+${(passive.efficiencyBonus * 100).toFixed(0)}% × ${remaining}` : "Expired"}
        color={remaining > 0 ? "text-sky-400" : "text-muted-foreground"}
        tooltip={`${passive.casts} casts after each form swap.`}
      />
      <StatRow
        label="Energy Steal"
        value={`<${passive.energyStealThreshold} Energy`}
        color="text-amber-400"
        tooltip="When either form is below 50 Energy, they steal energy from each other."
      />
    </div>
  );
}

function WispAirborneInvisPassivePanel() {
  const [airborne, setAirborne] = useState(1);
  const invis = computeWispAirborneInvisPassive(airborne > 0);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Airborne"
        value={airborne}
        min={0}
        max={1}
        onChange={setAirborne}
        tooltip="Wisp: invisible to enemies while in the air."
      />
      <StatRow
        label="Visibility"
        value={invis.invisibleWhileAirborne ? "Invisible" : "Visible"}
        color={invis.invisibleWhileAirborne ? "text-violet-300" : "text-muted-foreground"}
        tooltip="Landing ends the dimensional cloak until airborne again."
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
        color="text-violet-300"
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
        color="text-amber-400"
        tooltip={`${(ink.balloonChance * 100).toFixed(0)}% × ${kills} kills → ~${expected.expectedOrbs.toFixed(1)} orbs.`}
      />
    </div>
  );
}

function SevagothTombstonePassivePanel() {
  const tomb = computeSevagothTombstonePassive();
  const [souls, setSouls] = useState(0);
  const remaining = computeSevagothTombstoneSoulsRemaining(souls, tomb);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Souls Harvested"
        value={souls}
        min={0}
        max={tomb.soulsRequired}
        onChange={setSouls}
        tooltip="Sevagoth Tombstone: on fatal damage, control Shadow and harvest 5 enemy souls to revive (allies can also interact)."
      />
      <StatRow
        label="Souls Left"
        value={remaining > 0 ? `${remaining}` : "Revived"}
        color={remaining > 0 ? "text-violet-300" : "text-green-400"}
        tooltip={`Track range ${tomb.soulTrackRangeM}m. Consume (passive) costs 0 Energy and instantly kills non-bosses.`}
      />
      <StatRow
        label="Track Range"
        value={`${tomb.soulTrackRangeM}m`}
        color="text-muted-foreground"
        tooltip="Targeted enemy must be within 14m to count toward the soul counter."
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
        color="text-amber-400"
        tooltip="Inaros: fatal damage entombs him; sand form melee-siphons to revive (allies can also interact)."
      />
      <StatRow
        label="Finisher Heal"
        value={`+${(passive.finisherHealFraction * 100).toFixed(0)}% (${heal.toFixed(0)})`}
        color="text-green-400"
        tooltip={`Melee Finisher / Mercy kills restore 20% of max Health (~${heal.toFixed(0)} at current max HP).`}
      />
    </div>
  );
}

function NokkoVitalDecayPassivePanel() {
  const decay = computeNokkoVitalDecayPassive();
  const [elapsedSec, setElapsedSec] = useState(0);
  const [hasMushroom, setHasMushroom] = useState(1);
  const remaining = computeNokkoVitalDecayRemaining(elapsedSec, decay);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Active Mushroom"
        value={hasMushroom}
        min={0}
        max={1}
        onChange={setHasMushroom}
        tooltip="Nokko Vital Decay requires ≥1 Stinkbrain or Brightbonnet placed to trigger on fatal damage."
      />
      <SimSlider
        label="Elapsed (s)"
        value={elapsedSec}
        min={0}
        max={decay.timeLimitSec}
        onChange={setElapsedSec}
        tooltip="Sprodling form: reach a glowing mushroom within 15s to revive (3s anim + 1s invuln)."
      />
      <StatRow
        label="Vital Decay"
        value={
          hasMushroom <= 0
            ? "Bleedout"
            : remaining > 0
              ? `${remaining.toFixed(0)}s left`
              : "Expired"
        }
        color={hasMushroom > 0 && remaining > 0 ? "text-green-400" : "text-muted-foreground"}
        tooltip="Fungal Spores grant move speed but not healing. Does not work in Arbitrations."
      />
    </div>
  );
}

function WukongFiveTechniquesPassivePanel() {
  const five = computeWukongFiveTechniquesPassive();
  const [techIdx, setTechIdx] = useState(0);
  const tech =
    five.techniques[Math.min(Math.max(0, Math.floor(techIdx)), five.techniques.length - 1)]
    ?? five.techniques[0]!;

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <StatRow
        label="Per Mission"
        value={`${five.techniquesPerMission} of ${five.techniques.length}`}
        color="text-amber-400"
        tooltip={`On fatal damage: ${five.deathGateInvulnSec}s invuln + ${(five.deathGateHealFraction * 100).toFixed(0)}% Health, then a random remaining technique buff.`}
      />
      <SimSlider
        label="Technique (0–4)"
        value={techIdx}
        min={0}
        max={five.techniques.length - 1}
        onChange={setTechIdx}
        tooltip="Browse the five techniques. Three are chosen at random per mission."
      />
      <StatRow
        label={tech.name}
        value={`${tech.summary} · ${tech.durationSec}s`}
        color="text-violet-300"
        tooltip="Buffs cannot be dispelled by Nullifiers or ability disable."
      />
    </div>
  );
}

function VorunaWolvesPassivePanel() {
  const pack = computeVorunaWolvesPassive();
  const [wolfIdx, setWolfIdx] = useState(0);
  const [ulfrunElapsed, setUlfrunElapsed] = useState(0);
  const wolf =
    pack.wolves[Math.min(Math.max(0, Math.floor(wolfIdx)), pack.wolves.length - 1)]
    ?? pack.wolves[0]!;
  const ulfrunCd = computeVorunaUlfrunCooldownRemaining(ulfrunElapsed, pack);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Wolf (0 Dynar / 1 Raksh / 2 Lycath / 3 Ulfrun)"
        value={wolfIdx}
        min={0}
        max={pack.wolves.length - 1}
        onChange={setWolfIdx}
        tooltip="Voruna: hold ability 1–4 to invoke that wolf's passive. Helminth replacements disable the matching wolf."
      />
      <StatRow
        label={`${wolf.name} (Hold ${wolf.abilitySlot})`}
        value={wolf.summary}
        color="text-rose-300"
        tooltip={
          wolf.id === "lycath"
            ? `HAE hard-caps at ${(pack.heavyAttackEfficiencyCap * 100).toFixed(0)}%; +100% only helps with negative HAE Rivens.`
            : wolf.id === "ulfrun"
              ? `${wolf.invulnSec}s invuln + full Health/Shields; ${wolf.cooldownSec}s cooldown after sacrifice or swap-out.`
              : "Persists until swapped or revoked. Not disabled by Nullifiers."
        }
      />
      {wolf.id === "ulfrun" && (
        <>
          <SimSlider
            label="Ulfrun CD Elapsed (s)"
            value={ulfrunElapsed}
            min={0}
            max={wolf.cooldownSec ?? 60}
            onChange={setUlfrunElapsed}
            tooltip="Cooldown starts after Ulfrun sacrifices himself or when the passive is swapped out."
          />
          <StatRow
            label="Ulfrun Ready"
            value={ulfrunCd > 0 ? `${ulfrunCd.toFixed(0)}s CD` : "Ready"}
            color={ulfrunCd > 0 ? "text-muted-foreground" : "text-green-400"}
            tooltip="Death prevention only while Ulfrun's passive is active and off cooldown."
          />
        </>
      )}
    </div>
  );
}

function AugurCastShieldsPanel({
  convertPercent,
  abilityEfficiency,
}: {
  convertPercent: number;
  abilityEfficiency: number;
}) {
  const pieces = Math.round(convertPercent / 40);
  const [baseCost, setBaseCost] = useState(25);
  const spent = scaledAbilityEnergyCost(baseCost, abilityEfficiency);
  const shields = augurShieldsFromEnergySpent(spent, pieces);

  return (
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Base Cast Cost"
        value={baseCost}
        min={0}
        max={100}
        onChange={setBaseCost}
        tooltip="Augur converts Energy actually spent (after Ability Efficiency) into Shields. Cap 175% EFF / floor 25% cost."
      />
      <StatRow
        label="Energy Spent"
        value={spent.toFixed(1)}
        color="text-muted-foreground"
        tooltip={`At ${(abilityEfficiency * 100).toFixed(0)}% Ability Efficiency.`}
      />
      <StatRow
        label="Shields / Cast"
        value={`+${shields.toFixed(1)}`}
        color="text-sky-400"
        tooltip={`${pieces} Augur piece${pieces === 1 ? "" : "s"} × ${convertPercent}% of ${spent.toFixed(1)} Energy. Can create Overshields.`}
      />
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
        color="text-amber-400"
        tooltip="Mecha Set: companion marks a target on this interval (Kubrow/Predasite required)."
      />
      <StatRow
        label="Mark Duration"
        value={`${mark.markDurationSec}s`}
        color="text-sky-400"
        tooltip="How long the mark lasts. Killing the marked target spreads statuses to nearby enemies."
      />
      <StatRow
        label="Spread Range"
        value={`${mark.spreadRangeM}m`}
        color="text-violet-300"
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
  const [demonIdx, setDemonIdx] = useState(0);
  const [deadElapsed, setDeadElapsed] = useState(0);
  const demon =
    legion.demons[Math.min(Math.max(0, Math.floor(demonIdx)), legion.demons.length - 1)]
    ?? legion.demons[0]!;
  const resurrectLeft = computeUrielDemonResurrectRemaining(deadElapsed, legion);

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
    <div className="py-1 space-y-1 border-t border-border/60 mt-1">
      <SimSlider
        label="Demon (0 Catenach / 1 Gulphagor / 2 Vythelas)"
        value={demonIdx}
        min={0}
        max={legion.demons.length - 1}
        onChange={setDemonIdx}
        tooltip="Uriel's Legion: three Health-based intangible summons. Helminth keeps the demon but freezes its stats at defaults."
      />
      <StatRow
        label={`${demon.name} (${demon.unlockAbility})`}
        value={demon.summary}
        color="text-orange-400"
        tooltip={detail}
      />
      <StatRow
        label="Key Stats"
        value={detail}
        color="text-amber-400"
        tooltip="Base (unmodded) values from wiki; Ability Strength scales some fields when the unlock ability is equipped."
      />
      <SimSlider
        label="Dead Elapsed (s)"
        value={deadElapsed}
        min={0}
        max={legion.resurrectSec}
        onChange={setDeadElapsed}
        tooltip={`Demons auto-resurrect after ${legion.resurrectSec}s. Remedium heals/revives instantly. Teleport if >${legion.teleportRangeM}m from Uriel.`}
      />
      <StatRow
        label="Resurrect"
        value={resurrectLeft > 0 ? `${resurrectLeft.toFixed(0)}s` : "Alive"}
        color={resurrectLeft > 0 ? "text-muted-foreground" : "text-green-400"}
        tooltip="Brimstone gauge builds from chained/latched kills, rune pickups, and Demonium split-soul hits."
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
      <div className="text-[10px] font-medium text-violet-400/90">Adaptation (typed DR)</div>
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
        color="text-violet-300"
        tooltip="Resistance to the adapted damage type only"
      />
      <StatRow
        label="Combined DR"
        value={`${combinedDRPercent.toFixed(1)}%`}
        color="text-violet-400"
        tooltip="Armor DR and Adaptation stack multiplicatively vs that type"
      />
      <StatRow
        label="Adapted EHP"
        value={adaptedEHP.toFixed(0)}
        color="text-violet-400"
        tooltip="Effective health vs fully adapted single-type damage"
      />
      <p className="text-[9px] text-muted-foreground/80 leading-snug">
        Ramps when you take hits; each element tracks separately. Uses base EHP/DR above.
      </p>
    </div>
  );
}

export function WarframeStatsPanel({ stats, warframe, equippedMods, allMods, equippedShards, equippedArcanes, arcaneRanks }: {
  stats: WarframeCalculatedStats | null; warframe?: Warframe | null;
  equippedMods?: EquippedMod[]; allMods?: Map<string, Mod>;
  equippedShards?: (EquippedArchonShard | null)[];
  equippedArcanes?: (Mod | null)[];
  arcaneRanks?: number[];
}) {
  const shardLines = useMemo(
    () => buildShardBonusLines(equippedShards ?? []),
    [equippedShards],
  );

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
          {(warframe.id === "gauss" || warframe.id === "gauss_prime") && <GaussPassiveBattery />}
          {(warframe.id === "baruuk" || warframe.id === "baruuk_prime") && <BaruukRestraintPassive />}
          {(warframe.id === "valkyr" || warframe.id === "valkyr_prime") && <ValkyrRagePassive />}
          {(warframe.id === "ember" || warframe.id === "ember_prime") && <EmberHeatPassive />}
          {(warframe.id === "garuda" || warframe.id === "garuda_prime") && <GarudaDeathsGatePassive />}
          {(warframe.id === "frost" || warframe.id === "frost_prime") && (
            <FrostFortifyingFreezePassive moddedArmor={stats.totalArmor} />
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
          {warframe.id === "citrine" && <CitrineGeoluminesencePassivePanel />}
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
            color={stats.slideSpeedBonus > 0 ? "text-cyan-400" : "text-red-400"}
            tooltip="From Maglev / Cunning Drift / Streamlined Form, etc."
          />
        )}
        {stats.parkourVelocityBonus > 0 && (
          <StatRow label="Parkour Velocity" value={`+${(stats.parkourVelocityBonus * 100).toFixed(0)}%`} color="text-cyan-400" />
        )}
        {stats.healthRegenPerSec > 0 && (
          <StatRow label="Health Regen" value={`${stats.healthRegenPerSec.toFixed(1)}/s`} color="text-green-400" />
        )}
        {stats.elementalResistance > 0 && (
          <StatRow label="Elemental Resist" value={`${stats.elementalResistance.toFixed(0)}%`} color="text-cyan-400" />
        )}
        {stats.persistenceDamageCapPerSecond != null && (
          <p
            className={`text-[10px] leading-snug pt-0.5 ${stats.persistenceActive ? "text-amber-400/90" : "text-muted-foreground"}`}
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
          color={stats.abilityStrength > 1 ? "text-orange-400" : stats.abilityStrength < 1 ? "text-red-400" : undefined} />
        <StatRow label="Duration" value={`${(stats.abilityDuration * 100).toFixed(0)}%`}
          color={stats.abilityDuration > 1 ? "text-cyan-400" : stats.abilityDuration < 1 ? "text-red-400" : undefined} />
        <StatRow label="Efficiency" value={`${(stats.abilityEfficiency * 100).toFixed(0)}%`}
          color={stats.abilityEfficiency > 1 ? "text-blue-400" : stats.abilityEfficiency < 1 ? "text-red-400" : undefined} />
        <StatRow label="Range" value={`${(stats.abilityRange * 100).toFixed(0)}%`}
          color={stats.abilityRange > 1 ? "text-green-400" : stats.abilityRange < 1 ? "text-red-400" : undefined} />
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
                <span className={row.active ? "text-green-400 font-medium" : "text-muted-foreground"}>
                  {row.label}: {row.pieces}/{row.required}
                  {row.active ? " ✓" : ""}
                </span>
                <div className="text-[9px] text-muted-foreground/80 pl-0.5">{row.description}</div>
              </div>
            ))}
            {(stats.augurEnergyToShieldsPercent ?? 0) > 0 && (
              <>
                <StatRow
                  label="Augur (shields)"
                  value={`${stats.augurEnergyToShieldsPercent}% of energy → shields`}
                  color="text-sky-400"
                />
                <AugurCastShieldsPanel
                  convertPercent={stats.augurEnergyToShieldsPercent ?? 0}
                  abilityEfficiency={stats.abilityEfficiency}
                />
              </>
            )}
            {(stats.hunterCompanionVsStatusDamagePercent ?? 0) > 0 && (
              <StatRow
                label="Hunter (companion)"
                value={`+${stats.hunterCompanionVsStatusDamagePercent}% dmg vs Slash (${(1 + (stats.hunterCompanionVsStatusDamagePercent ?? 0) / 100).toFixed(2)}×)`}
                color="text-amber-400"
                tooltip="Applies to beast claws / sentinel weapons when the Hunter vs Slash DPS toggle is on (companion builder / loadout sim)."
              />
            )}
            {(stats.mechaSetPieces ?? 0) > 0 && (
              <>
                <StatRow
                  label="Mecha (mark)"
                  value={`${stats.mechaSetPieces}/4 pieces`}
                  color="text-orange-400"
                  tooltip="Companion mark + status spread on kill. Requires Kubrow or Predasite."
                />
                <MechaMarkTimingPanel pieces={stats.mechaSetPieces ?? 0} />
              </>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Shard Bonuses */}
      {shardLines.length > 0 && (
        <CollapsibleSection title="SHARD BONUSES" defaultOpen>
          {shardLines.map((line, i) => (
            <div key={i} className="py-0.5">
              <StatRow
                label={line.label}
                value={line.value}
                color={line.conditional ? "text-muted-foreground" : "text-purple-400"}
                tooltip={line.conditional ? `${line.shardName} — conditional` : line.shardName}
              />
            </div>
          ))}
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
                <StatRow
                  key={`a-${i}`}
                  label={line.label}
                  value={line.value}
                  color={line.active === false ? "text-muted-foreground" : "text-purple-400"}
                />
              ))}
              {info.conditional.map((line, i) => (
                <div key={`c-${i}-${line.label}`} className="py-0.5">
                  <StatRow
                    label={line.label}
                    value={line.value}
                    color={line.active ? "text-green-400" : "text-muted-foreground"}
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

