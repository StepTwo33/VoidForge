/**
 * Audit codex image paths vs files on disk.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WEAPON_IMAGE_STEM_BY_NAME = {
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
};
const WARFRAME_IMAGE_STEM_BY_NAME = {
  "Voruna Prime": "Voruna",
  "Sirius & Orion": "Sirius_Orion",
};
const MOD_IMAGE_STEM_BY_NAME = {
  "Endless Lull": "Endless_Lullaby",
  "Flame Claws": "Heated_Charge",
  "Frost Claws": "Chilling_Claws",
  Looters: "Looter",
  Berserker: "Berserker_Fury",
  "Aero Set Bonus": "Hawksetmod",
  "Carnis Set Bonus": "Ashensetmod",
  "Jugulus Set Bonus": "Bonebladesetmod",
  "Motus Set Bonus": "Raptorsetmod",
  "Proton Set Bonus": "Spidersetmod",
  "Saxum Set Bonus": "Femursetmod",
};
const MOD_STEM_SMALL_WORDS = new Set(["of", "the", "and"]);

function modPngStem(name) {
  if (MOD_IMAGE_STEM_BY_NAME[name]) return MOD_IMAGE_STEM_BY_NAME[name];
  const setBonus = name.match(/^(\w+) Set Bonus$/);
  if (setBonus) return `${setBonus[1]}setmod`;
  const riven = name.match(/^Riven Mod \((.+)\)$/);
  if (riven) return `${riven[1].replace(/ /g, "_")}_Riven_Mod`;
  const claw = name.match(/^(.+) \(Claws\)$/);
  if (claw) return claw[1].replace(/ /g, "_");
  return name
    .replace(/ /g, "_")
    .split("_")
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

function pngStem(name, category) {
  if (category === "mods") return modPngStem(name);
  const maps = { weapons: WEAPON_IMAGE_STEM_BY_NAME, warframes: WARFRAME_IMAGE_STEM_BY_NAME };
  return (maps[category]?.[name] ?? name).replace(/ /g, "_");
}

function normalizeRoman(stem) {
  return stem.replace(/_Ii(?=_|$)/g, "_II").replace(/_Iii(?=_|$)/g, "_III");
}

function extractNames(file, onlyFirst = false) {
  const data = readFileSync(file, "utf8");
  const nameRe = /(?:name|"name"):\s*"([^"]+)"/g;
  if (onlyFirst) {
    const blocks = data.split(/\n  \{/);
    return blocks.map((b) => b.match(/(?:name|"name"):\s*"([^"]+)"/)?.[1]).filter(Boolean);
  }
  return [...data.matchAll(nameRe)].map((m) => m[1]);
}

function audit(category, names) {
  const dir = join("public/images", category);
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".png")) : [];
  const fileSet = new Set(files.map((f) => f.replace(/\.png$/i, "")));
  const fileSetNorm = new Set(files.map((f) => normalizeRoman(f.replace(/\.png$/i, ""))));
  const missing = [];
  const caseMismatch = [];
  for (const name of names) {
    const stem = pngStem(name, category);
    if (fileSet.has(stem)) continue;
    if (fileSetNorm.has(stem)) {
      caseMismatch.push({ name, stem });
      continue;
    }
    missing.push({ name, stem });
  }
  return { missing, caseMismatch, total: names.length, files: files.length };
}

const weaponNames = [
  ...new Set([...extractNames("src/data/weapons.ts"), ...extractNames("src/data/custom-items.ts")]),
];
const modNames = [...readFileSync("src/data/mods.ts", "utf8").matchAll(/"name":\s*"([^"]+)"/g)].map((m) => m[1]);

const jobs = [
  ["warframes", extractNames("src/data/warframes.ts", true)],
  ["weapons", weaponNames],
  ["companions", extractNames("src/data/companions.ts")],
  ["arcanes", extractNames("src/data/arcanes.ts")],
  ["mods", modNames],
];

for (const [cat, names] of jobs) {
  const { missing, caseMismatch, total, files } = audit(cat, names);
  console.log(`=== ${cat} ===`);
  console.log(`catalog: ${total} | png files: ${files} | missing: ${missing.length} | case mismatch: ${caseMismatch.length}`);
  missing.slice(0, 20).forEach((m) => console.log(`  MISSING ${m.name} -> ${m.stem}.png`));
  if (missing.length > 20) console.log(`  ... +${missing.length - 20} more`);
  caseMismatch.slice(0, 10).forEach((m) => console.log(`  CASE ${m.name} -> ${m.stem}.png`));
  console.log("");
}
