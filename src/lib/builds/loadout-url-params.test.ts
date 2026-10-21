import { afterEach, describe, expect, it } from "vitest";
import { stripLoadoutParams } from "@/lib/builds/use-loadout-slot-from-url";

function stubWindow(href: string) {
  const calls: string[] = [];
  const w = {
    location: { href },
    history: {
      state: { __next: 1 },
      replaceState: (_s: unknown, _t: string, url: string) => {
        calls.push(url);
        w.location.href = new URL(url, href).href;
      },
    },
  };
  (globalThis as { window?: unknown }).window = w;
  return calls;
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("loadout URL params (R10-I)", () => {
  it("detach removes only loadout/slot and keeps other params", () => {
    const calls = stubWindow("https://x.test/weapon-builder?loadout=abc&slot=melee&build=XYZ");
    stripLoadoutParams();
    expect(calls).toEqual(["/weapon-builder?build=XYZ"]);
  });

  it("no-op when the params are absent", () => {
    const calls = stubWindow("https://x.test/warframe-builder?build=XYZ");
    stripLoadoutParams();
    expect(calls).toEqual([]);
  });
});
