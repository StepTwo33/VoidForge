/** Warframe builder layout: 0 = primary Aura, 1–8 regular, 9 = Exilus, 10 = Jade second Aura. */
export const WARFRAME_AURA_SLOT = 0;
export const WARFRAME_SECOND_AURA_SLOT = 10;

const JADE_AURA_SLOTS = [WARFRAME_AURA_SLOT, WARFRAME_SECOND_AURA_SLOT] as const;
const DEFAULT_AURA_SLOTS = [WARFRAME_AURA_SLOT] as const;

/** Jade’s passive grants two Aura slots; everyone else has one. */
export function getWarframeAuraSlotIndices(warframeId: string | null | undefined): readonly number[] {
  if (!warframeId) return DEFAULT_AURA_SLOTS;
  const base = warframeId.replace(/_prime$/i, "").replace(/_umbra$/i, "");
  return base === "jade" ? JADE_AURA_SLOTS : DEFAULT_AURA_SLOTS;
}

export function warframeHasSecondAuraSlot(warframeId: string | null | undefined): boolean {
  return getWarframeAuraSlotIndices(warframeId).length > 1;
}
