"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { PublicBuildRow } from "@/components/public-build-row";
import {
  PageShell,
  PageMain,
  PageHero,
  FilterChip,
  ContentPanel,
  EmptyState,
} from "@/components/page-shell";
import {
  Search,
  Loader2,
  Users,
  X,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { isAllowedBuildType } from "@/lib/builds/build-types";
import {
  buildDiscoverUrl,
  getBuildItemRef,
  type BuildSearchItem,
} from "@/lib/builds/build-search";
import { BUILD_TAG_OPTIONS, tagLabel } from "@/lib/builds/build-tags";
import {
  getDiscoverCategory,
  getDiscoverSubtypes,
  isValidDiscoverSlot,
  listDiscoverCatalogItems,
  type DiscoverCatalogItem,
  type DiscoverCategoryId,
} from "@/lib/builds/discover-subtypes";
import { DiscoverCategoryHub } from "@/components/discover/category-hub";
import { DiscoverItemGrid } from "@/components/discover/item-grid";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";

const TAG_TOOLTIPS: Record<string, string> = {
  eda: "EDA / ETA — Deep & Temporal Archimedea weekly challenge builds",
  steel_path: "Steel Path — high-level endless / SP content",
  level_cap: "Level Cap — enemy level scaling / endurance focus",
  budget: "Budget — low forma / accessible mods",
  beginner: "Beginner — easy to assemble and play",
  endgame: "Endgame — high investment / late-game content",
};

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") ?? "";
  const urlItemId = searchParams.get("itemId");
  const urlTypeRaw = searchParams.get("type");
  const urlType =
    urlTypeRaw && isAllowedBuildType(urlTypeRaw) ? urlTypeRaw : null;
  const urlSlotRaw = searchParams.get("slot");
  const urlTag = searchParams.get("tag") ?? "";
  const urlSort = searchParams.get("sort") === "popular" ? "popular" : "recent";

  const urlItem = useMemo((): BuildSearchItem | null => {
    if (!urlItemId || !urlType) return null;
    const fromCatalog = getBuildItemRef(urlType, urlItemId);
    if (fromCatalog) return fromCatalog;
    const display = resolveBuildItemDisplay(urlType, urlItemId);
    return {
      id: urlItemId,
      name: display.itemName ?? urlItemId,
      type: urlType,
    };
  }, [urlItemId, urlType]);

  const urlSlot = useMemo(() => {
    if (!urlType || !urlSlotRaw) return "all";
    return isValidDiscoverSlot(urlType, urlSlotRaw) ? urlSlotRaw : "all";
  }, [urlType, urlSlotRaw]);

  const inCategory = Boolean(urlType);
  const viewingItem = Boolean(urlItem);

  const [sort, setSort] = useState<"recent" | "popular">(urlSort);
  const [typeFilter, setTypeFilter] = useState<string | null>(urlType);
  const [slotFilter, setSlotFilter] = useState(urlSlot);
  const [tagFilter, setTagFilter] = useState(urlTag);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [itemFilter, setItemFilter] = useState<BuildSearchItem | null>(urlItem);
  const [itemNameFilter, setItemNameFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [builds, setBuilds] = useState<(PublicBuildSummary & { voted?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(urlQ);
    setItemFilter(urlItem);
    setSort(urlSort);
    setTagFilter(urlTag);
    setTypeFilter(urlType);
    setSlotFilter(urlSlot);
  }, [urlQ, urlItem, urlSort, urlType, urlTag, urlSlot]);

  const subtypes = useMemo(
    () => (typeFilter ? getDiscoverSubtypes(typeFilter) : []),
    [typeFilter],
  );

  const categoryMeta = typeFilter ? getDiscoverCategory(typeFilter) : null;

  const catalogItems = useMemo(() => {
    if (!typeFilter || viewingItem) return [];
    return listDiscoverCatalogItems(typeFilter, slotFilter);
  }, [typeFilter, slotFilter, viewingItem]);

  const filteredCatalog = useMemo(() => {
    const q = itemNameFilter.trim().toLowerCase();
    let list = catalogItems;
    if (q) list = list.filter((i) => i.name.toLowerCase().includes(q));
    return [...list].sort((a, b) => {
      const ca = counts[a.id] ?? 0;
      const cb = counts[b.id] ?? 0;
      if (cb !== ca) return cb - ca;
      return a.name.localeCompare(b.name);
    });
  }, [catalogItems, itemNameFilter, counts]);

  const syncUrl = useCallback(
    (next: {
      sort?: "recent" | "popular";
      typeFilter?: string | null;
      slotFilter?: string;
      itemFilter?: BuildSearchItem | null;
      searchQuery?: string;
      tagFilter?: string;
    }) => {
      const resolvedSort = next.sort ?? sort;
      const resolvedItem = next.itemFilter !== undefined ? next.itemFilter : itemFilter;
      const resolvedType =
        next.typeFilter !== undefined ? next.typeFilter : typeFilter;
      const resolvedSlot =
        next.slotFilter !== undefined ? next.slotFilter : slotFilter;
      const resolvedQ = next.searchQuery !== undefined ? next.searchQuery : searchQuery;
      const resolvedTag = next.tagFilter !== undefined ? next.tagFilter : tagFilter;

      const type = resolvedItem?.type ?? resolvedType ?? undefined;
      const slot =
        !type || !resolvedSlot || resolvedSlot === "all" ? undefined : resolvedSlot;

      router.replace(
        buildDiscoverUrl({
          sort: resolvedSort === "popular" ? "popular" : undefined,
          type,
          itemId: resolvedItem?.id,
          slot,
          q: resolvedItem && resolvedQ.trim() ? resolvedQ.trim() : undefined,
          tag: resolvedItem && resolvedTag ? resolvedTag : undefined,
        }),
      );
    },
    [router, sort, typeFilter, slotFilter, itemFilter, searchQuery, tagFilter],
  );

  const fetchBuilds = useCallback(
    async (cursor?: string | null, append = false) => {
      if (!urlType || !urlItemId) {
        setBuilds([]);
        setNextCursor(null);
        setLoading(false);
        return;
      }

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          sort: urlSort === "popular" ? "popular" : "recent",
          limit: "24",
          type: urlType,
          itemId: urlItemId,
        });
        if (urlQ.trim()) params.set("q", urlQ.trim());
        if (urlTag) params.set("tag", urlTag);
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`/api/builds/public?${params}`);
        if (!res.ok) return;
        const data = await res.json();
        setBuilds((prev) => (append ? [...prev, ...(data.builds ?? [])] : data.builds ?? []));
        setNextCursor(data.nextCursor ?? null);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [urlSort, urlType, urlItemId, urlQ, urlTag],
  );

  useEffect(() => {
    if (!viewingItem) {
      setBuilds([]);
      setNextCursor(null);
      setLoading(false);
      return;
    }
    fetchBuilds();
  }, [fetchBuilds, viewingItem]);

  useEffect(() => {
    if (!typeFilter || viewingItem) {
      setCounts({});
      setCountsLoading(false);
      return;
    }
    let cancelled = false;
    setCountsLoading(true);
    const params = new URLSearchParams({ type: typeFilter });
    if (slotFilter && slotFilter !== "all") params.set("slot", slotFilter);
    (async () => {
      try {
        const res = await fetch(`/api/builds/public/counts?${params}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) setCounts(data.counts ?? {});
      } catch {
        if (!cancelled) setCounts({});
      } finally {
        if (!cancelled) setCountsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [typeFilter, slotFilter, viewingItem]);

  const openCategory = (type: DiscoverCategoryId) => {
    setTypeFilter(type);
    setSlotFilter("all");
    setItemFilter(null);
    setSearchQuery("");
    setTagFilter("");
    setSort("recent");
    setItemNameFilter("");
    syncUrl({
      typeFilter: type,
      slotFilter: "all",
      itemFilter: null,
      searchQuery: "",
      tagFilter: "",
      sort: "recent",
    });
  };

  const backToHub = () => {
    setTypeFilter(null);
    setSlotFilter("all");
    setItemFilter(null);
    setSearchQuery("");
    setTagFilter("");
    setSort("recent");
    setItemNameFilter("");
    router.replace("/discover");
  };

  const backToItems = () => {
    setItemFilter(null);
    setSearchQuery("");
    setTagFilter("");
    syncUrl({ itemFilter: null, searchQuery: "", tagFilter: "" });
  };

  const selectCatalogItem = (item: DiscoverCatalogItem) => {
    if (!typeFilter) return;
    const next: BuildSearchItem = { id: item.id, name: item.name, type: typeFilter };
    setItemFilter(next);
    setSearchQuery("");
    setTagFilter("");
    syncUrl({ itemFilter: next, searchQuery: "", tagFilter: "" });
  };

  const heroTitle = !inCategory
    ? "Discover Builds"
    : itemFilter
      ? `Builds for ${itemFilter.name}`
      : categoryMeta?.label ?? "Discover Builds";

  const heroDescription = !inCategory
    ? "Browse community builds by category — pick a type, choose an item, then open a loadout."
    : itemFilter
      ? `Community loadouts for ${itemFilter.name}. Upvote builds you like or open one to copy mods.`
      : "Choose an item to see its public builds. Counts show how many are listed.";

  const hasActiveBuildFilters =
    sort !== "recent" || !!tagFilter || !!searchQuery.trim();

  return (
    <PageShell>
      <PageMain maxWidth="lg">
        <PageHero
          icon={Users}
          accent="primary"
          title={heroTitle}
          description={heroDescription}
        />

        {!inCategory ? (
          <DiscoverCategoryHub onSelect={openCategory} />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {viewingItem ? (
                <button
                  type="button"
                  onClick={backToItems}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {categoryMeta?.label ?? "Items"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={backToHub}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All categories
                </button>
              )}
              {categoryMeta && (
                <span className="text-sm font-semibold text-foreground">
                  {viewingItem && itemFilter
                    ? `${categoryMeta.label} · ${itemFilter.name}`
                    : categoryMeta.label}
                </span>
              )}
            </div>

            {!viewingItem && (
              <>
                {subtypes.length > 0 && (
                  <ContentPanel className="mb-4 p-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subtypes.map((s) => (
                        <FilterChip
                          key={s.id}
                          active={slotFilter === s.id}
                          onClick={() => {
                            setSlotFilter(s.id);
                            setItemNameFilter("");
                            syncUrl({ slotFilter: s.id, itemFilter: null });
                          }}
                        >
                          {s.label}
                        </FilterChip>
                      ))}
                    </div>
                  </ContentPanel>
                )}

                <div className="relative mb-4 min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={itemNameFilter}
                    onChange={(e) => setItemNameFilter(e.target.value)}
                    placeholder={`Search ${categoryMeta?.label.toLowerCase() ?? "items"}…`}
                    className="min-w-0 truncate border-border/60 bg-background/50 pl-10 pr-9"
                  />
                  {itemNameFilter && (
                    <button
                      type="button"
                      onClick={() => setItemNameFilter("")}
                      className="absolute right-1.5 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {countsLoading && catalogItems.length === 0 ? (
                  <div className="flex items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  </div>
                ) : (
                  <DiscoverItemGrid
                    items={filteredCatalog}
                    counts={counts}
                    onSelect={selectCatalogItem}
                  />
                )}
              </>
            )}

            {viewingItem && (
              <>
                <ContentPanel className="mb-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground sm:pointer-events-none"
                      onClick={() => setFiltersOpen((o) => !o)}
                      aria-expanded={filtersOpen}
                    >
                      Filters
                      <ChevronDown
                        className={`h-4 w-4 transition-transform sm:hidden ${filtersOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {hasActiveBuildFilters && (
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center text-xs font-medium text-primary hover:underline"
                        onClick={() => {
                          setSort("recent");
                          setTagFilter("");
                          setSearchQuery("");
                          syncUrl({
                            sort: "recent",
                            tagFilter: "",
                            searchQuery: "",
                          });
                        }}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>

                  <div className={`space-y-4 ${filtersOpen ? "block" : "hidden"} sm:block`}>
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Sort
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(["recent", "popular"] as const).map((s) => (
                          <FilterChip
                            key={s}
                            active={sort === s}
                            onClick={() => {
                              setSort(s);
                              syncUrl({ sort: s });
                            }}
                          >
                            {s === "recent" ? "Most Recent" : "Top Rated"}
                          </FilterChip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <FilterChip
                          active={!tagFilter}
                          onClick={() => {
                            setTagFilter("");
                            syncUrl({ tagFilter: "" });
                          }}
                        >
                          All tags
                        </FilterChip>
                        {BUILD_TAG_OPTIONS.map((t) => (
                          <FilterChip
                            key={t.id}
                            active={tagFilter === t.id}
                            title={TAG_TOOLTIPS[t.id] ?? tagLabel(t.id)}
                            onClick={() => {
                              const next = tagFilter === t.id ? "" : t.id;
                              setTagFilter(next);
                              syncUrl({ tagFilter: next });
                            }}
                          >
                            {t.label}
                          </FilterChip>
                        ))}
                      </div>
                    </div>

                    <div className="relative min-w-0">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") syncUrl({ searchQuery });
                        }}
                        placeholder="Search build names and descriptions…"
                        className="min-w-0 truncate border-border/60 bg-background/50 pl-10 pr-3"
                      />
                    </div>
                  </div>
                </ContentPanel>

                {loading ? (
                  <div className="flex items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  </div>
                ) : builds.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title={`No builds for ${itemFilter?.name ?? "this item"} yet`}
                    description={`Be the first to share a ${itemFilter?.name ?? ""} build — save in the builder and enable “List in Community”.`}
                  />
                ) : (
                  <>
                    <div className="space-y-3">
                      {builds.map((build) => (
                        <PublicBuildRow key={build.id} build={build} />
                      ))}
                    </div>
                    {nextCursor && (
                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={loadingMore}
                          onClick={() => fetchBuilds(nextCursor, true)}
                          className="inline-flex min-h-11 items-center rounded-lg border border-border/70 bg-card/50 px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
                        >
                          {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </PageMain>
    </PageShell>
  );
}
