/**
 * Fetch official wiki wikitext for abilities in the scaling registry
 * and extract stat / scaling hints for manual verification.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API = "https://wiki.warframe.com/api.php";
const HEADERS = { "User-Agent": "Voidforge/1.0 (https://void-forge.org)" };

const PAGES = [
  "Gravitic Slash",
  "Astral Shell",
  "Light's Sanctuary",
  "Event Horizon",
  "Shatter Shield",
  "Peacemaker",
  "Virulence",
  "Parasitic Link",
  "Ravenous",
  "Iron Skin",
  "Molt",
  "Toxic Lash",
  "Tharros Strike",
  "Rally Point",
  "Final Stand",
  "Speed",
  "Electric Shield",
  "Cloud Walker",
  "Defy",
  "Gloom",
  "Eclipse",
  "Self Portrait",
  "Plein Air",
  "Psychic Bolts",
];

async function fetchWikitext(title) {
  const params = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "wikitext",
    format: "json",
  });
  const resp = await fetch(`${API}?${params}`, { headers: HEADERS });
  if (!resp.ok) return { error: resp.statusText };
  const data = await resp.json();
  if (data.error) return { error: data.error.info };
  return { wikitext: data.parse?.wikitext?.["*"] ?? "" };
}

function extractScalingHints(wikitext) {
  const hints = [];
  const patterns = [
    /Ability Strength/gi,
    /Ability Duration/gi,
    /Ability Range/gi,
    /Ability Efficiency/gi,
    /\|STR\|/g,
    /\|DUR\|/g,
    /\|RNG\|/g,
    /cap(?:ped)? at \d+%/gi,
    /maximum of \d+%/gi,
    /scales with/gi,
    /does not scale/gi,
    /not affected by/gi,
  ];
  for (const pat of patterns) {
    const matches = wikitext.match(pat);
    if (matches) hints.push(...matches.map((m) => m.toLowerCase()));
  }
  // Infobox stat rows (common template format)
  const statRows = [...wikitext.matchAll(/\|\s*([^\n|]+?)\s*=\s*([^\n|]+)/g)]
    .slice(0, 40)
    .map((m) => `${m[1].trim()}: ${m[2].trim()}`);
  return { hints: [...new Set(hints)], statRows };
}

const results = {};

for (const page of PAGES) {
  process.stderr.write(`Fetching ${page}...\n`);
  const { wikitext, error } = await fetchWikitext(page);
  if (error) {
    results[page] = { error };
  } else {
    const { hints, statRows } = extractScalingHints(wikitext);
    results[page] = {
      hints,
      statRows: statRows.filter((r) =>
        /strength|duration|range|strip|reduction|radius|armor|shield|damage|slow|heal|regen|cap/i.test(r),
      ),
      excerpt: wikitext.slice(0, 2500),
    };
  }
  await new Promise((r) => setTimeout(r, 350));
}

const outPath = join(__dirname, "..", "tmp-wiki-ability-verify.json");
writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`Wrote ${outPath}`);
