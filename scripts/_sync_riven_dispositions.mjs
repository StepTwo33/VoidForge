/**
 * Sync src/data/riven-dispositions.ts from api.warframestat.us/weapons
 * (omegaAttenuation / disposition). Does not persist the raw API dump.
 */
import https from "https";
import fs from "fs";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "FrameHubDispositionSync/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

const raw = await get("https://api.warframestat.us/weapons");
const data = JSON.parse(raw);
const map = new Map();
for (const w of data) {
  const name = w.name;
  // Prefer omegaAttenuation (0.5–1.55). `disposition` on this API is the 1–5 star rating.
  const disp =
    typeof w.omegaAttenuation === "number"
      ? w.omegaAttenuation
      : typeof w.disposition === "number" && w.disposition > 0 && w.disposition <= 1.55
        ? w.disposition
        : null;
  if (!name || disp == null) continue;
  if (!map.has(name)) map.set(name, disp);
}

for (const n of ["Amprex", "Braton Prime", "Soma Prime", "Ignis Wraith", "Rubico Prime"]) {
  console.log(n, map.get(n));
}
console.log("total", map.size);

const entries = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const lines = entries.map(([n, v]) => `  ${JSON.stringify(n)}: ${Number(v.toFixed(3))},`);
const out = `/** Auto-synced disposition table (omegaAttenuation). Source: api.warframestat.us/weapons */
export const rivenDispositions: Record<string, number> = {
${lines.join("\n")}
};

export function hasKnownDisposition(weaponName: string): boolean {
  return Object.prototype.hasOwnProperty.call(rivenDispositions, weaponName);
}

/** Returns disposition; falls back to 1.0 when unknown (check hasKnownDisposition). */
export function getDisposition(weaponName: string): number {
  return rivenDispositions[weaponName] ?? 1.0;
}

export function getDispositionInfo(weaponName: string): { value: number; known: boolean } {
  const known = hasKnownDisposition(weaponName);
  return { value: known ? rivenDispositions[weaponName]! : 1.0, known };
}
`;

fs.writeFileSync("src/data/riven-dispositions.ts", out, "utf8");
console.log("wrote", entries.length, "dispositions");
