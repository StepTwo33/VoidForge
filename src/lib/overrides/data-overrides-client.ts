import {
  DataOverride,
  getOverrides,
  setOverrideCache,
  notifyDataOverridesUpdated,
  generateOverrideId,
  mergeOverrideLists,
  OVERRIDE_CATEGORIES,
  type OverrideCategory,
} from "@/lib/overrides/data-overrides";

const LEGACY_STORAGE_KEY = "framehub_data_overrides";

let loadPromise: Promise<DataOverride[]> | null = null;

function overrideTargetKey(o: Pick<DataOverride, "targetType" | "targetId">): string {
  return `${o.targetType}:${o.targetId}`;
}

function upsertInCache(saved: DataOverride) {
  const next = getOverrides().filter((o) => overrideTargetKey(o) !== overrideTargetKey(saved));
  next.push(saved);
  setOverrideCache(next);
}

/** Overrides still stored in this browser from before the shared DB migration. */
export function readLegacyLocalOverrides(): DataOverride[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DataOverride[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (o) =>
        o &&
        typeof o.id === "string" &&
        typeof o.targetType === "string" &&
        typeof o.targetId === "string" &&
        (OVERRIDE_CATEGORIES as readonly string[]).includes(o.targetType),
    );
  } catch {
    return [];
  }
}

export function getLegacyLocalOverrideCount(): number {
  return readLegacyLocalOverrides().length;
}

async function isStaffSession(): Promise<boolean> {
  try {
    const session = await fetch("/api/auth/session").then((r) => r.json());
    const role = session?.user?.role;
    return role === "admin" || role === "moderator";
  } catch {
    return false;
  }
}

async function fetchServerOverrides(): Promise<DataOverride[]> {
  const res = await fetch("/api/data-overrides", { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { overrides?: DataOverride[] };
  return Array.isArray(data.overrides) ? data.overrides : [];
}

function pendingLegacyOverrides(server: DataOverride[], legacy: DataOverride[]): DataOverride[] {
  const serverKeys = new Set(server.map(overrideTargetKey));
  return legacy.filter((o) => !serverKeys.has(overrideTargetKey(o)));
}

async function syncLegacyToServer(serverList: DataOverride[], legacyList: DataOverride[]): Promise<DataOverride[]> {
  if (legacyList.length === 0) return serverList;
  if (!(await isStaffSession())) return mergeOverrideLists(serverList, legacyList);

  const pending = pendingLegacyOverrides(serverList, legacyList);
  if (pending.length === 0) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return serverList;
  }

  const res = await fetch("/api/data-overrides", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(legacyList),
  });
  if (!res.ok) {
    return mergeOverrideLists(serverList, legacyList);
  }

  const refreshed = await fetchServerOverrides();
  const stillPending = pendingLegacyOverrides(refreshed, legacyList);
  if (stillPending.length === 0) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return refreshed;
  }

  return mergeOverrideLists(refreshed, stillPending);
}

/** Fetch shared overrides and merge any legacy browser copy until uploaded. */
export async function loadSharedOverrides(): Promise<DataOverride[]> {
  if (typeof window === "undefined") return [];
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const legacyList = readLegacyLocalOverrides();
      let serverList: DataOverride[] = [];
      try {
        serverList = await fetchServerOverrides();
      } catch {
        serverList = [];
      }

      const merged = await syncLegacyToServer(serverList, legacyList);
      setOverrideCache(merged);
      notifyDataOverridesUpdated();
      return merged;
    } catch {
      const legacy = readLegacyLocalOverrides();
      if (legacy.length > 0) {
        setOverrideCache(legacy);
        notifyDataOverridesUpdated();
        return legacy;
      }
      return getOverrides();
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/** Staff: upload this browser's legacy localStorage overrides to the shared server. */
export async function uploadLegacyLocalOverrides(): Promise<{ imported: number; remaining: number }> {
  const legacyList = readLegacyLocalOverrides();
  if (legacyList.length === 0) {
    return { imported: 0, remaining: 0 };
  }

  const res = await fetch("/api/data-overrides", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(legacyList),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.error === "string" ? err.error : "Failed to upload browser overrides");
  }

  const data = (await res.json()) as { imported?: number };
  const refreshed = await fetchServerOverrides();
  const stillPending = pendingLegacyOverrides(refreshed, legacyList);
  if (stillPending.length === 0) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  setOverrideCache(stillPending.length === 0 ? refreshed : mergeOverrideLists(refreshed, stillPending));
  notifyDataOverridesUpdated();
  return { imported: data.imported ?? 0, remaining: stillPending.length };
}

export async function persistOverride(override: DataOverride): Promise<DataOverride> {
  const res = await fetch("/api/data-overrides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(override),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.error === "string" ? err.error : "Failed to save override");
  }
  const saved = (await res.json()) as DataOverride;
  upsertInCache(saved);
  notifyDataOverridesUpdated();
  return saved;
}

export async function removeOverride(id: string): Promise<void> {
  const res = await fetch(`/api/data-overrides/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.error === "string" ? err.error : "Failed to delete override");
  }
  setOverrideCache(getOverrides().filter((o) => o.id !== id));
  notifyDataOverridesUpdated();
}

export async function removeOverrides(ids: string[]): Promise<number> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return 0;
  if (unique.length === 1) {
    await removeOverride(unique[0]!);
    return 1;
  }
  const res = await fetch("/api/data-overrides", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: unique }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.error === "string" ? err.error : "Failed to delete overrides");
  }
  const data = (await res.json()) as { deleted?: number };
  const idSet = new Set(unique);
  setOverrideCache(getOverrides().filter((o) => !idSet.has(o.id)));
  notifyDataOverridesUpdated();
  return data.deleted ?? unique.length;
}

export async function importSharedOverrides(json: string): Promise<number> {
  let incoming: unknown;
  try {
    incoming = JSON.parse(json);
  } catch {
    return 0;
  }
  const list = Array.isArray(incoming) ? incoming : [];
  const res = await fetch("/api/data-overrides", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });
  if (!res.ok) return 0;
  const data = (await res.json()) as { imported?: number };
  await loadSharedOverrides();
  return data.imported ?? 0;
}

export function exportSharedOverrides(): string {
  return JSON.stringify(getOverrides(), null, 2);
}

export function exportLegacyLocalOverrides(): string | null {
  const legacy = readLegacyLocalOverrides();
  if (legacy.length === 0) return null;
  return JSON.stringify(legacy, null, 2);
}

export function findExistingOverrideId(
  targetType: OverrideCategory,
  targetId: string,
): string | undefined {
  return getOverrides().find(
    (o) => o.targetType === targetType && o.targetId === targetId,
  )?.id;
}

export { generateOverrideId, OVERRIDE_CATEGORIES };
