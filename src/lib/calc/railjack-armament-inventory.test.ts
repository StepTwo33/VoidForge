import { describe, expect, it } from "vitest";
import { allOrdnance, allTurrets, findRailjackArmament } from "@/data/railjack";

describe("railjack armament inventory", () => {
  it("includes Cryophon and Glazio house sets", () => {
    for (const house of ["sigma", "lavan", "vidar", "zetki"]) {
      expect(allTurrets.some((t) => t.id === `${house}_cryophon`)).toBe(true);
      expect(allTurrets.some((t) => t.id === `${house}_glazio`)).toBe(true);
    }
  });

  it("includes Lavan Photor / Pulsar / Talyn Mk III", () => {
    expect(findRailjackArmament("lavan_photor")?.damage).toBe(290);
    expect(findRailjackArmament("lavan_pulsar")?.damage).toBe(631);
    expect(findRailjackArmament("lavan_talyn")?.damage).toBe(316);
  });

  it("wiki-locks Photor Mk III totals (Sigma / Vidar / Zetki)", () => {
    expect(findRailjackArmament("sigma_photor")).toMatchObject({
      damage: 270,
      critChance: 0.12,
      fireRate: 12,
    });
    expect(findRailjackArmament("vidar_photor")?.damage).toBe(270);
    expect(findRailjackArmament("zetki_photor")?.damage).toBe(324);
  });

  it("ordnance is Sigma-only Mk tiers (no house wreckage)", () => {
    expect(allOrdnance.every((o) => o.house === "sigma")).toBe(true);
    expect(findRailjackArmament("sigma_milati_mk3")?.damage).toBe(52884);
    expect(findRailjackArmament("sigma_tycho_seeker_mk3")?.critChance).toBe(0.5);
    expect(findRailjackArmament("sigma_galvarc_mk3")?.damage).toBe(1901);
    expect(allOrdnance.some((o) => o.id.startsWith("vidar_") || o.id.startsWith("zetki_"))).toBe(false);
    expect(findRailjackArmament("zetki_tycho_seeker")?.id).toBe("sigma_tycho_seeker_mk3");
  });

  it("generates Mk IV for Cryophon / Glazio house turrets", () => {
    expect(findRailjackArmament("zetki_cryophon_mk4")?.tier).toBe("mk4");
    expect(findRailjackArmament("lavan_glazio_mk4")?.damage).toBe(Math.round(2317 * 1.5));
  });
});
