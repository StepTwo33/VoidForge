import { describe, expect, it } from "vitest";
import { buildZaw, zawGrips, zawLinks, zawStrikes } from "@/data/modular-weapons";

// wiki Zaw: final speed = Strike speed + Grip base speed + Link speed; Jai II links are −8 damage.
const s = (id: string) => zawStrikes.find((x) => x.id === id)!;
const g = (id: string) => zawGrips.find((x) => x.id === id)!;
const l = (id: string) => zawLinks.find((x) => x.id === id)!;

describe("zaw speed and Jai II damage", () => {
  it("Balla + Peye + Jai: 0.083 + 1.000 + 0.083 = 1.166", () => {
    expect(buildZaw(s("zaw_balla"), g("zaw_grip_peye"), l("zaw_link_jai")).fireRate).toBeCloseTo(1.166, 3);
  });
  it("Kronsh + Peye + Jai: −0.067 + 1.000 + 0.083 = 1.016", () => {
    expect(buildZaw(s("zaw_kronsh"), g("zaw_grip_peye"), l("zaw_link_jai")).fireRate).toBeCloseTo(1.016, 3);
  });
  it("Cyath (0) + Laka (0.917) + Ruhang (−0.067) = 0.85", () => {
    expect(buildZaw(s("zaw_cyath"), g("zaw_grip_laka"), l("zaw_link_ruhang")).fireRate).toBeCloseTo(0.85, 3);
  });
  it("Balla + Peye + Jai II damage: 224 − 4 − 8 = 212", () => {
    expect(buildZaw(s("zaw_balla"), g("zaw_grip_peye"), l("zaw_link_jai_2")).damage).toBe(212);
    expect(l("zaw_link_vargeet_jai_2").damageBonus).toBe(-8);
    expect(l("zaw_link_ekwana_jai_2").damageBonus).toBe(-8);
  });
});
