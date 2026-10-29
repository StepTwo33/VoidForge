import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { modsMap } from "@/data/mods";
import { WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { computeAltFire, getAltFireModes } from "@/lib/weapons/alt-fire";
import { getAlternateModes } from "@/lib/weapons/weapon-alternate-mode";
import { WeaponStatsPanel } from "@/components/stats/weapon-stats-panel";
import type { Weapon } from "@/lib/types";

const weapons = getEffectiveWeapons();
const byId = (id: string) => weapons.find((w) => w.id === id)!;
const calc = (w: Weapon) => calculateWeaponBuild(w, [], modsMap);

/** Render the panel the way the builder does (stats + altFire from computeAltFire) and return the markup. */
function renderPanel(w: Weapon): string {
  return renderToStaticMarkup(
    createElement(WeaponStatsPanel, { stats: calc(w), baseStats: calc(w), weapon: w, isMelee: w.category === "melee", altFire: computeAltFire(w, calc) }),
  );
}
const hasSection = (html: string) => html.includes(">ALT FIRE<");

/**
 * Every weapon that should show ALT FIRE, each checked against its wiki.warframe.com page
 * (a real alt-fire, charged, aimed or secondary firing mode). Dark Split-Sword is excluded on purpose:
 * its alt is a stance-form switch that stays a button.
 */
const EXPECTED = [
  // Round 30 data table (batches 0, 1 and 2)
  "cernos", "zarr", "quellor", "glaive_prime", "pandero", "pandero_prime", "nagantaka", "nagantaka_prime",
  "athodai", "athodai_prime", "cyanex", "kuva_kraken", "tenet_detron",
  // Batch 2: tap vs hold
  "ballistica", "ballistica_prime", "rakta_ballistica", "cinta", "daikyu_prime", "drakgoon", "kuva_drakgoon", "dread",
  "epitaph", "epitaph_prime", "evensong", "lanka", "miter", "mk1_paris", "mutalist_cernos", "nataruk", "opticor",
  "opticor_vandal", "paris", "paris_prime", "rakta_cernos",
  // Batch 3: fire-mode toggles
  "kuva_zarr", "ambassador", "argonak", "fulmin", "fulmin_prime", "stradavar", "stradavar_prime", "zenith",
  "fusilai", "hystrix", "hystrix_prime", "sepulcrum", "tenet_diplos", "haalvu",
  // Batch 4a: alt-fire shots with their own stats
  "alternox", "alternox_prime", "battacor", "efv_5_jupiter", "efv_8_mars", "euphona_prime", "harpak", "higasa",
  "kuva_hek", "panthera", "panthera_prime", "stahlta", "trumna", "trumna_prime",
  // Former toggle weapons (legacy alternateModeStats)
  "nunchasa", "hind", "bubonico", "coda_bubonico", "kuva_hind", "kuva_quartakk", "tiberon_prime", "quatz",
  "staticor", "corufell_prime", "talons_thrown",
].sort();

describe("ALT FIRE section only appears on weapons with an alt fire", () => {
  it("the set of weapons with alt-fire modes is exactly the wiki-checked list", () => {
    const withModes = weapons.filter((w) => getAltFireModes(w).length > 0).map((w) => w.id).sort();
    expect(withModes).toEqual(EXPECTED);
    for (const id of Object.keys(WEAPON_ALT_FIRE)) expect(EXPECTED).toContain(id);
  });

  it("renders a non-empty section for every expected weapon", () => {
    for (const id of EXPECTED) {
      const w = byId(id);
      const html = renderPanel(w);
      expect(hasSection(html), id).toBe(true);
      for (const r of computeAltFire(w, calc)) {
        expect(r.label.length, id).toBeGreaterThan(0);
        expect(r.stats.totalDamage, id).toBeGreaterThan(0);
        expect(html, id).toContain(r.label);
      }
    }
  });

  it("never renders the section for any other weapon (all ~710)", () => {
    expect(weapons.length).toBeGreaterThan(700);
    const offenders = weapons.filter((w) => !EXPECTED.includes(w.id) && hasSection(renderPanel(w))).map((w) => w.id);
    expect(offenders).toEqual([]);
  }, 60_000); // renders the full panel ~690 times

  it("Dark Split-Sword (stance form) gets no section", () => {
    const w = byId("dark_split_sword");
    expect(getAlternateModes(w).some((m) => m.stanceType)).toBe(true);
    expect(hasSection(renderPanel(w))).toBe(false);
  });

  it("an empty altFire list renders no section (no empty header)", () => {
    const w = byId("braton");
    const html = renderToStaticMarkup(createElement(WeaponStatsPanel, { stats: calc(w), weapon: w, altFire: [] }));
    expect(hasSection(html)).toBe(false);
  });
});
