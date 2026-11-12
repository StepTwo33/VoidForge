import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";

describe("Warframe Codex descriptions", () => {
  it("every frame has a non-empty description", () => {
    for (const wf of allWarframes) {
      expect(wf.description?.trim(), wf.id).toBeTruthy();
    }
  });

  it("a warframe description is never equal to an ability description", () => {
    // The 82 frames that previously copied ability 1 now use Module:Warframes/data
    // Codex text (primes use their own Description, or inherit the base). Helminth,
    // which is not in that module, uses a short Infirmary/subsume summary.
    const collisions: string[] = [];
    for (const wf of allWarframes) {
      const desc = wf.description?.trim();
      if (!desc) continue;
      for (const ability of wf.abilities ?? []) {
        if ((ability.description ?? "").trim() === desc) {
          collisions.push(`${wf.id} == ${ability.name}`);
        }
      }
    }
    expect(collisions).toEqual([]);
  });

  it("Mesa uses the official Codex line, not Ballistic Battery", () => {
    const mesa = allWarframes.find((w) => w.id === "mesa");
    expect(mesa?.description).toMatch(/gunslinger/i);
    expect(mesa?.description).not.toBe(mesa?.abilities?.[0]?.description);
  });
});
