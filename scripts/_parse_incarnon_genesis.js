// One-shot: parse Incarnon Genesis evolution tables from downloaded wikitext.
// Emits JSON: { weaponKey: { variants: [wikiNames], evos: [{ tier, slot, name,
// bullets, description, variantCells }] } }
import fs from "fs";
import path from "path";
const __dirname = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const DIR = path.join(__dirname, "_wiki_incarnon");

function cleanWiki(text) {
  return text
    .replace(/\{\{D\|([^}|]+)[^}]*\}\}/g, "$1")
    .replace(/\{\{(?:M|A|Arcane|Weapon)\|([^}|]+)[^}]*\}\}/g, "$1")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\[\[File:[^\]]*\]\]/g, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, "$1")
    .replace(/'''?/g, "")
    .replace(/&lt;br\s*\/?&gt;/g, " ")
    .replace(/&lt;\/?u&gt;/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const out = {};
for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".xml")) continue;
  const xml = fs.readFileSync(path.join(DIR, file), "utf8");
  const textMatch = /<text[^>]*>([\s\S]*?)<\/text>/.exec(xml);
  if (!textMatch) { console.error("no text:", file); continue; }
  const wiki = textMatch[1];
  const evoSection = /===\s*Evolutions\s*===([\s\S]*?)(?:\n==[^=]|$)/.exec(wiki);
  if (!evoSection) { console.error("no evolutions:", file); continue; }
  const lines = evoSection[1].split("\n");

  // Variant columns from header: "! ... | {{Weapon|Name}}" lines before EVO1
  const variants = [];
  for (const line of lines) {
    if (/!\s*(?:rowspan="\d+"\s*\|\s*)?EVO1/.test(line)) break;
    if (/^!/.test(line)) {
      const wm = [...line.matchAll(/\{\{Weapon\|([^}|]+)(?:\|[^}]*)?\}\}/g)];
      for (const m of wm) variants.push(m[1].trim());
    }
  }

  const evos = [];
  let tier = 0;
  let slot = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const evoHeader = /!\s*(?:rowspan="\d+"\s*\|\s*)?EVO(\d)/.exec(line);
    if (evoHeader) { tier = Number(evoHeader[1]); slot = 0; continue; }
    if (/^!/.test(line)) continue;
    // Perk names are usually bold, but some rows are not (Burston "Ready Retaliation"):
    // accept a plain name when it is followed by the perk icon.
    const nameMatch =
      /^\|\s*style=[^|]*\|\s*(?:'''(.+?)'''|(Incarnon Form)|([^'\[|*]+?)(?=\s*\[\[File:))\s*(?:\[\[File:|$)/.exec(line);
    if (nameMatch && tier > 0) {
      const name = (nameMatch[1] ?? nameMatch[2] ?? nameMatch[3]).trim();
      const desc = [];
      let j = i + 1;
      if (lines[j] !== undefined && /^\|\s*$/.test(lines[j])) j++;
      while (j < lines.length && /^\*/.test(lines[j])) {
        desc.push(cleanWiki(lines[j].replace(/^\*+/, "").trim()));
        j++;
      }
      // Per-variant value cells: "| style="text-align:center..." | X = 12% ..."
      const cells = [];
      while (j < lines.length && /^\|\s*style="text-align:center/.test(lines[j])) {
        const cell = cleanWiki(lines[j].replace(/^\|\s*style="text-align:center;?"?\s*\|?/, ""));
        cells.push(cell);
        j++;
      }
      evos.push({
        tier, slot, name, bullets: desc,
        description: desc.join(" "),
        variantCells: cells.slice(0, Math.max(variants.length, 0)),
      });
      slot++;
    }
  }
  out[file.replace(".xml", "")] = { variants, evos };
}
fs.writeFileSync(path.join(DIR, "_parsed.json"), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) {
  console.log(k.padEnd(18), v.evos.length, "perks; variants:", v.variants.join(", ") || "(single)");
}
