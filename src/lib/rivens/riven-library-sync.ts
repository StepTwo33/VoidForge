import { allWeapons } from "@/data/weapons";
import { hasClientSession } from "@/lib/auth/client-session";
import {
  saveRiven as saveCloudRiven,
  deleteSavedRiven as deleteCloudRiven,
  type SavedRiven as CloudSavedRiven,
} from "@/lib/riven/saved-rivens";
import { rivenDrainFromRank, rivenRankFromDrain } from "@/lib/riven/riven-validation";
import { getRivenModIdForWeapon } from "@/lib/weapons/riven-weapon-type";
import { getEffectiveRivenWeaponType, resolveRivenWeapon } from "@/lib/weapons/riven-family";
import { localRivenAfterCloudSave, rivenSaveId } from "./riven-save-id";
import { deleteRiven, evaluateSavedRiven, saveRiven, type SavedRiven } from "./riven-storage";

/** Mastery rank shown when neither the account nor this device knows it. */
export const UNKNOWN_RIVEN_MASTERY = 8;

/**
 * Library card for one account riven. Rank comes from the stored drain (drain = 10 + rank).
 * Rerolls and mastery rank come from the account when stored, else from this device's copy,
 * so a cloud refresh never resets them to made-up defaults. The name is kept exactly as saved.
 */
export function cloudRivenToLocal(c: CloudSavedRiven, local?: SavedRiven): SavedRiven {
  const w = resolveRivenWeapon(c.weaponId) ?? allWeapons.find((x) => x.id === c.weaponId) ?? null;
  const weaponType = w ? getEffectiveRivenWeaponType(w) ?? "Rifle" : local?.weaponType ?? "Rifle";
  const weaponName = w?.name ?? local?.weaponName ?? c.weaponId;
  const rank = rivenRankFromDrain(c.drain);
  const rerolls = c.rerolls ?? local?.rerolls ?? 0;
  const masteryRank = c.masteryRank ?? local?.masteryRank ?? UNKNOWN_RIVEN_MASTERY;
  const evalRes = evaluateSavedRiven(weaponName, weaponType, c.stats, rank, rerolls, c.polarity);
  return {
    ...(local ?? {}),
    id: c.id,
    name: c.name,
    weaponId: c.weaponId,
    weaponName,
    weaponCategory: w?.category ?? local?.weaponCategory ?? "primary",
    weaponType,
    polarity: c.polarity,
    rank,
    rerolls,
    masteryRank,
    stats: c.stats,
    displayStats: evalRes.displayStats,
    score: evalRes.score,
    grade: evalRes.grade,
    gradeColor: evalRes.color,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

/** Local library plus account rivens (account wins for stats, see {@link cloudRivenToLocal}). */
export function mergeCloudRivens(local: SavedRiven[], cloud: CloudSavedRiven[]): SavedRiven[] {
  const map = new Map<string, SavedRiven>(local.map((r) => [r.id, r]));
  for (const c of cloud) map.set(c.id, cloudRivenToLocal(c, map.get(c.id)));
  return Array.from(map.values());
}

/** What the account API gets for a library riven: real drain from its rank, plus rerolls and MR. */
export function cloudPayloadFor(riven: SavedRiven, modId: string) {
  return {
    id: rivenSaveId(riven.id),
    weaponId: riven.weaponId,
    name: riven.name,
    modId,
    stats: riven.stats,
    polarity: riven.polarity,
    drain: rivenDrainFromRank(riven.rank ?? 8),
    rerolls: riven.rerolls ?? 0,
    masteryRank: riven.masteryRank ?? UNKNOWN_RIVEN_MASTERY,
  };
}

/** Saves on this device, then to the account when signed in. Returns the id the riven ends up with. */
export async function saveLibraryRiven(riven: SavedRiven): Promise<string> {
  saveRiven(riven);
  try {
    if (!(await hasClientSession())) return riven.id;
    const weapon = resolveRivenWeapon(riven.weaponId);
    const modId = getRivenModIdForWeapon(weapon);
    if (!modId) return riven.id;
    const cloud = await saveCloudRiven(cloudPayloadFor(riven, modId));
    const adopted = localRivenAfterCloudSave(riven, cloud?.id);
    if (adopted.removedId) {
      deleteRiven(adopted.removedId);
      saveRiven(adopted.saved);
    }
    return adopted.saved.id;
  } catch {
    return riven.id; // the local save already happened
  }
}

/** Deletes on this device and from the account when signed in. */
export async function deleteLibraryRiven(id: string): Promise<void> {
  deleteRiven(id);
  try {
    if (await hasClientSession()) await deleteCloudRiven(id);
  } catch {
    // local delete already happened
  }
}
