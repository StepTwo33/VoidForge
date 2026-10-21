/**
 * End-to-end Player Sync import of a full real Twitch-arsenal payload (WFCD arsenal-parser
 * exampleData7, MIT). Asserts slot order, Helminth replacement, catalyst/reactor and the
 * companion posture slot, with no unmapped-item warnings.
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { resolveAbilitiesWithHelminth } from "@/lib/weapons/weapon-external-buffs";
import raw from "./__fixtures__/wfcd-example7-wisp-prime.json";

const { loadout, warnings } = mapArsenalToImportPayload(buildArsenalData(raw as never), { loadOuts: raw.loadOuts as never });
const bySlot = (mods: { slotIndex: number; modId: string; rank: number }[] = []) =>
  Object.fromEntries(mods.map((m) => [m.slotIndex, `${m.modId}@${m.rank}`]));

describe("Player Sync e2e: WFCD exampleData7 (Wisp Prime)", () => {
  it("imports with no warnings", () => {
    expect(warnings).toEqual([]);
  });

  it("warframe: aura 0, regular 1–8 in game order, exilus 9, arcanes, reactor", () => {
    const wb = loadout.warframeBuild!;
    expect(wb.warframeId).toBe("wisp_prime");
    expect(bySlot(wb.mods)).toEqual({
      0: "growing_power@5",
      1: "blind_rage@10",
      2: "rolling_guard@10",
      3: "primed_continuity@10",
      4: "augur_reach@5",
      5: "constitution@3",
      6: "archon_stretch@10",
      7: "transient_fortitude@10",
      8: "umbra_intensify@10",
      9: "augment_wisp_fused_reservoir@3",
    });
    expect(wb.arcaneIds).toEqual(["molt_augmented", "arcane_energize"]);
    expect(wb.hasOrokinReactor).toBe(true);
  });

  it("Helminth: Nourish (raw index 3) replaces Sol Gate, the 4th ability", () => {
    const wb = loadout.warframeBuild!;
    expect(wb.helminthAbilityId).toBe("subsume_grendel");
    expect(wb.helminthSlot).toBe(3);
    const wf = allWarframes.find((w) => w.id === "wisp_prime")!;
    const names = resolveAbilitiesWithHelminth(wf.abilities, wb.helminthAbilityId, wb.helminthSlot).map((a) => a.name);
    expect(names.slice(0, 4)).toEqual(["Reservoirs", "Wil-O-Wisp", "Breach Surge", "Nourish"]);
  });

  it("weapons: exilus in slot 8, stance split out, catalysts", () => {
    expect(loadout.secondaryBuild?.weaponId).toBe("kompressa_prime");
    expect(bySlot(loadout.secondaryBuild?.mods)[8]).toBe("lethal_momentum@3");
    expect(bySlot(loadout.secondaryBuild?.mods)[0]).toMatch(/^amalgam_barrel_diffusion@/);
    expect(loadout.meleeBuild?.weaponId).toBe("praedos");
    expect(loadout.meleeBuild?.stanceModId).toBe("sovereign_outcast");
    expect(loadout.primaryBuild?.weaponId).toBe("kuva_ayanga");
    for (const b of [loadout.primaryBuild, loadout.secondaryBuild, loadout.meleeBuild]) {
      expect(b?.hasOrokinCatalyst).toBe(true);
    }
  });

  it("companion: Huras claws fixed, posture in slot 8 after 8 claw mods", () => {
    const c = loadout.companionBuild!;
    expect(c.companionId).toBe("huras");
    expect(c.weaponId).toBe("huras_claws");
    expect(c.mods).toHaveLength(10);
    expect(bySlot(c.weaponMods)[8]).toBe("assassin_posture@3");
    expect(c.weaponMods).toHaveLength(9);
  });

  it("necramech: 12 frame slots in order", () => {
    const a = loadout.archwingBuild!;
    expect(a.mode).toBe("necramech");
    expect(a.frameMods.map((m) => m.slotIndex)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});
