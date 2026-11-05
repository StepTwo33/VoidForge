/**
 * Round 51: wiki.warframe.com infobox (the stat bar on each weapon page) as the tie-breaker for
 * open alt-fire / passive questions. Values that already matched the infobox are pinned here too,
 * so a later regeneration can't drift away from them silently.
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { incarnonDataMap } from "@/data/incarnon";
import { WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";
import { WEAPON_PASSIVES } from "@/data/weapon-passives";
import { kitgunChambers } from "@/data/modular-weapons";
import { incarnonGenesisFormTrigger } from "@/lib/calc/incarnon-active-weapon";
import { getWeaponModProfile, modCompatibleWithWeaponProfile } from "@/lib/mods/weapon-mod-tags";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const alt = (id: string, label: string) => WEAPON_ALT_FIRE[id].find((m) => m.label === label)!;
const radial = (id: string, label: string, name: string) =>
  alt(id, label).radialAttacks!.find((r) => r.name === name)!;

describe("Round 51: values that match the wiki infobox (unchanged)", () => {
  it("Enkaus alt-fire costs 1 ammo (infobox Ammo Cost 1; Jason confirmed)", () => {
    const m = WEAPON_ALT_FIRE.enkaus[0];
    expect(m.ammoCost).toBe(1);
    expect(m.note).toContain("Costs 1 ammo");
  });

  it("Mutalist Quanta orb explosion 4.4 m, falls to 50% (infobox)", () => {
    const r = radial("mutalist_quanta", "Infested Orb", "Orb Explosion");
    expect(r.radius).toBe(4.4);
    expect(r.falloffReduction).toBeCloseTo(0.5, 6);
  });

  it("Morgha mortar explosion falls to 40% (infobox; the page's 70% is the primary shot)", () => {
    const r = radial("morgha", "Mortar", "Charged Shot Explosion");
    expect(r.falloffReduction).toBeCloseTo(0.6, 6);
  });

  it("Kestrel / Kestrel Prime / Glaive / Glaive Prime recall explosions have no falloff (infobox 100% - 100%)", () => {
    for (const id of ["kestrel", "kestrel_prime", "glaive", "glaive_prime"]) {
      for (const m of WEAPON_ALT_FIRE[id]) {
        const rows = (m.radialAttacks ?? []).filter((r) => /Recall/.test(r.name));
        for (const r of rows) expect(r.falloffReduction ?? 0, `${id} ${r.name}`).toBe(0);
      }
    }
  });

  it("Glaive Throw has no forced proc; Charged Throw forces Impact (infobox)", () => {
    expect(alt("glaive", "Throw").forcedProcs).toEqual([]);
    expect(alt("glaive", "Charged Throw").forcedProcs).toEqual(["Impact"]);
  });

  it("Scourge / Scourge Prime spear throw costs 1 ammo (page: 'consumes 1 ammo')", () => {
    expect(alt("scourge", "Spear Throw").ammoCost).toBe(1);
    expect(alt("scourge_prime", "Spear Throw").ammoCost).toBe(1);
    expect(alt("scourge", "Spear Throw").note).toContain("for 1 ammo");
  });

  it("Mausolon Charged Shot Explosion 8 m, falls to 60%, Archwing and Gravimag", () => {
    const m = alt("mausolon", "Charged Laser");
    expect(m.radialAttacks![0].radius).toBe(8);
    expect(m.atmosphere!.radialAttacks![0].radius).toBe(8);
    expect(m.atmosphere!.radialAttacks![0].falloffReduction).toBeCloseTo(0.4, 6);
  });
});

describe("Round 51: wiki-backed text and trigger fixes", () => {
  it("Nepheri fireball range 20 m (infobox; Jason confirmed)", () => {
    expect(alt("nepheri", "Fireball").note).toContain("Range 20 m");
  });

  it("Harpak / Panthera Prime / Stropha / Mutalist Quanta notes state the infobox range", () => {
    expect(alt("harpak", "Harpoon").note).toContain("Range 40 m");
    expect(alt("panthera_prime", "Alt-Fire").note).toContain("6 m reach");
    expect(alt("stropha", "Gunblade Shot").note).toContain("1.43%");
    expect(alt("mutalist_quanta", "Infested Orb").note).toContain("4.4 m");
  });

  it("Neutralizer Cryo Grenade note cites the Neutralize page's 60% falloff", () => {
    expect(alt("neutralizer", "Cryo Grenade").note).toContain("60% damage falloff");
  });

  it("passives: Enkaus 0.33 ammo per hit, Stahlta has no extra Radiation proc, Telos Boltace Lifted launch", () => {
    expect(WEAPON_PASSIVES.enkaus).toContain("0.33 ammo");
    expect(WEAPON_PASSIVES.enkaus).not.toContain("{{");
    expect(WEAPON_PASSIVES.stahlta).not.toMatch(/independent/i);
    expect(WEAPON_PASSIVES.stahlta).toContain("guaranteed Impact");
    expect(WEAPON_PASSIVES.telos_boltace).toContain("Lifted");
    expect(WEAPON_PASSIVES.telos_boltace).not.toMatch(/ragdoll/i);
  });

  it("Vermisplicer description: primary chains to 3 more enemies (wiki; Update 30.5 cut 5 to 3)", () => {
    const c = kitgunChambers.find((k) => k.id === "vermisplicer_chamber")!;
    expect(c.description).toContain("up to 3 more enemies");
  });

  it("Dera Incarnon Form trigger is Auto (form tab has none; weapon Trigger Type Auto)", () => {
    const d = incarnonDataMap.get("dera")!;
    expect(incarnonGenesisFormTrigger(d, true)).toBe("Auto");
    const profile = getWeaponModProfile(weapon("dera"), {
      incarnonFormTriggerType: incarnonGenesisFormTrigger(d, true),
    });
    expect(modCompatibleWithWeaponProfile("semi_rifle_cannonade", profile)).toBe(false);
  });

  it("Knell / Knell Prime stay Auto, so Semi-Pistol Cannonade does not fit (infobox Trigger Type Auto)", () => {
    for (const id of ["knell", "knell_prime"]) {
      expect(modCompatibleWithWeaponProfile("semi_pistol_cannonade", getWeaponModProfile(weapon(id)))).toBe(false);
    }
  });
});
