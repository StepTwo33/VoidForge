/**
 * Round 53: the wiki Glaive weapon-type page says "Thrown glaive has a guaranteed Impact proc",
 * so every glaive throw forces Impact (status row only, no damage), except Falcor's Charged Throw,
 * whose own page says "Charged throws have a forced Electricity proc."
 */
import { describe, expect, it } from "vitest";
import { WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";

const alt = (id: string, label: string) => WEAPON_ALT_FIRE[id].find((m) => m.label === label)!;
const GLAIVES = [
  "cerata", "coda_pathocyst", "falcor", "glaive", "glaive_prime", "halikar",
  "halikar_wraith", "kestrel", "kestrel_prime", "orvius", "pathocyst", "xoris",
];

describe("Round 53: thrown glaives force Impact", () => {
  it.each(GLAIVES)("%s Throw forces Impact", (id) => {
    expect(alt(id, "Throw").forcedProcs).toContain("Impact");
  });

  it.each(GLAIVES.filter((id) => id !== "falcor"))("%s Charged Throw forces Impact", (id) => {
    expect(alt(id, "Charged Throw").forcedProcs).toContain("Impact");
  });

  it("Falcor Charged Throw keeps its page's forced Electricity only", () => {
    expect(alt("falcor", "Charged Throw").forcedProcs).toEqual(["Electricity"]);
  });

  it("existing forced procs are kept (Kestrel Ragdoll, Cerata Toxin, Glaive Prime Slash)", () => {
    expect(alt("kestrel", "Throw").forcedProcs).toEqual(["Ragdoll", "Impact"]);
    expect(alt("kestrel_prime", "Charged Throw").forcedProcs).toEqual(["Ragdoll", "Impact"]);
    expect(alt("cerata", "Charged Throw").forcedProcs).toEqual(["Toxin", "Impact"]);
    expect(alt("glaive_prime", "Throw").forcedProcs).toEqual(["Impact", "Slash"]);
  });

  it("added rows cite the weapon-type page", () => {
    for (const [id, label] of [["kestrel", "Throw"], ["orvius", "Throw"], ["pathocyst", "Charged Throw"]]) {
      expect(alt(id, label).note, `${id} ${label}`).toContain("Thrown glaive has a guaranteed Impact proc");
    }
  });
});
