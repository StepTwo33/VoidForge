import { isRivenBuff } from "@/lib/riven/riven-validation";

/** Riven dialog rows: buffs and the curse are kept as magnitudes; the sign comes from the stat. */
export interface RivenFormStat {
  key: string;
  value: number;
}

/** Recoil is the one stat where a negative roll is the buff. */
function signed(key: string, magnitude: number, curse: boolean): number {
  const m = Math.abs(magnitude);
  const buffSign = key === "recoil" ? -1 : 1;
  return curse ? -buffSign * m : buffSign * m;
}

/** Builder stat map → dialog rows (a -recoil roll is a buff, +recoil a curse). */
export function splitRivenStats(stats: Record<string, number>): {
  positives: RivenFormStat[];
  negative: RivenFormStat | null;
} {
  const positives: RivenFormStat[] = [];
  let negative: RivenFormStat | null = null;
  for (const [key, value] of Object.entries(stats)) {
    if (isRivenBuff(key, value)) positives.push({ key, value: Math.abs(value) });
    else negative = { key, value: Math.abs(value) };
  }
  return { positives, negative };
}

/** Dialog rows → builder stat map with the right signs. */
export function buildRivenStats(positives: RivenFormStat[], negative: RivenFormStat | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of positives) if (p.key) out[p.key] = signed(p.key, p.value, false);
  if (negative?.key) out[negative.key] = signed(negative.key, negative.value, true);
  return out;
}

/** The name is saved exactly as typed; only an empty field falls back to "<Weapon> <auto suffix>". */
export function rivenDisplayName(weaponName: string, autoSuffix: string, customName?: string | null): string {
  const typed = (customName ?? "").trim();
  return typed || `${weaponName} ${autoSuffix}`.trim();
}
