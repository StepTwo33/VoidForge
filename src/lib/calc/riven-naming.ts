/**
 * Warframe-authentic Riven Mod Nomenclature generator.
 *
 * In Warframe, Riven names are procedurally generated from positive stats:
 * 1 positive:  <Weapon> <Prefix><Suffix> (e.g. Braton Visican)
 * 2 positives: <Weapon> <Prefix1>-<Prefix2><Suffix2> (e.g. Torid Sati-critacron)
 * 3 positives: <Weapon> <Prefix1>-<Prefix2><Suffix3> (e.g. Vectis Sati-critaata)
 *
 * Source: Official Warframe Wiki (wiki.warframe.com/w/Riven_Mods#Nomenclature)
 */

export interface RivenAffix {
  prefix: string;
  suffix: string;
}

export const RIVEN_AFFIX_TABLE: Record<string, RivenAffix> = {
  damage: { prefix: "Visi", suffix: "ata" },
  multishot: { prefix: "Sati", suffix: "can" },
  criticalChance: { prefix: "Crita", suffix: "cron" },
  criticalMultiplier: { prefix: "Acri", suffix: "tis" },
  statusChance: { prefix: "Hexa", suffix: "dex" },
  statusDuration: { prefix: "Deci", suffix: "des" },
  fireRate: { prefix: "Croni", suffix: "dra" },
  attackSpeed: { prefix: "Croni", suffix: "dra" },
  range: { prefix: "Locti", suffix: "tor" },
  cold: { prefix: "Geli", suffix: "do" },
  electricity: { prefix: "Vexi", suffix: "tio" },
  heat: { prefix: "Igni", suffix: "pha" },
  toxin: { prefix: "Toxi", suffix: "tox" },
  impact: { prefix: "Magna", suffix: "ton" },
  puncture: { prefix: "Insi", suffix: "cak" },
  slash: { prefix: "Sci", suffix: "sus" },
  reloadSpeed: { prefix: "Feva", suffix: "tak" },
  magazine: { prefix: "Arma", suffix: "tin" },
  ammoMax: { prefix: "Ampi", suffix: "bin" },
  punchThrough: { prefix: "Lexi", suffix: "nok" },
  recoil: { prefix: "Zeti", suffix: "mag" },
  zoom: { prefix: "Tyron", suffix: "us" },
  projectileSpeed: { prefix: "Conci", suffix: "nak" },
  comboDuration: { prefix: "Tempi", suffix: "nem" },
  initialCombo: { prefix: "Uti", suffix: "tia" },
  heavyAttackEfficiency: { prefix: "Uti", suffix: "tia" },
  slideAttack: { prefix: "Pleci", suffix: "nent" },
  slideAttackCritChance: { prefix: "Pleci", suffix: "nent" },
  finisherDamage: { prefix: "Exi", suffix: "cta" },
  factionGrineer: { prefix: "Argi", suffix: "con" },
  factionCorpus: { prefix: "Manti", suffix: "tron" },
  factionInfested: { prefix: "Pura", suffix: "ada" },
  factionOrokin: { prefix: "Puris", suffix: "ada" },
  // Spliced traits (Update 44.1)
  viral: { prefix: "Vira", suffix: "do" },
  corrosive: { prefix: "Corri", suffix: "tox" },
  radiation: { prefix: "Radi", suffix: "pha" },
  gas: { prefix: "Gasi", suffix: "tox" },
  magnetic: { prefix: "Magni", suffix: "tio" },
  blast: { prefix: "Blasti", suffix: "ton" },
  statusDamage: { prefix: "Statis", suffix: "dex" },
  weakPointDamage: { prefix: "Capi", suffix: "tis" },
  weakPointCritChance: { prefix: "Capi", suffix: "cron" },
  ammoEfficiency: { prefix: "Faci", suffix: "tin" },
  heavyAttackWindUp: { prefix: "Velo", suffix: "dra" },
  slamDamage: { prefix: "Magni", suffix: "ton" },
};

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Generate a procedural Riven name from positive stat keys.
 * @param weaponName Weapon prefix (e.g. "Torid", "Rubico", "Ceramic Dagger")
 * @param positiveStatKeys Keys of positive stats (1 to 3 stats)
 */
export function formatRivenName(weaponName: string, positiveStatKeys: string[]): string {
  const affixes = positiveStatKeys
    .map((k) => RIVEN_AFFIX_TABLE[k] || { prefix: capitalize(k.slice(0, 4)), suffix: k.slice(-3).toLowerCase() })
    .filter(Boolean);

  if (affixes.length === 0) {
    return weaponName ? `${weaponName} Riven Mod` : "Riven Mod";
  }

  let rollName = "";
  if (affixes.length === 1) {
    const a = affixes[0];
    rollName = `${a.prefix}${a.suffix.toLowerCase()}`;
  } else if (affixes.length === 2) {
    const [a, b] = affixes;
    rollName = `${a.prefix}-${b.prefix.toLowerCase()}${b.suffix.toLowerCase()}`;
  } else {
    const [a, b, c] = affixes;
    rollName = `${a.prefix}-${b.prefix.toLowerCase()}${c.suffix.toLowerCase()}`;
  }

  return weaponName ? `${weaponName} ${rollName}` : rollName;
}
