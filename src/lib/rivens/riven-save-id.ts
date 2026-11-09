/** Always send the local id. Dropping `riven_*` ids made the cloud insert a second row. */
export function rivenSaveId(localId: string): string {
  return localId;
}

/** If the account row has a different id, the local `riven_*` copy is the one to delete. */
export function localRivenAfterCloudSave<T extends { id: string }>(
  local: T,
  cloudId: string | null | undefined,
): { saved: T; removedId?: string } {
  if (!cloudId || cloudId === local.id) return { saved: local };
  return { saved: { ...local, id: cloudId }, removedId: local.id };
}
