/**
 * Player Sync importer: raw DE `upgrades` arrays are positional ("" = empty slot).
 * Fixtures mirror the user's Kuva Sobek / Grendel / Smeeta screenshots (2026-10-18).
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { resolveAbilitiesWithHelminth } from "@/lib/weapons/weapon-external-buffs";
import {
  mapArsenalToImportPayload,
  mapPositionalWeaponMods,
  rawUpgradeSlots,
  WARFRAME_IMPORT_AURA_SLOT,
  WARFRAME_IMPORT_EXILUS_SLOT,
  type ArsenalImportWarning,
} from "@/lib/warframe-arsenal/map-import";

const U = (uniqueName: string, rank?: number) => (rank == null ? { uniqueName } : { uniqueName, rank });
const EMPTY = { uniqueName: "" };

const SOBEK_UPGRADES = [
  U("/Lotus/Upgrades/CosmeticEnhancers/Offensive/DamageForBonusArmour", 5), // arcane: Primary Bulwark
  U("/Lotus/Upgrades/Mods/Shotgun/WeaponProjectileSpeedSPMod", 10), // exilus: Galvanized Acceleration
  U("/Lotus/Upgrades/Mods/Shotgun/Expert/WeaponShotgunFactionDamageInfestedExpert", 10),
  U("/Lotus/Upgrades/Mods/Shotgun/WeaponStatusChanceSPMod", 10),
  U("/Lotus/Upgrades/Mods/Shotgun/WeaponFireIterationsSPMod", 10),
  U("/Lotus/Upgrades/Mods/Shotgun/Event/ProjectNightwatch/SobekNightwatchMod", 5),
  U("/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterTrackMod", 5),
  U("/Lotus/Upgrades/Mods/Shotgun/WeaponProcTimeMod", 5),
  U("/Lotus/Upgrades/Mods/Shotgun/ShotgunStatusDamageDuoMod", 5),
  U("/Lotus/Upgrades/Mods/Shotgun/WeaponToxinDamageMod", 5),
];

function payload(extra: Record<string, unknown> = {}, abilityIndex = 2) {
  return {
    accountInfo: { playerName: "GLaDDoS", masteryRank: 36, lastUpdated: 1_760_806_000, glyph: "", focus: "" },
    loadOuts: {
      NORMAL: {
        warframe: {
          uniqueName: "/Lotus/Powersuits/Devourer/Devourer",
          xp: 2_000_000,
          upgrades: [
            EMPTY, // arcane 1
            EMPTY, // arcane 2
            U("/Lotus/Upgrades/Mods/OrokinChallenge/OrokinChallengeModPower", 5), // exilus: Power Drift
            U("/Lotus/Upgrades/Mods/Aura/PlayerMeleeAuraMod", 5), // aura: Steel Charge
            U("/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert", 10), // slot 1: Primed Flow
            EMPTY,
            U("/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA", 10), // slot 3: Umbral Vitality
            EMPTY,
            EMPTY,
            EMPTY,
            EMPTY,
            U("/Lotus/Powersuits/Devourer/DevourerRegurgitateAugmentCard", 3), // slot 8: Gastro
          ],
          abilityOverride: { ability: "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility", index: abilityIndex },
        },
        primary: { uniqueName: "/Lotus/Weapons/Grineer/KuvaLich/LongGuns/Sobek/KuvaSobek", xp: 1_000_000, upgrades: SOBEK_UPGRADES },
      },
      ...extra,
    },
  };
}

function importOf(p: ReturnType<typeof payload>) {
  return mapArsenalToImportPayload(buildArsenalData(p as never), { loadOuts: p.loadOuts as never });
}

describe("Player Sync positional slot import", () => {
  it("Kuva Sobek: 8 regular mods in in-game order, Galvanized Acceleration in the Exilus slot (8)", () => {
    const { loadout } = importOf(payload());
    const bySlot = Object.fromEntries((loadout.primaryBuild?.mods ?? []).map((m) => [m.slotIndex, m.modId]));
    expect(bySlot).toEqual({
      0: "primed_cleanse_infested",
      1: "galvanized_savvy",
      2: "galvanized_hell",
      3: "acid_shells",
      4: "hunter_track",
      5: "lingering_torment",
      6: "shotgun_elementalist",
      7: "contagious_spread_r3",
      8: "galvanized_acceleration",
    });
  });

  it("warframe: aura → 0, exilus → 9, regular slots keep their position (empties preserved)", () => {
    const { loadout } = importOf(payload());
    const bySlot = Object.fromEntries((loadout.warframeBuild?.mods ?? []).map((m) => [m.slotIndex, m.modId]));
    expect(bySlot[WARFRAME_IMPORT_AURA_SLOT]).toBe("aura_steel_charge");
    expect(bySlot[WARFRAME_IMPORT_EXILUS_SLOT]).toBe("power_drift");
    expect(bySlot[1]).toBe("primed_flow");
    expect(bySlot[2]).toBeUndefined();
    expect(bySlot[3]).toBe("umbra_vitality");
    expect(bySlot[8]).toMatch(/gastro/);
  });

  it("helminth: Roar infused over Grendel's 3rd ability (raw index 2, 0-based) replaces Pulverize", () => {
    const wb = importOf(payload({}, 2)).loadout.warframeBuild!;
    expect(wb.helminthAbilityId).toBe("subsume_rhino");
    expect(wb.helminthSlot).toBe(2);
    const names = resolveAbilitiesWithHelminth(
      allWarframes.find((w) => w.id === "grendel")!.abilities,
      wb.helminthAbilityId,
      wb.helminthSlot,
    ).map((a) => a.name);
    expect(names).toEqual(["Feast", "Nourish", "Roar", "Regurgitate"]);
  });

  it("beast claws: posture → slot 8, all 8 regular claw mods kept", () => {
    const p = payload({
      SENTINEL: {
        companion: { uniqueName: "/Lotus/Types/Game/CatbrowPet/CheshireCatbrowPetPowerSuit", type: "beast", upgrades: [] },
        exalted2: {
          uniqueName: "/Lotus/Types/Friendly/Pets/CatbrowPetWeapons/CatbrowClaws",
          upgrades: [
            U("/Lotus/Types/Friendly/Pets/BeastWeapons/Stances/BeastPacifistStance", 3), // Elusive Posture
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/KubrowCritMod", 10),
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/KubrowMeleeDamageMod", 10),
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/BeastWeapon/KubrowElectricConversionMod", 10),
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/BeastWeapon/BeastPrecisionConditioningMod", 10),
            EMPTY,
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/BeastWeapon/BeastMagneticImpactMod", 3),
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/BeastWeapon/BeastKnockdownWeaponMod", 3),
            U("/Lotus/Upgrades/Mods/Sentinel/Kubrow/KubrowMeleeDamageMod", 10),
          ],
        },
      },
    });
    const cb = importOf(p).loadout.companionBuild!;
    const bySlot = Object.fromEntries(cb.weaponMods.map((m) => [m.slotIndex, m.modId]));
    expect(bySlot[8]).toBe("elusive_posture");
    expect(bySlot[0]).toBe("bite");
    expect(bySlot[4]).toBeUndefined();
    expect(bySlot[6]).toBe("bell_ringer");
    expect(cb.weaponMods).toHaveLength(8);
  });
});

describe("mapPositionalWeaponMods", () => {
  it("melee [arcane, exilus, stance, r1..r8]: stance split out, exilus → 8", () => {
    const warnings: ArsenalImportWarning[] = [];
    const slots = rawUpgradeSlots([
      EMPTY,
      EMPTY,
      U("/Lotus/Weapons/Tenno/Melee/MeleeTrees/PolearmCmbOneMeleeTree", 3),
      U("/Lotus/Upgrades/Mods/Melee/WeaponCritDamageMod", 5),
      ...Array.from({ length: 7 }, () => EMPTY),
    ])!;
    const { mods, stanceModId } = mapPositionalWeaponMods(slots, warnings, { prefixSlotIndex: 8 });
    expect(stanceModId).toBeTruthy();
    expect(mods.map((m) => m.slotIndex)).toEqual([0]);
  });

  it("legacy 8-entry list (no exilus) maps 1:1 and keeps gaps", () => {
    const slots = rawUpgradeSlots([
      U("/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod", 8),
      EMPTY,
      EMPTY,
      EMPTY,
      U("/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsMod", 5),
      U("/Lotus/Upgrades/Mods/Rifle/WeaponCritChanceMod", 5),
      EMPTY,
      EMPTY,
    ])!;
    const { mods } = mapPositionalWeaponMods(slots, [], { prefixSlotIndex: 8 });
    expect(mods.map((m) => [m.slotIndex, m.modId])).toEqual([
      [0, "serration_r3"],
      [4, "split_chamber_r3"],
      [5, "point_strike_r3"],
    ]);
  });

  it("an exilus mod with no exilus slot (archgun) falls into the first free slot", () => {
    const slots = rawUpgradeSlots([
      U("/Lotus/Upgrades/Mods/Shotgun/WeaponProjectileSpeedSPMod", 10),
      ...Array.from({ length: 8 }, () => EMPTY),
    ])!;
    const { mods } = mapPositionalWeaponMods(slots, [], { prefixSlotIndex: null });
    expect(mods).toEqual([{ modId: "galvanized_acceleration", rank: 10, slotIndex: 0 }]);
  });
});
