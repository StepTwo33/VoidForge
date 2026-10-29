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
  // Batch 4b: more alt-fire shots
  "tenora", "tenora_prime", "corinth", "corinth_prime", "basmu", "buzlok", "cedo", "cedo_prime", "paracyst",
  "azima", "scyotid", "enkaus", "quanta", "quanta_vandal", "tenet_quanta", "mutalist_quanta", "phantasma",
  "phantasma_prime",
  // Batch 4c: the five that each needed one decision
  "aeolak", "tenet_plinx", "tenet_tetra", "coda_bassocyst", "stug",
  // Batch 5: thrown spears
  "afentis", "afentis_prime", "ferrox", "tenet_ferrox", "javlok", "scourge", "scourge_prime",
  // Batch 6a: glaive-style throws
  "glaive", "pathocyst", "coda_pathocyst", "orvius", "cerata", "falcor", "halikar", "halikar_wraith", "kestrel",
  "kestrel_prime", "xoris", "wolf_sledge",
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

describe("ALT FIRE shows the wiki's per-type damage (unquantized, like DIRECT DAMAGE)", () => {
  /** The ALT FIRE block only (from its header to the end of the panel). */
  const altBlock = (id: string) => renderPanel(byId(id)).split(">ALT FIRE<")[1] ?? "";
  // [id, [label, wiki value] ...] from Module:Weapons/data (alt-fire attack).
  const CASES: [string, [string, string][]][] = [
    ["stahlta", [["Damage / shot", "600.0"], ["Impact", "120.0"], ["Puncture", "180.0"], ["Slash", "300.0"]]],
    ["harpak", [["Impact", "40.0"], ["Puncture", "50.0"], ["Slash", "10.0"]]],
    ["panthera", [["Impact", "10.0"], ["Puncture", "10.0"], ["Slash", "80.0"]]],
    ["efv_5_jupiter", [["Puncture", "57.0"], ["Slash", "35.0"], ["Corrosive", "35.0"]]],
    ["euphona_prime", [["Impact", "4.4"], ["Puncture", "17.6"], ["Slash", "66.0"]]],
    ["zenith", [["Impact", "15.0"], ["Puncture", "120.0"], ["Slash", "15.0"]]],
  ];
  for (const [id, rows] of CASES) {
    it(`${id}: ${rows.map(([l, v]) => `${l} ${v}`).join(", ")}`, () => {
      const html = altBlock(id);
      for (const [label, value] of rows) expect(html, `${id} ${label}`).toMatch(new RegExp(`>${label}<.*?>${value.replace(".", "\\.")}<`));
    });
  }

  it("Stahlta alt DPS is unchanged by the display fix: 600 x 1.8 / (1.6 + 1 / 0.667)", () => {
    const [alt] = computeAltFire(byId("stahlta"), calc);
    expect(Math.abs(alt!.stats.burstDps - (600 * 1.8) / (1.6 + 1 / 0.667)) / alt!.stats.burstDps).toBeLessThan(0.002);
  });
});

describe("explosion rows show the wiki's unrounded damage (display only, like the per-type fix)", () => {
  const radialBlock = (id: string) => (renderPanel(byId(id)).split(">RADIAL ATTACK<")[1] ?? "").split(">ALT FIRE<")[0];
  const altBlock = (id: string) => renderPanel(byId(id)).split(">ALT FIRE<")[1] ?? "";
  // [id, Total Damage values in order] from Module:Weapons/data; the quantized values were 96.9 / 58.1 / 1017.2 / 10.1, 666.9.
  const MAIN: [string, string[]][] = [
    ["ferrox", ["100.0"]], ["tenet_ferrox", ["60.0"]], ["afentis_prime", ["1050.0"]], ["lenz", ["10.0", "660.0"]], ["ogris", ["600.0"]],
  ];
  for (const [id, totals] of MAIN) {
    it(`${id} RADIAL ATTACK: ${totals.join(", ")}`, () => {
      const got = [...radialBlock(id).matchAll(/>Total Damage<.*?>([\d.]+)</g)].map((m) => m[1]);
      expect(got).toEqual(totals);
    });
  }
  it("per-type radial rows too: Afentis Prime Blast 800, Heat 250; Tenet Ferrox Puncture 42", () => {
    expect(radialBlock("afentis_prime")).toMatch(/>Blast<.*?>800\.0</);
    expect(radialBlock("afentis_prime")).toMatch(/>Heat<.*?>250\.0</);
    expect(radialBlock("tenet_ferrox")).toMatch(/>Puncture<.*?>42\.0</);
  });
  it("ALT FIRE explosion rows: Ferrox / Tenet Ferrox Attraction Field 150, Javlok 660", () => {
    for (const id of ["ferrox", "tenet_ferrox"]) expect(altBlock(id), id).toContain("150 · 10.0m");
    expect(altBlock("javlok")).toContain("660 · 6.0m");
  });
  it("the calculator still holds the quantized value (DPS unchanged): Ferrox radial 96.875", () => {
    const r = calc(byId("ferrox")).radialAttacks!.find((a) => a.name === "Radial Attack")!;
    expect(r.totalDamage).toBeCloseTo(96.875, 6);
  });
});
