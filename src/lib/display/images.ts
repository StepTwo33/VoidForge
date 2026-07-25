// Image path utilities for item thumbnails.
// All icons load from /public/images/{category}/ — static, instant, no external proxy.

/** In-app display name → PNG stem when it differs from the default `name` → underscores rule */
const WEAPON_IMAGE_STEM_BY_NAME: Record<string, string> = {
  "Coda Bubonico": "Bubonico",
  "Kuva Ghoulsaw": "Ghoulsaw",
  "Tenet Quanta": "Quanta",
  "Perigale Prime": "Perigale",
  "Afentis Prime": "Afentis",
  "Athodai Prime": "Athodai",
  "Sarofang Prime": "Sarofang",
  "Ax-52": "Ax-52",
  "Efv-5 Jupiter": "Efv-5_Jupiter",
  "Efv-8 Mars": "Efv-8_Mars",
  "Shadow Clones Prime": "Shadow_Clones",
  "Shattered Lash Prime": "Shattered_Lash",
  "Landslide Fists Prime": "Landslide_Fists",
  "Whipclaw Prime": "Whipclaw",
};

const WARFRAME_IMAGE_STEM_BY_NAME: Record<string, string> = {
  "Voruna Prime": "Voruna",
  "Sirius & Orion": "Sirius_Orion",
};

/** Mod display name → PNG stem when it differs from the default rule. */
const MOD_IMAGE_STEM_BY_NAME: Record<string, string> = {
  "Endless Lull": "Endless_Lullaby",
  "Flame Claws": "Heated_Charge",
  "Frost Claws": "Chilling_Claws",
  "Looters": "Looter",
  "ReactivStorm": "Reactive_Storm",
  "Berserker": "Berserker_Fury",
  "Aero Set Bonus": "Hawksetmod",
  "Carnis Set Bonus": "Ashensetmod",
  "Jugulus Set Bonus": "Bonebladesetmod",
  "Motus Set Bonus": "Raptorsetmod",
  "Proton Set Bonus": "Spidersetmod",
  "Saxum Set Bonus": "Femursetmod",
  // Legacy catalog names → correct on-disk / wiki stems
  "Sprint Speed": "Sprint_Boost",
  "Scan Organic Lifeforms": "Scan_Aquatic_Lifeforms",
};

const MOD_STEM_SMALL_WORDS = new Set(["of", "the", "and"]);

export type GameImageCategory = "weapons" | "warframes" | "mods" | "arcanes" | "companions";

/** Shared icon for companion beast claw weapons. */
export const BEAST_CLAW_IMAGE_PATH = "/images/weapons/Beast_Claws.png";

/** Explicit local PNG overrides when the default stem rule does not match the file on disk. */
const LOCAL_IMAGE_OVERRIDES: Partial<Record<GameImageCategory, Record<string, string>>> = {
  warframes: {
    "Sirius & Orion": "/images/warframes/Sirius_Orion.png",
  },
};

function resolvedDisplayName(name: string, category: GameImageCategory): string {
  if (category === "weapons") return WEAPON_IMAGE_STEM_BY_NAME[name] ?? name;
  if (category === "warframes") return WARFRAME_IMAGE_STEM_BY_NAME[name] ?? name;
  if (category === "mods") return MOD_IMAGE_STEM_BY_NAME[name] ?? name;
  return name;
}

/** Normalize mod PNG stems to match on-disk Title_Case conventions. */
function modPngStem(name: string): string {
  const explicit = MOD_IMAGE_STEM_BY_NAME[name];
  if (explicit) return explicit;

  const setBonus = name.match(/^(\w+) Set Bonus$/);
  if (setBonus) return `${setBonus[1]}setmod`;

  const riven = name.match(/^Riven Mod \((.+)\)$/);
  if (riven) return `${riven[1].replace(/ /g, "_")}_Riven_Mod`;

  const claw = name.match(/^(.+) \(Claws\)$/);
  if (claw) return claw[1].replace(/ /g, "_");

  const parts = name.replace(/ /g, "_").split("_");
  return parts
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && MOD_STEM_SMALL_WORDS.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      if (word === word.toUpperCase() && word.length <= 4) {
        return word.charAt(0) + word.slice(1).toLowerCase();
      }
      return word;
    })
    .join("_");
}

export function pngStemForCategory(name: string, category: GameImageCategory): string {
  if (category === "mods") return modPngStem(name);
  return resolvedDisplayName(name, category).replace(/ /g, "_");
}

export function getImagePath(name: string, category: GameImageCategory): string {
  const filename = pngStemForCategory(name, category) + ".png";
  return `/images/${category}/${filename}`;
}

export function getLocalImageOverride(category: GameImageCategory, name: string): string | undefined {
  return LOCAL_IMAGE_OVERRIDES[category]?.[name];
}

export interface WeaponImageOptions {
  category?: string;
}

function resolveDirectGameImage(category: GameImageCategory, name: string, weaponCategory?: string): string {
  if (weaponCategory === "beast_claw") return BEAST_CLAW_IMAGE_PATH;
  const override = getLocalImageOverride(category, name);
  if (override) return override;
  return getImagePath(name, category);
}

export function getWeaponImage(name: string, options?: WeaponImageOptions): string {
  return resolveDirectGameImage("weapons", name, options?.category);
}

export function getWarframeImage(name: string): string {
  return resolveDirectGameImage("warframes", name);
}

export function getModImage(name: string): string {
  return resolveDirectGameImage("mods", name);
}

export function getArcaneImage(name: string): string {
  return resolveDirectGameImage("arcanes", name);
}

export function getCompanionImage(name: string): string {
  return resolveDirectGameImage("companions", name);
}
