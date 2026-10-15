import { describe, expect, it } from "vitest";
import { ampScaffolds } from "@/data/modular-weapons";

// wiki Module:Weapons/data/modular
const sc = (id: string) => ampScaffolds.find((x) => x.id === id)!;
describe("amp scaffolds", () => {
  it("Phahd fires at 1.67/s, Shraksun at 1.33/s", () => {
    expect(sc("amp_phahd").fireRate).toBe(1.67);
    expect(sc("amp_shraksun").fireRate).toBe(1.33);
  });
  it("Dissic sums direct 15 + explosion 6600 + 9 fragments × 300 = 9315", () => {
    expect(sc("amp_dissic").damage).toBe(15 + 6600 + 9 * 300);
  });
});
