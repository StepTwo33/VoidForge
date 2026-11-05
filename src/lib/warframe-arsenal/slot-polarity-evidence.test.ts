import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Round 54b (Player Sync polarities): the Twitch Arsenal payload has no per-slot polarity data.
 * Same result across all 8 upstream WFCD/arsenal-parser examples (commit 9a1000d): `polarized`
 * is a Forma count, and `pol` only appears on riven upgrades (/Randomized/). Riven `pol` is
 * imported (rivenPolarityFromUpgrade). Slot polarities are not in the payload, so they can't be.
 */
describe("Player Sync export: slot polarity evidence", () => {
  const raw = JSON.parse(readFileSync(join(__dirname, "__fixtures__", "wfcd-example7-wisp-prime.json"), "utf8"));
  const polHolders: Record<string, unknown>[] = [];
  const keys = new Set<string>();
  const walk = (o: unknown) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === "object") {
      const rec = o as Record<string, unknown>;
      if ("pol" in rec) polHolders.push(rec);
      for (const [k, v] of Object.entries(rec)) {
        keys.add(k);
        walk(v);
      }
    }
  };
  walk(raw);

  it("has no per-slot polarity field, only a Forma count", () => {
    const polarityish = [...keys].filter((k) => /polar/i.test(k));
    expect(polarityish).toEqual(["polarized"]);
  });

  it("carries pol only on riven upgrades", () => {
    expect(polHolders.length).toBeGreaterThan(0);
    for (const h of polHolders) expect(String(h.uniqueName)).toMatch(/\/Randomized\//);
  });
});
