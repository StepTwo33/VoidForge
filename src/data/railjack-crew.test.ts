import { describe, expect, it } from "vitest";
import {
  computeCrewPaperBonuses,
  migrateEliteCrewIdToSlots,
  normalizeCrewSlots,
  PILOTING_SPEED_BONUS,
  type RailjackCrewSlot,
} from "@/data/railjack-crew";
import { calculateRailjackBuild } from "@/lib/calc/railjack-calculator";

describe("railjack crew paper bonuses", () => {
  it("applies wiki piloting speed table only for Pilot role", () => {
    const pilot: RailjackCrewSlot = {
      role: "pilot",
      source: "ticker",
      profileId: "the_perrin_sequence",
      competency: { piloting: 5, gunnery: 0, repair: 0, combat: 0, endurance: 0 },
    };
    const gunner: RailjackCrewSlot = {
      role: "gunner",
      source: "ticker",
      profileId: "steel_meridian",
      competency: { piloting: 5, gunnery: 5, repair: 0, combat: 0, endurance: 0 },
    };
    expect(computeCrewPaperBonuses([pilot, null, null]).speedBonus).toBe(PILOTING_SPEED_BONUS[5]);
    expect(computeCrewPaperBonuses([gunner, null, null]).speedBonus).toBe(0);
  });

  it("elite gunnery trait buffs house turrets only", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "gunner",
        source: "elite",
        profileId: "vena",
        competency: { piloting: 0, gunnery: 5, repair: 0, combat: 2, endurance: 5 },
        eliteTraitId: "elite_gunnery_turret_damage",
      },
      null,
      null,
    ];
    const withHouse = calculateRailjackBuild({
      turretIds: ["zetki_apoc", "sigma_apoc", undefined],
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const bare = calculateRailjackBuild({
      turretIds: ["zetki_apoc", "sigma_apoc", undefined],
      intrinsics: { command: 10 },
    });
    expect(withHouse.turrets[0]!.damage).toBe(Math.round(bare.turrets[0]!.damage * 1.5));
    expect(withHouse.turrets[1]!.damage).toBe(bare.turrets[1]!.damage);
  });

  it("elite piloting trait buffs house engine speed", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "pilot",
        source: "ticker",
        profileId: "credits_hire",
        competency: { piloting: 0, gunnery: 0, repair: 0, combat: 0, endurance: 0 },
        eliteTraitId: "elite_piloting_engine_speed",
      },
      null,
      null,
    ];
    const house = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const sigma = calculateRailjackBuild({
      engineId: "sigma_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const bareHouse = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      intrinsics: { command: 10 },
    });
    expect(house.speed).toBe(Math.round(150 * 1.25 + 45));
    expect(sigma.speed).toBe(150 + 30);
    expect(bareHouse.speed).toBe(150 + 45);
  });

  it("migrates legacy eliteCrewId into slot A", () => {
    const slots = migrateEliteCrewIdToSlots("vena");
    expect(slots[0]?.source).toBe("elite");
    expect(slots[0]?.profileId).toBe("vena");
    expect(normalizeCrewSlots(undefined, "ryoku")[0]?.profileId).toBe("ryoku");
  });

  it("does not invent hull/turret bonuses from raw competency", () => {
    const bonuses = computeCrewPaperBonuses([
      {
        role: "defender",
        source: "elite",
        profileId: "vena",
        competency: { piloting: 0, gunnery: 5, repair: 0, combat: 5, endurance: 5 },
      },
      null,
      null,
    ]);
    expect(bonuses.speedBonus).toBe(0);
    expect(bonuses.houseTurretDamageBonus).toBe(0);
    expect(bonuses.panelNotes.some((n) => n.startsWith("Defender:"))).toBe(true);
  });
});
