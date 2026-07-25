import type { Mod } from "@/lib/types";

/** Archwing ability augments (Elytron / Itzal / Odonata, etc.). */
export function isArchwingAugment(
  mod: Pick<Mod, "category" | "subCategory">,
): boolean {
  return mod.category === "augment" && mod.subCategory === "archwing";
}

/** Canonicalize archwing ids; maps legacy `odenata` misspelling → `odonata`. */
export function normalizeArchwingId(archwingId: string): string {
  return archwingId.replace(/^odenata/i, "odonata");
}

export function archwingAugmentMatchesArchwing(
  mod: Pick<Mod, "warframeId" | "category" | "subCategory">,
  selectedArchwingId: string,
): boolean {
  if (!isArchwingAugment(mod) || !mod.warframeId) return false;
  const candidates = new Set([
    selectedArchwingId,
    normalizeArchwingId(selectedArchwingId),
  ]);
  const mid = normalizeArchwingId(mod.warframeId);
  return candidates.has(mid) || candidates.has(mod.warframeId);
}

/** Archwing augments only appear in the archwing builder for the selected frame. */
export function archwingAugmentEligibleInBuilder(
  mod: Mod,
  builderCategory: string,
  selectedArchwingId?: string,
): boolean {
  if (!isArchwingAugment(mod)) return true;
  if (builderCategory !== "archwing") return false;
  if (!selectedArchwingId) return false;
  return archwingAugmentMatchesArchwing(mod, selectedArchwingId);
}
