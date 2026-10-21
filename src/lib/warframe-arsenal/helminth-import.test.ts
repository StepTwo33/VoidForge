/**
 * Player Sync Helminth import, generic for every warframe: DE's `abilityOverride` is
 * `{ ability: <infused ability path>, index: <0-based slot it replaces> }` (0 = 1st … 3 = 4th;
 * OpenWF SpaceNinjaServer's web UI shows Index + 1 as "slot 1–4"). The infused ability must
 * REPLACE the native ability in that slot: exactly one copy of it, the other three native
 * abilities unchanged and in place, the replaced native ability gone.
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allHelminthAbilities } from "@/data/helminth";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { resolveHelminthOverride } from "@/lib/warframe-arsenal/lotus-resolve";
import { resolveAbilitiesWithHelminth } from "@/lib/weapons/weapon-external-buffs";

function importFrame(uniqueName: string, ability: string, index: number) {
  const p = {
    accountInfo: { playerName: "Tester", masteryRank: 30, lastUpdated: 1_760_806_000, glyph: "", focus: "" },
    loadOuts: {
      NORMAL: {
        warframe: { uniqueName, xp: 2_000_000, upgrades: [], abilityOverride: { ability, index } },
      },
    },
  };
  return mapArsenalToImportPayload(buildArsenalData(p as never), { loadOuts: p.loadOuts as never });
}

function expectReplaced(warframeId: string, helminthId: string, slot: number, abilityNames: string[]) {
  const wf = allWarframes.find((w) => w.id === warframeId)!;
  const native = wf.abilities.map((a) => a.name);
  const infused = allHelminthAbilities.find((h) => h.id === helminthId)!.name;
  expect(abilityNames).toHaveLength(native.length);
  expect(abilityNames[slot]).toBe(infused);
  expect(abilityNames.filter((n) => n === infused)).toHaveLength(1);
  expect(abilityNames).not.toContain(native[slot]);
  native.forEach((name, i) => {
    if (i !== slot) expect(abilityNames[i]).toBe(name);
  });
}

const CASES = [
  // [label, warframe uniqueName, VF warframe id, infused ability path, VF helminth id, raw index, expected names]
  {
    label: "Grendel + Roar over his 3rd (Pulverize), the user's in-game setup",
    uniqueName: "/Lotus/Powersuits/Devourer/Devourer",
    warframeId: "grendel",
    ability: "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility",
    helminthId: "subsume_rhino",
    index: 2,
    expected: ["Feast", "Nourish", "Roar", "Regurgitate"],
  },
  {
    label: "Wisp Prime + Nourish over her 4th (Sol Gate), WFCD arsenal-parser sample exampleData7",
    uniqueName: "/Lotus/Powersuits/Wisp/WispPrime",
    warframeId: "wisp_prime",
    ability: "/Lotus/Powersuits/Devourer/Abilities/DevourerConsumeAbility",
    helminthId: "subsume_grendel",
    index: 3,
    expected: null,
  },
  {
    label: "Saryn + Eclipse over her 1st (slot-1 edge)",
    uniqueName: "/Lotus/Powersuits/Saryn/Saryn",
    warframeId: "saryn",
    ability: "/Lotus/Powersuits/Harlequin/LightAbility",
    helminthId: "subsume_mirage",
    index: 0,
    expected: null,
  },
  {
    label: "Mesa + Null Star over her 2nd",
    uniqueName: "/Lotus/Powersuits/Cowgirl/Cowgirl",
    warframeId: "mesa",
    ability: "/Lotus/Powersuits/AntiMatter/NullStarAbility",
    helminthId: "subsume_nova",
    index: 1,
    expected: null,
  },
  {
    label: "Rhino + Empower (Helminth's own) over his 4th (slot-4 edge)",
    uniqueName: "/Lotus/Powersuits/Rhino/Rhino",
    warframeId: "rhino",
    ability: "/Lotus/Powersuits/PowersuitAbilities/HelminthStrengthAbility",
    helminthId: "helminth_empower",
    index: 3,
    expected: null,
  },
];

describe("Player Sync Helminth: infused ability replaces the reported slot (any warframe)", () => {
  for (const c of CASES) {
    it(c.label, () => {
      const { loadout, warnings } = importFrame(c.uniqueName, c.ability, c.index);
      const wb = loadout.warframeBuild!;
      expect(wb.warframeId).toBe(c.warframeId);
      expect(wb.helminthAbilityId).toBe(c.helminthId);
      expect(wb.helminthSlot).toBe(c.index);
      expect(warnings.filter((w) => w.kind === "helminth")).toEqual([]);
      const wf = allWarframes.find((w) => w.id === c.warframeId)!;
      const names = resolveAbilitiesWithHelminth(wf.abilities, wb.helminthAbilityId, wb.helminthSlot).map((a) => a.name);
      if (c.expected) expect(names).toEqual(c.expected);
      expectReplaced(c.warframeId, c.helminthId, c.index, names);
    });
  }

  it("out-of-range index is not guessed into a slot: no Helminth applied, import warning instead", () => {
    for (const index of [-1, 4, 1.5]) {
      const { loadout, warnings } = importFrame(
        "/Lotus/Powersuits/Devourer/Devourer",
        "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility",
        index,
      );
      expect(loadout.warframeBuild?.helminthAbilityId ?? null).toBeNull();
      expect(warnings.find((w) => w.kind === "helminth")?.label).toContain("out of range");
    }
  });

  it("every warframe × every slot: replacement is positional with no per-frame special cases", () => {
    const roar = resolveHelminthOverride({ ability: "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility", index: 0 })!;
    const failures: string[] = [];
    for (const wf of allWarframes) {
      if (wf.abilities.length < 4) {
        failures.push(`${wf.id}: only ${wf.abilities.length} abilities`);
        continue;
      }
      for (let slot = 0; slot < 4; slot++) {
        const names = resolveAbilitiesWithHelminth(wf.abilities, roar.helminthAbilityId, slot).map((a) => a.name);
        const native = wf.abilities.map((a) => a.name);
        const ok =
          names.length === native.length &&
          names[slot] === "Roar" &&
          names.every((n, i) => i === slot || n === native[i]) &&
          (native.includes("Roar") || names.filter((n) => n === "Roar").length === 1);
        if (!ok) failures.push(`${wf.id} slot ${slot + 1}: ${names.join(", ")}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
