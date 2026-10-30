import { describe, expect, it } from "vitest";
import { hasBuildLinkParam, hrefForCatalogPick, hrefWithWeaponParam, weaponIdFromParams } from "./weapon-url-param";

describe("weapon url param", () => {
  it("reads ?weapon= only when no build link param is present", () => {
    expect(weaponIdFromParams(new URLSearchParams("weapon=soma_prime"))).toBe("soma_prime");
    expect(weaponIdFromParams(new URLSearchParams("weapon="))).toBeNull();
    expect(weaponIdFromParams(new URLSearchParams(""))).toBeNull();
    for (const p of ["build=abc", "buildId=1", "localBuild=x", "loadout=l&slot=primary"]) {
      expect(hasBuildLinkParam(new URLSearchParams(p))).toBe(true);
      expect(weaponIdFromParams(new URLSearchParams(`${p}&weapon=soma`))).toBeNull();
    }
  });

  it("sets and removes the param, keeping others", () => {
    expect(hrefWithWeaponParam("/weapon-builder", "soma")).toBe("/weapon-builder?weapon=soma");
    expect(hrefWithWeaponParam("/weapon-builder?weapon=a&x=1", "b")).toBe("/weapon-builder?weapon=b&x=1");
    expect(hrefWithWeaponParam("/weapon-builder?weapon=a", null)).toBe("/weapon-builder");
    expect(hrefWithWeaponParam("/weapon-builder?x=1&weapon=a#h", null)).toBe("/weapon-builder?x=1#h");
  });

  it("a catalog pick drops build link params", () => {
    expect(hrefForCatalogPick("/weapon-builder?build=XYZ", "soma")).toBe("/weapon-builder?weapon=soma");
    expect(hrefForCatalogPick("/weapon-builder?buildId=1&localBuild=2", "soma")).toBe("/weapon-builder?weapon=soma");
  });
});
