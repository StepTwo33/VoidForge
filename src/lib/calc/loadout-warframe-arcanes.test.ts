import { describe, expect, it } from "vitest";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { allWarframes } from "@/data/warframes";
import { ENEMY_TYPES } from "@/data/enemies";
import { weaponDamageBuffAbilities } from "@/lib/weapons/weapon-external-buffs";
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

  it("applies Arcane Rage and Acceleration only when those arcanes are explicitly active", () => {
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
    const untouched = calcLoadoutStats(baseLoadout, { scenario: "midFight" });
    expect(untouched.primary!.stats.totalDamage).toBeCloseTo(bareStats.primary!.stats.totalDamage, 2);
    const buffedStats = calcLoadoutStats(baseLoadout, {
      scenario: "midFight",
      simParams: { arcaneStacksById: { arcane_rage: 1, arcane_acceleration: 1 } },
    });

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
    const stats = calcLoadoutStats(shotgunLoadout, {
      scenario: "midFight",
      simParams: { arcaneStacksById: { arcane_rage: 1, arcane_acceleration: 1 } },
    });
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
    const stats = calcLoadoutStats(secLoadout, {
      scenario: "midFight",
      simParams: { arcaneStacksById: { arcane_velocity: 1, arcane_precision: 1 } },
    });
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
    const stats = calcLoadoutStats(avengerLoadout, {
      scenario: "midFight",
      simParams: { arcaneStacksById: { arcane_avenger: 1 } },
    });
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

  it("includes Covenant in Harrow ability options and applies flat CC (+50% body, +200% headshot)", () => {
    const harrowLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "harrow_prime",
        mods: [],
      },
      primaryBuild: {
        weaponId: "ax_52",
        mods: [],
      },
    };

    const unbuffed = calcLoadoutStats(harrowLoadout, { scenario: "paper" });
    const unbuffedCc = unbuffed.primary!.stats.criticalChance; // 0.31

    // Covenant active without headshots: +50% flat CC (0.50)
    const covenantBody = calcLoadoutStats(harrowLoadout, {
      scenario: "paper",
      simParams: {
        activeWeaponAbilityBuffs: ["Covenant"],
        applyHeadshots: false,
      },
    });
    expect(covenantBody.primary!.stats.criticalChance).toBeCloseTo(unbuffedCc + 0.5, 3);

    // Covenant active with headshots: +200% flat CC (2.00)
    const covenantHeadshot = calcLoadoutStats(harrowLoadout, {
      scenario: "paper",
      simParams: {
        activeWeaponAbilityBuffs: ["Covenant"],
        applyHeadshots: true,
      },
    });
    expect(covenantHeadshot.primary!.stats.criticalChance).toBeCloseTo(unbuffedCc + 2.0, 3);

    // Both Penance and Covenant active together
    const bothBuffs = calcLoadoutStats(harrowLoadout, {
      scenario: "paper",
      simParams: {
        activeWeaponAbilityBuffs: ["Penance", "Covenant"],
        applyHeadshots: false,
      },
    });
    expect(bothBuffs.primary!.stats.criticalChance).toBeCloseTo(unbuffedCc + 0.5, 3);
    expect(bothBuffs.primary!.stats.fireRate).toBeGreaterThan(unbuffed.primary!.stats.fireRate);
  });

  it("surfaces Sevagoth Reap in loadout abilities and applies damage vulnerability to weapon DPS", () => {
    const wf = allWarframes.find((w) => w.id === "sevagoth")!;
    const buffAbilities = weaponDamageBuffAbilities(wf.abilities);
    expect(buffAbilities.some((a) => a.name === "Reap")).toBe(true);

    const sevagothLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "sevagoth",
        mods: [],
      },
      primaryBuild: {
        weaponId: "ax_52",
        mods: [],
      },
    };

    const unbuffed = calcLoadoutStats(sevagothLoadout, { scenario: "paper" });
    const withReap = calcLoadoutStats(sevagothLoadout, {
      scenario: "paper",
      simParams: {
        activeWeaponAbilityBuffs: ["Reap"],
      },
    });

    // Base Reap gives +50% damage vulnerability (1.5x damage mult)
    expect(withReap.primary!.stats.totalDamage).toBeCloseTo(unbuffed.primary!.stats.totalDamage * 1.5, 4);
    expect(withReap.primary!.stats.burstDps).toBeCloseTo(unbuffed.primary!.stats.burstDps * 1.5, 4);
  });

  it("surfaces Nekros Terrify and Styanax Tharros Strike in loadout abilities and strips armor in TTK", () => {
    const nekros = allWarframes.find((w) => w.id === "nekros" || w.id === "nekros_prime")!;
    expect(weaponDamageBuffAbilities(nekros.abilities).some((a) => a.name === "Terrify")).toBe(true);

    const styanax = allWarframes.find((w) => w.id === "styanax")!;
    expect(weaponDamageBuffAbilities(styanax.abilities).some((a) => a.name === "Tharros Strike")).toBe(true);

    const gunner = ENEMY_TYPES.find((e) => e.name.toLowerCase().includes("gunner")) ?? ENEMY_TYPES[0];

    const nekrosLoadout: Loadout = {
      ...baseLoadout,
      warframeBuild: {
        warframeId: "nekros_prime",
        mods: [],
      },
      primaryBuild: {
        weaponId: "ax_52",
        mods: [],
      },
    };

    const unbuffedTtk = calcLoadoutStats(nekrosLoadout, {
      scenario: "vsEnemy",
      enemy: gunner,
      enemyLevel: 40,
    });

    const strippedTtk = calcLoadoutStats(nekrosLoadout, {
      scenario: "vsEnemy",
      enemy: gunner,
      enemyLevel: 40,
      simParams: {
        activeWeaponAbilityBuffs: ["Terrify"],
      },
    });

    // Terrify base 60% armor strip significantly reduces armor DR and TTK
    expect(strippedTtk.primary!.ttk!.scaledArmor).toBeLessThan(unbuffedTtk.primary!.ttk!.scaledArmor);
    expect(strippedTtk.primary!.ttk!.ttk).toBeLessThan(unbuffedTtk.primary!.ttk!.ttk);
  });
});
