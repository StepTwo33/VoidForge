import { describe, expect, it } from "vitest";
import { builderCtaForFilter } from "./builder-cta";

describe("builderCtaForFilter (Round 54b /builds CTAs)", () => {
  it("sends each type chip to a distinct, matching builder", () => {
    const types = ["weapon", "warframe", "companion", "modular", "archwing", "railjack", "operator", "loadout"];
    const hrefs = types.map((t) => builderCtaForFilter(t).href);
    expect(hrefs).toEqual([
      "/weapon-builder",
      "/warframe-builder",
      "/companion-builder",
      "/modular-builder",
      "/archwing-builder",
      "/railjack-builder",
      "/operator-builder",
      "/loadouts",
    ]);
    expect(new Set(hrefs).size).toBe(types.length);
  });
  it("falls back to the Weapon Builder for All", () => {
    expect(builderCtaForFilter("all")).toEqual({ href: "/weapon-builder", label: "Open Weapon Builder" });
  });
});
