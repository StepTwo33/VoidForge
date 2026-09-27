import { describe, expect, it } from "vitest";
import { decodeBuild, encodeBuild } from "@/lib/builds/build-url";
import { adversaryRankFromFormas, weaponModCapacity } from "@/lib/weapons/weapon-progenitor";

describe("adversary weapon mod capacity", () => {
  it("keeps a normal weapon at 30 or 60", () => {
    expect(weaponModCapacity({ id: "braton" }, 5, false)).toBe(30);
    expect(weaponModCapacity({ id: "braton" }, 5, true)).toBe(60);
  });

  it("raises Kuva, Tenet, and Coda capacity with Forma rank", () => {
    expect(adversaryRankFromFormas(0)).toBe(30);
    expect(adversaryRankFromFormas(5)).toBe(40);
    expect(weaponModCapacity({ id: "kuva_bramma" }, 0, true)).toBe(60);
    expect(weaponModCapacity({ id: "tenet_envoy" }, 5, false)).toBe(40);
    expect(weaponModCapacity({ id: "coda_bassocyst" }, 5, true)).toBe(80);
    expect(weaponModCapacity({ id: "dual_coda_torxica" }, 3, true)).toBe(72);
  });

  it("round-trips Forma count on a share link", () => {
    const decoded = decodeBuild(
      encodeBuild({
        type: "weapon",
        itemId: "kuva_bramma",
        mods: [],
        adversaryFormas: 5,
        hasOrokinCatalyst: true,
      }),
    );
    expect(decoded?.adversaryFormas).toBe(5);
    expect(decoded?.hasOrokinCatalyst).toBe(true);
  });
});
