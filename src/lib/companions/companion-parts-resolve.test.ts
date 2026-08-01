import { describe, expect, it } from "vitest";
import { resolveCompanionParts } from "@/lib/companions/companion-parts-resolve";
import { mapCompanionPartsFromArsenal } from "@/lib/warframe-arsenal/lotus-resolve";
import { findCompanionByLotusPath } from "@/lib/warframe-arsenal/lotus-resolve";

describe("companion parts resolve", () => {
  it("resolves gilded MOA Drex+Atheca stats from 350 bases", () => {
    const resolved = resolveCompanionParts({
      kind: "moa",
      model: "moa_model_para",
      core: "moa_core_drex",
      gyro: "moa_gyro_atheca",
      bracket: "moa_bracket_drimper",
      isGilded: true,
    });
    expect(resolved?.companionId).toBe("para");
    // Drex gilded +10/+15/+5; Atheca gilded +20/-5/-5
    // health: 350 * 1.10 * 1.20 = 462
    // shield: 350 * 1.15 * 0.95 = 382.375 → 382
    // armor: 350 * 1.05 * 0.95 = 349.125 → 349
    expect(resolved?.health).toBe(462);
    expect(resolved?.shield).toBe(382);
    expect(resolved?.armor).toBe(349);
  });

  it("resolves gilded Hound Adlet+Cela (wiki table)", () => {
    const resolved = resolveCompanionParts({
      kind: "hound",
      model: "hound_model_bhaira",
      core: "hound_core_adlet",
      bracket: "hound_bracket_cela",
      stabilizer: "hound_stabilizer_frak",
      isGilded: true,
    });
    expect(resolved?.companionId).toBe("bhaira_hound");
    expect(resolved?.weaponId).toBe("lacerten");
    // Cela gilded +20% HP, +30% shield, -10% armor on Adlet 350/450/350
    expect(resolved?.health).toBe(420);
    expect(resolved?.shield).toBe(585);
    expect(resolved?.armor).toBe(315);
  });
});

describe("companion parts arsenal map", () => {
  it("maps MOA modularParts paths to Voidforge part ids", () => {
    const mapped = mapCompanionPartsFromArsenal({
      HEAD: "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadLambeo",
      CORE: "Drex",
      GYRO: "Trux",
      BRACKET: "Tian",
    });
    expect(mapped).toEqual({
      kind: "moa",
      model: "moa_model_lambeo",
      core: "moa_core_drex",
      gyro: "moa_gyro_trux",
      bracket: "moa_bracket_tian",
      isGilded: true,
    });
  });

  it("resolves custom-named MOA via lotus path hint", () => {
    const companion = findCompanionByLotusPath(
      "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadPara",
      "Robco Meta-Boy",
    );
    expect(companion?.id).toBe("para");
  });
});
