"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PageShell,
  PageMain,
  PageHero,
  FilterChip,
  ContentPanel,
  EmptyState,
} from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { GameAssetImage } from "@/components/game-asset-image";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import {
  deleteBuild,
  deleteCloudBuild,
  type SavedBuild,
} from "@/lib/builds/build-storage";
import { deleteLoadout, getLoadouts } from "@/lib/builds/loadouts";
import { extractBuildItemId } from "@/lib/builds/build-types";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";
import {
  isDeviceBuildId,
  libraryOpenUrl,
  mergeAllYoursLibrary,
  ownershipBadge,
  renameYoursBuild,
} from "@/lib/builds/yours-builds";
import { Edit2, FolderOpen, Library, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TypeFilter =
  | "all"
  | "weapon"
  | "warframe"
  | "companion"
  | "modular"
  | "archwing"
  | "railjack"
  | "loadout";

const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "weapon", label: "Weapon" },
  { id: "warframe", label: "Warframe" },
  { id: "companion", label: "Companion" },
  { id: "modular", label: "Modular" },
  { id: "archwing", label: "Archwing" },
  { id: "railjack", label: "Railjack" },
  { id: "loadout", label: "Loadout" },
];

function formatUpdated(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 30 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function BuildsLibraryPage() {
  const { confirm, prompt } = useConfirmDialog();
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBuilds(await mergeAllYoursLibrary());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return builds.filter((b) => {
      if (typeFilter !== "all" && b.type !== typeFilter) return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q);
    });
  }, [builds, query, typeFilter]);

  const handleRename = async (build: SavedBuild) => {
    const next = await prompt({
      title: "Rename build",
      description:
        ownershipBadge(build.id) === "Account"
          ? "This updates the name on your account (and Community listing if it’s public)."
          : "This updates the name saved on this device.",
      inputLabel: "Name",
      defaultValue: build.name,
      placeholder: "Build name",
      confirmLabel: "Save",
    });
    if (next === null) return;
    setRenamingId(build.id);
    try {
      const result = await renameYoursBuild(build, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Name updated");
      await refresh();
    } catch {
      toast.error("Could not rename build");
    } finally {
      setRenamingId(null);
    }
  };

  const handleDelete = async (build: SavedBuild) => {
    const ok = await confirm({
      title: "Delete build?",
      description: `“${build.name}” will be removed from this library${
        isDeviceBuildId(build.id) ? "" : " and your account"
      }.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;

    setDeletingId(build.id);
    try {
      if (build.type === "loadout") {
        const local = getLoadouts().find((l) => l.id === build.id || l.cloudId === build.id);
        const cloudId = local?.cloudId ?? (!isDeviceBuildId(build.id) ? build.id : null);
        if (local) deleteLoadout(local.id);
        else if (isDeviceBuildId(build.id)) deleteLoadout(build.id);
        if (cloudId) await deleteCloudBuild(cloudId);
      } else {
        deleteBuild(build.id);
        if (!isDeviceBuildId(build.id)) await deleteCloudBuild(build.id);
      }
      toast.success("Build deleted");
      await refresh();
    } catch {
      toast.error("Could not delete build");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageShell>
      <PageMain maxWidth="lg">
        <PageHero
          icon={Library}
          accent="primary"
          title="Your Builds"
          description="Everything saved on this device and your account — single builds and full loadouts."
          actions={
            <Link
              href="/loadouts"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <FolderOpen className="h-4 w-4" />
              Edit kits in Loadouts
            </Link>
          }
        />

        <ContentPanel className="mb-4 !p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="min-h-11 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                active={typeFilter === f.id}
                onClick={() => setTypeFilter(f.id)}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </ContentPanel>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your builds…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Library}
            title={builds.length === 0 ? "No builds yet" : "No matches"}
            description={
              builds.length === 0
                ? "Save a build in any builder, or create a loadout kit. Community builds live on Discover."
                : "Try a different filter or search."
            }
          >
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/weapon-builder"
                className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Weapon Builder
              </Link>
              <Link
                href="/loadouts"
                className="inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm hover:bg-accent"
              >
                Loadouts
              </Link>
              <Link
                href="/discover"
                className="inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm hover:bg-accent"
              >
                Discover
              </Link>
            </div>
          </EmptyState>
        ) : (
          <ul className="space-y-1.5">
            {filtered.map((build) => {
              const itemId = extractBuildItemId(build.type, build.data);
              const display = resolveBuildItemDisplay(build.type, itemId);
              const href = libraryOpenUrl(build);
              const badge = ownershipBadge(build.id);
              return (
                <li key={`${build.type}:${build.id}`}>
                  <ContentPanel className="!p-0 overflow-hidden">
                    <div className="flex items-stretch gap-0">
                      <Link
                        href={href}
                        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 transition-colors hover:bg-accent/40 sm:px-4"
                      >
                        {display.itemImage ? (
                          <GameAssetImage
                            src={display.itemImage}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 shrink-0 rounded-md bg-muted/30 object-contain"
                            hideOnError
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/30 text-[10px] font-medium text-muted-foreground">
                            {display.typeLabel.slice(0, 3)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{build.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {display.typeLabel}
                            {display.itemName ? ` · ${display.itemName}` : ""}
                            {" · "}
                            {formatUpdated(build.updatedAt ?? build.createdAt)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                            badge === "Device"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          {badge}
                        </span>
                      </Link>
                      <button
                        type="button"
                        disabled={renamingId === build.id || deletingId === build.id}
                        onClick={() => void handleRename(build)}
                        className="inline-flex w-11 shrink-0 items-center justify-center border-l border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                        aria-label={`Rename ${build.name}`}
                      >
                        {renamingId === build.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit2 className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={renamingId === build.id || deletingId === build.id}
                        onClick={() => void handleDelete(build)}
                        className="inline-flex w-11 shrink-0 items-center justify-center border-l border-border/60 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        aria-label={`Delete ${build.name}`}
                      >
                        {deletingId === build.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </ContentPanel>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need a full kit editor?{" "}
          <Link href="/loadouts" className="text-primary hover:underline">
            Open Loadouts
          </Link>
        </p>
      </PageMain>
    </PageShell>
  );
}
