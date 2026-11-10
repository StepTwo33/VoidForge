import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allHelminthAbilities } from "@/data/helminth";
import { resolveAbilitiesWithHelminth } from "@/lib/weapons/weapon-external-buffs";
import {
  HELMINTH_EXCLUSIVE_DAMAGE_BUFF_NAMES,
  HELMINTH_EXCLUSIVE_HOST_ABILITIES,
  canInfuseHelminthDamageBuff,
  designatedExclusiveDamageBuffSlot,
  helminthRestrictionBaseId,
} from "@/lib/builds/helminth-damage-buff-restriction";

/**
 * Sources (wiki body, which wins over infobox):
 *   https://wiki.warframe.com/w/Helminth  (§ Damage buff restrictions)
 *   https://wiki.warframe.com/w/Roar
 *   https://wiki.warframe.com/w/Eclipse
 *   https://wiki.warframe.com/w/Xata%27s_Whisper
 */
const WIKI_HOSTS: Record<string, string> = {
  chroma: "Vex Armor",
  "cyte-09": "Resupply",
  mirage: "Eclipse",
  octavia: "Amp",
  oraxia: "Silken Stride",
  rhino: "Roar",
  temple: "Ripper's Wail",
  uriel: "Demonium",
  xaku: "Xata's Whisper",
};

function requireHelminth(name: string) {
  const h = allHelminthAbilities.find((a) => a.name === name);
  if (!h) throw new Error(`Helminth ability not found: ${name}`);
  return h;
}

function framesMatching(baseId: string) {
  return allWarframes.filter((w) => helminthRestrictionBaseId(w.id) === baseId);
}

describe("Helminth damage-buff exclusivity (wiki Helminth page)", () => {
  it("the encoded host list matches the wiki body list, and every catalog variant has that ability", () => {
    expect(HELMINTH_EXCLUSIVE_DAMAGE_BUFF_NAMES).toEqual(["Eclipse", "Roar", "Xata's Whisper"]);
    const encoded = Object.fromEntries(
      Object.entries(HELMINTH_EXCLUSIVE_HOST_ABILITIES).map(([id, name]) => [
        id.replace("_", "-"),
        name,
      ]),
    );
    expect(encoded).toEqual(WIKI_HOSTS);

    for (const [baseId, ability] of Object.entries(HELMINTH_EXCLUSIVE_HOST_ABILITIES)) {
      const frames = framesMatching(baseId);
      expect(frames.length, `catalog frames for ${baseId}`).toBeGreaterThan(0);
      for (const wf of frames) {
        const slot = designatedExclusiveDamageBuffSlot(wf.id, wf.abilities);
        expect(slot, `${wf.id} ${ability}`).toBeDefined();
        expect(wf.abilities[slot!]?.name).toBe(ability);
      }
    }
  });

  it("Eclipse, Roar, and Xata's Whisper may only replace the designated slot on listed frames, including Primes", () => {
    const roar = requireHelminth("Roar");
    const chroma = allWarframes.find((w) => w.id === "chroma_prime");
    if (!chroma) throw new Error("chroma_prime missing");
    const vex = designatedExclusiveDamageBuffSlot("chroma_prime", chroma.abilities)!;
    expect(vex).toBe(2);
    expect(
      canInfuseHelminthDamageBuff({
        helminthAbilityName: roar.name,
        hostWarframeId: "chroma_prime",
        hostAbilities: chroma.abilities,
        slot: vex,
      }),
    ).toBe(true);
    expect(
      canInfuseHelminthDamageBuff({
        helminthAbilityName: roar.name,
        hostWarframeId: "chroma_prime",
        hostAbilities: chroma.abilities,
        slot: 0,
      }),
    ).toBe(false);

    const names = resolveAbilitiesWithHelminth(
      chroma.abilities,
      roar.id,
      0,
      "chroma_prime",
    ).map((a) => a.name);
    expect(names[0]).toBe("Spectral Scream");
    expect(names[2]).toBe("Vex Armor");

    const legal = resolveAbilitiesWithHelminth(
      chroma.abilities,
      roar.id,
      vex,
      "chroma_prime",
    ).map((a) => a.name);
    expect(legal[2]).toBe("Roar");
  });

  it("the same three abilities may occupy any slot on an unlisted Warframe", () => {
    const excalibur = allWarframes.find((w) => w.id === "excalibur");
    if (!excalibur) throw new Error("excalibur missing");
    const xata = requireHelminth("Xata's Whisper");
    for (const slot of [0, 1, 2, 3]) {
      expect(
        canInfuseHelminthDamageBuff({
          helminthAbilityName: xata.name,
          hostWarframeId: "excalibur",
          hostAbilities: excalibur.abilities,
          slot,
        }),
      ).toBe(true);
      const names = resolveAbilitiesWithHelminth(
        excalibur.abilities,
        xata.id,
        slot,
        "excalibur",
      ).map((a) => a.name);
      expect(names[slot]).toBe("Xata's Whisper");
    }
  });

  it("unlisted damage buffs such as Shooting Gallery or Smite are unrestricted even on Chroma", () => {
    const chroma = allWarframes.find((w) => w.id === "chroma");
    if (!chroma) throw new Error("chroma missing");
    for (const name of ["Shooting Gallery", "Smite"]) {
      const h = requireHelminth(name);
      for (const slot of [0, 1, 2, 3]) {
        expect(
          canInfuseHelminthDamageBuff({
            helminthAbilityName: h.name,
            hostWarframeId: "chroma",
            hostAbilities: chroma.abilities,
            slot,
          }),
        ).toBe(true);
      }
      const names = resolveAbilitiesWithHelminth(chroma.abilities, h.id, 0, "chroma").map(
        (a) => a.name,
      );
      expect(names[0]).toBe(name);
      expect(names[2]).toBe("Vex Armor");
    }
  });
});
