/**
 * Wiki-verified Helminth damage-buff slot restriction.
 *
 * Body text (wins over infobox/codex) from:
 *   https://wiki.warframe.com/w/Helminth  (§ Damage buff restrictions)
 *   https://wiki.warframe.com/w/Roar
 *   https://wiki.warframe.com/w/Eclipse
 *   https://wiki.warframe.com/w/Xata%27s_Whisper
 *
 * Infused Eclipse, Roar, or Xata's Whisper may only replace the designated
 * native damage-buff ability on the listed Warframes. Abilities and Warframes
 * not on those lists are unrestricted — the Helminth page cites Shooting
 * Gallery or Smite sitting alongside Chroma's Vex Armor in any slot.
 */

export const HELMINTH_EXCLUSIVE_DAMAGE_BUFF_NAMES = [
  "Eclipse",
  "Roar",
  "Xata's Whisper",
] as const;

/** Base Warframe id (Prime/Umbra stripped) → designated native ability. */
export const HELMINTH_EXCLUSIVE_HOST_ABILITIES: Record<string, string> = {
  chroma: "Vex Armor",
  cyte_09: "Resupply",
  mirage: "Eclipse",
  octavia: "Amp",
  oraxia: "Silken Stride",
  rhino: "Roar",
  temple: "Ripper's Wail",
  uriel: "Demonium",
  xaku: "Xata's Whisper",
};

export function helminthRestrictionBaseId(warframeId: string): string {
  return warframeId.replace(/_prime$/i, "").replace(/_umbra$/i, "");
}

export function isHelminthExclusiveDamageBuff(abilityName: string): boolean {
  return (HELMINTH_EXCLUSIVE_DAMAGE_BUFF_NAMES as readonly string[]).includes(abilityName);
}

export function designatedExclusiveDamageBuffName(hostWarframeId: string): string | undefined {
  return HELMINTH_EXCLUSIVE_HOST_ABILITIES[helminthRestrictionBaseId(hostWarframeId)];
}

export function designatedExclusiveDamageBuffSlot(
  hostWarframeId: string,
  hostAbilities: readonly { name: string }[],
): number | undefined {
  const required = designatedExclusiveDamageBuffName(hostWarframeId);
  if (!required) return undefined;
  const index = hostAbilities.findIndex((a) => a.name === required);
  return index >= 0 ? index : undefined;
}

export function canInfuseHelminthDamageBuff(args: {
  helminthAbilityName: string;
  hostWarframeId?: string | null;
  hostAbilities: readonly { name: string }[];
  slot: number;
}): boolean {
  return helminthDamageBuffRestrictionReason(args) == null;
}

/** Human-readable block reason, or null when the infusion is allowed. */
export function helminthDamageBuffRestrictionReason(args: {
  helminthAbilityName: string;
  hostWarframeId?: string | null;
  hostAbilities: readonly { name: string }[];
  slot: number;
}): string | null {
  if (!isHelminthExclusiveDamageBuff(args.helminthAbilityName)) return null;
  if (!args.hostWarframeId) return null;
  const required = designatedExclusiveDamageBuffName(args.hostWarframeId);
  if (!required) return null;
  const slot = designatedExclusiveDamageBuffSlot(args.hostWarframeId, args.hostAbilities);
  if (slot == null) {
    return `On this Warframe, ${args.helminthAbilityName} can only replace ${required}.`;
  }
  if (args.slot !== slot) {
    return `On this Warframe, ${args.helminthAbilityName} can only replace ${required}.`;
  }
  return null;
}
