import { describe, expect, it } from "vitest";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import type { Loadout } from "@/lib/types";

describe("Loadout Warframe Arcanes cross-slot weapon buffs", () => {
  const baseLoadout: Loadout = {
    id: "test-loadout",
    name: "Arcane Test Loadout",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    warframeBuild: {
      warframeId: "excalibur",
      mods: [],
      arcaneIds: ["arcane_rage", "arcane_acceleration"],
      arcaneRanks: [5, 5],
    },
    primaryBuild: {
      weaponId: "ax_52",
      mods: [],
    },
    secondaryBuild: {
      weaponId: "lex",
      mods: [],
    },
    meleeBuild: {
      weaponId: "skana",
      mods: [],
    },
  };

  it("applies Arcane Rage (+180% Primary Damage) and Arcane Acceleration (+90% Primary FR) to AX-52 in midFight scenario", () => {
    // Stock AX-52 stats with no arcanes on frame
    const bareLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const bareStats = calcLoadoutStats(bareLoadout, { scenario: "midFight" });
    const buffedStats = calcLoadoutStats(baseLoadout, { scenario: "midFight" });

    expect(bareStats.primary).toBeDefined();
    expect(buffedStats.primary).toBeDefined();

    const barePrimary = bareStats.primary!.stats;
    const buffedPrimary = buffedStats.primary!.stats;

    // Arcane Rage R5: +180% base damage
    expect(buffedPrimary.totalDamage).toBeCloseTo(barePrimary.totalDamage * (1 + 1.8), 2);

    // Arcane Acceleration R5: +90% fire rate
    expect(buffedPrimary.fireRate).toBeCloseTo(barePrimary.fireRate * 1.9, 2);

    // Secondary (Lex) and Melee (Skana) should NOT receive Arcane Rage or Arcane Acceleration
    const bareSecondary = bareStats.secondary!.stats;
    const buffedSecondary = buffedStats.secondary!.stats;
    expect(buffedSecondary.totalDamage).toBeCloseTo(bareSecondary.totalDamage, 2);
    expect(buffedSecondary.fireRate).toBeCloseTo(bareSecondary.fireRate, 2);

    const bareMelee = bareStats.melee!.stats;
    const buffedMelee = buffedStats.melee!.stats;
    expect(buffedMelee.totalDamage).toBeCloseTo(bareMelee.totalDamage, 2);
    expect(buffedMelee.fireRate).toBeCloseTo(bareMelee.fireRate, 2);
  });

  it("respects arcane toggle overrides (deactivating Arcane Rage and Acceleration returns AX-52 to bare stats)", () => {
    const bareLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const bareStats = calcLoadoutStats(bareLoadout, { scenario: "midFight" });

    // With arcanes equipped, but explicitly toggled OFF (overrides = 0)
    const toggledOffStats = calcLoadoutStats(baseLoadout, {
      scenario: "midFight",
      simParams: {
        arcaneStacksById: {
          arcane_rage: 0,
          arcane_acceleration: 0,
        },
      },
    });

    const barePrimary = bareStats.primary!.stats;
    const offPrimary = toggledOffStats.primary!.stats;

    expect(offPrimary.totalDamage).toBeCloseTo(barePrimary.totalDamage, 2);
    expect(offPrimary.fireRate).toBeCloseTo(barePrimary.fireRate, 2);
  });

  it("defaults to inactive in paper scenario, but activates when user toggles it ON in paper", () => {
    const paperStats = calcLoadoutStats(baseLoadout, { scenario: "paper" });
    const bareLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const barePaper = calcLoadoutStats(bareLoadout, { scenario: "paper" });

    // In paper scenario with no overrides, Arcane Rage and Acceleration should be inactive (defaultStacks = 0)
    expect(paperStats.primary!.stats.totalDamage).toBeCloseTo(barePaper.primary!.stats.totalDamage, 2);
    expect(paperStats.primary!.stats.fireRate).toBeCloseTo(barePaper.primary!.stats.fireRate, 2);

    // When explicitly toggled ON in paper scenario
    const paperToggledOn = calcLoadoutStats(baseLoadout, {
      scenario: "paper",
      simParams: {
        arcaneStacksById: {
          arcane_rage: 1,
        },
      },
    });

    expect(paperToggledOn.primary!.stats.totalDamage).toBeCloseTo(
      barePaper.primary!.stats.totalDamage * (1 + 1.8),
      2,
    );
  });

  it("does not apply Arcane Acceleration to shotguns (e.g. Hek)", () => {
    const shotgunLoadout: Loadout = {
      ...baseLoadout,
      primaryBuild: {
        weaponId: "hek",
        mods: [],
      },
    };
    const stats = calcLoadoutStats(shotgunLoadout, { scenario: "midFight" });
    const bareShotgunLoadout: Loadout = {
      ...shotgunLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const bareStats = calcLoadoutStats(bareShotgunLoadout, { scenario: "midFight" });

    // Arcane Acceleration excludes shotguns: fire rate should be unchanged on Hek
    expect(stats.primary!.stats.fireRate).toBeCloseTo(bareStats.primary!.stats.fireRate, 2);
    // Arcane Rage applies to primary shotguns as well (+180% damage)
    expect(stats.primary!.stats.totalDamage).toBeCloseTo(
      bareStats.primary!.stats.totalDamage * (1 + 1.8),
      2,
    );
  });

  it("applies Arcane Velocity (+120% FR) and Arcane Precision (+300% Dmg) to secondary weapons", () => {
    const secLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: ["arcane_velocity", "arcane_precision"],
        arcaneRanks: [5, 5],
      },
    };
    const bareLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const stats = calcLoadoutStats(secLoadout, { scenario: "midFight" });
    const bareStats = calcLoadoutStats(bareLoadout, { scenario: "midFight" });

    // Lex (secondary) gets +120% fire rate and +300% damage
    const lexStats = stats.secondary!.stats;
    const bareLex = bareStats.secondary!.stats;
    expect(lexStats.fireRate).toBeCloseTo(bareLex.fireRate * 2.2, 2);
    expect(lexStats.totalDamage).toBeCloseTo(bareLex.totalDamage * (1 + 3.0), 2);

    // Primary AX-52 does not receive secondary arcanes
    expect(stats.primary!.stats.totalDamage).toBeCloseTo(bareStats.primary!.stats.totalDamage, 2);
  });

  it("applies Arcane Avenger (+45% flat CC) to all weapons in loadout", () => {
    const avengerLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: ["arcane_avenger", null],
        arcaneRanks: [5, 0],
      },
    };
    const bareLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [],
        arcaneIds: [null, null],
      },
    };
    const stats = calcLoadoutStats(avengerLoadout, { scenario: "midFight" });
    const bareStats = calcLoadoutStats(bareLoadout, { scenario: "midFight" });

    // +45% flat crit chance on primary, secondary, and melee
    expect(stats.primary!.stats.criticalChance).toBeCloseTo(
      bareStats.primary!.stats.criticalChance + 0.45,
      3,
    );
    expect(stats.secondary!.stats.criticalChance).toBeCloseTo(
      bareStats.secondary!.stats.criticalChance + 0.45,
      3,
    );
    expect(stats.melee!.stats.criticalChance).toBeCloseTo(
      bareStats.melee!.stats.criticalChance + 0.45,
      3,
    );
  });
});
