import { describe, expect, it } from "vitest";
import { openResetKey, shouldResetOnOpen } from "./reset-on-open";

/** Reference model of the effect these helpers replaced: `useEffect(() => { if (open) reset(); }, [open, ...seeds])`. */
function simulateEffect(frames: Array<{ open: boolean; seeds: unknown[] }>): boolean[] {
  let prev: string | null = null;
  return frames.map((f) => {
    const key = openResetKey(f.open, ...f.seeds);
    const reset = prev !== key && f.open; // effect re-runs when any dep changed; body gated on `open`
    prev = key;
    return reset;
  });
}

function simulateRenderTime(frames: Array<{ open: boolean; seeds: unknown[] }>): boolean[] {
  let prev: string | null = null;
  return frames.map((f) => {
    const key = openResetKey(f.open, ...f.seeds);
    const reset = shouldResetOnOpen(prev, key, f.open);
    prev = key;
    return reset;
  });
}

describe("reset-on-open (mod picker tab/filter/sort reset timing)", () => {
  it("resets on first render when already open, not when closed", () => {
    expect(simulateRenderTime([{ open: true, seeds: ["mods", "mods"] }])).toEqual([true]);
    expect(simulateRenderTime([{ open: false, seeds: ["mods", "mods"] }])).toEqual([false]);
  });

  it("resets each time the picker re-opens", () => {
    const s = ["mods", "mods"];
    expect(
      simulateRenderTime([
        { open: false, seeds: s },
        { open: true, seeds: s },
        { open: true, seeds: s }, // re-render while open: keep user's chip/sort
        { open: false, seeds: s },
        { open: true, seeds: s },
      ]),
    ).toEqual([false, true, false, false, true]);
  });

  it("resets when a seed changes while open, but not while closed", () => {
    expect(
      simulateRenderTime([
        { open: true, seeds: ["mods", "mods"] },
        { open: true, seeds: ["arcanes", "arcanes"] },
        { open: false, seeds: ["mods", "mods"] },
      ]),
    ).toEqual([true, true, false]);
  });

  it("matches the original effect on a long mixed sequence", () => {
    const frames = [
      { open: false, seeds: ["a", "x"] },
      { open: true, seeds: ["a", "x"] },
      { open: true, seeds: ["a", "x"] },
      { open: true, seeds: ["b", "x"] },
      { open: true, seeds: ["b", "y"] },
      { open: false, seeds: ["b", "y"] },
      { open: false, seeds: ["c", "y"] },
      { open: true, seeds: ["c", "y"] },
      { open: true, seeds: ["c", "y"] },
    ];
    expect(simulateRenderTime(frames)).toEqual(simulateEffect(frames));
  });
});
