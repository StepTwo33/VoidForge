import { describe, expect, it } from "vitest";
import { hasBuildLinkParam, hrefForWarframeCatalogPick, hrefWithWarframeParam, warframeIdFromParams } from "./warframe-url-param";

describe("warframe url param", () => {
  it("reads ?warframe= only when no build link param is present", () => {
    expect(warframeIdFromParams(new URLSearchParams("warframe=mesa_prime"))).toBe("mesa_prime");
    expect(warframeIdFromParams(new URLSearchParams("warframe="))).toBeNull();
    expect(warframeIdFromParams(new URLSearchParams(""))).toBeNull();
    for (const p of ["build=abc", "buildId=1", "localBuild=x", "loadout=l&slot=primary"]) {
      expect(hasBuildLinkParam(new URLSearchParams(p))).toBe(true);
      expect(warframeIdFromParams(new URLSearchParams(`${p}&warframe=mesa`))).toBeNull();
    }
  });

  it("sets and removes the param, keeping others", () => {
    expect(hrefWithWarframeParam("/warframe-builder", "mesa")).toBe("/warframe-builder?warframe=mesa");
    expect(hrefWithWarframeParam("/warframe-builder?warframe=a&x=1", "b")).toBe("/warframe-builder?warframe=b&x=1");
    expect(hrefWithWarframeParam("/warframe-builder?warframe=a", null)).toBe("/warframe-builder");
    expect(hrefWithWarframeParam("/warframe-builder?x=1&warframe=a#h", null)).toBe("/warframe-builder?x=1#h");
  });

  it("a catalog pick drops build link params", () => {
    expect(hrefForWarframeCatalogPick("/warframe-builder?build=XYZ", "mesa")).toBe("/warframe-builder?warframe=mesa");
    expect(hrefForWarframeCatalogPick("/warframe-builder?buildId=1&localBuild=2", "mesa")).toBe("/warframe-builder?warframe=mesa");
  });
});
