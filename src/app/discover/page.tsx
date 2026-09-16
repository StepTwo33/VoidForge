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
import { Search, Loader2, Users, X, Sparkles, ChevronDown } from "lucide-react";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import {
  buildDiscoverUrl,
  getBuildItemRef,
  searchBuildCatalog,
  type BuildSearchItem,
} from "@/lib/builds/build-search";
import { BUILD_TAG_OPTIONS, tagLabel } from "@/lib/builds/build-tags";

const TAG_TOOLTIPS: Record<string, string> = {
  eda: "EDA / ETA — Deep & Temporal Archimedea weekly challenge builds",
  steel_path: "Steel Path — high-level endless / SP content",
  level_cap: "Level Cap — enemy level scaling / endurance focus",
  budget: "Budget — low forma / accessible mods",
  beginner: "Beginner — easy to assemble and play",
  endgame: "Endgame — high investment / late-game content",
};

const BUILD_TYPES = [
  { id: "all", label: "All" },
  { id: "weapon", label: "Weapons" },
  { id: "warframe", label: "Warframes" },
  { id: "companion", label: "Companions" },
  { id: "modular", label: "Modular" },
  { id: "archwing", label: "Archwing" },
  { id: "railjack", label: "Railjack" },
  { id: "loadout", label: "Loadouts" },
] as const;

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") ?? "";
  const urlItemId = searchParams.get("itemId");
  const urlType = searchParams.get("type");
  const urlTag = searchParams.get("tag") ?? "";
  const urlSort = searchParams.get("sort") === "popular" ? "popular" : "recent";

  const urlItem = useMemo(() => {
    if (!urlItemId || !urlType) return null;
    return getBuildItemRef(urlType, urlItemId);
  }, [urlItemId, urlType]);

  const [sort, setSort] = useState<"recent" | "popular">(urlSort);
  const [typeFilter, setTypeFilter] = useState(
    urlItem ? urlItem.type : urlType && urlType !== "all" ? urlType : "all",
  );
  const [tagFilter, setTagFilter] = useState(urlTag);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [itemFilter, setItemFilter] = useState<BuildSearchItem | null>(urlItem);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [builds, setBuilds] = useState<(PublicBuildSummary & { voted?: boolean })[]>([]);
  const [featured, setFeatured] = useState<(PublicBuildSummary & { voted?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(urlQ);
    setItemFilter(urlItem);
    setSort(urlSort);
    setTagFilter(urlTag);
    setTypeFilter(urlItem ? urlItem.type : urlType && urlType !== "all" ? urlType : "all");
    setItemSearch("");
    setShowItemSuggestions(false);
  }, [urlQ, urlItem, urlSort, urlType, urlTag]);

  const itemSuggestions = useMemo(
    () => searchBuildCatalog(itemSearch, 8),
    [itemSearch],
  );

  const syncUrl = useCallback(
    (next: {
      sort?: "recent" | "popular";
      typeFilter?: string;
      itemFilter?: BuildSearchItem | null;
      searchQuery?: string;
      tagFilter?: string;
    }) => {
      const resolvedSort = next.sort ?? sort;
      const resolvedItem = next.itemFilter !== undefined ? next.itemFilter : itemFilter;
      const resolvedType = next.typeFilter ?? typeFilter;
      const resolvedQ = next.searchQuery !== undefined ? next.searchQuery : searchQuery;
      const resolvedTag = next.tagFilter !== undefined ? next.tagFilter : tagFilter;

      router.replace(
        buildDiscoverUrl({
          sort: resolvedSort === "popular" ? "popular" : undefined,
          type: resolvedItem ? resolvedItem.type : resolvedType !== "all" ? resolvedType : undefined,
          itemId: resolvedItem?.id,
          q: !resolvedItem && resolvedQ.trim() ? resolvedQ.trim() : undefined,
          tag: resolvedTag || undefined,
        }),
      );
    },
    [router, sort, typeFilter, itemFilter, searchQuery, tagFilter],
  );

  const fetchBuilds = useCallback(
    async (cursor?: string | null, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          sort: sort === "popular" ? "popular" : "recent",
          limit: "24",
        });
        if (typeFilter !== "all") params.set("type", typeFilter);
        if (itemFilter) {
          params.set("itemId", itemFilter.id);
          if (typeFilter === "all") params.set("type", itemFilter.type);
        }
        if (searchQuery.trim() && !itemFilter) params.set("q", searchQuery.trim());
        if (tagFilter) params.set("tag", tagFilter);
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
    [sort, typeFilter, itemFilter, searchQuery, tagFilter],
  );

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/builds/public?featured=1&limit=3&sort=popular");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) setFeatured(data.builds ?? []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroTitle = itemFilter
    ? `Builds for ${itemFilter.name}`
    : searchQuery.trim()
      ? `Builds matching “${searchQuery.trim()}”`
      : "Discover Builds";

  const heroDescription = itemFilter
    ? `Community loadouts for ${itemFilter.name}. Upvote builds you like or open one to copy mods.`
    : "Browse community builds shared by other Tenno. Search by name or filter to a specific weapon or warframe.";

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={Users}
          accent="primary"
          title={heroTitle}
          description={heroDescription}
        />

        {featured.length > 0 && !itemFilter && !searchQuery.trim() && !tagFilter && (
          <ContentPanel className="mb-6 space-y-3 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Rising builds
              <span className="text-[11px] font-normal text-muted-foreground">
                Top-voted public builds from the last 2 weeks
              </span>
            </div>
            <div className="space-y-2">
              {featured.map((b) => (
                <PublicBuildRow key={`feat-${b.id}`} build={b} showVote />
              ))}
            </div>
          </ContentPanel>
        )}

        <ContentPanel className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-foreground sm:pointer-events-none"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
            >
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform sm:hidden ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
            {(sort !== "recent" || tagFilter || typeFilter !== "all" || searchQuery.trim() || itemFilter) && (
              <button
                type="button"
                className="min-h-10 text-xs font-medium text-primary hover:underline"
                onClick={() => {
                  setSort("recent");
                  setTagFilter("");
                  setTypeFilter("all");
                  setSearchQuery("");
                  setItemFilter(null);
                  setItemSearch("");
                  syncUrl({ sort: "recent", tagFilter: "", typeFilter: "all", searchQuery: "", itemFilter: null });
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className={`space-y-4 ${filtersOpen ? "block" : "hidden"} sm:block`}>
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sort</p>
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
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
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
                title={TAG_TOOLTIPS[t.id] ?? t.label}
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
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (itemFilter) setItemFilter(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  syncUrl({ searchQuery, itemFilter: null });
                }
              }}
              placeholder="Search build names and descriptions…"
              className="min-w-0 truncate border-border/60 bg-background/50 pl-10 pr-3"
            />
          </div>

          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={itemFilter ? itemFilter.name : itemSearch}
              onChange={(e) => {
                setItemSearch(e.target.value);
                setItemFilter(null);
                setShowItemSuggestions(true);
              }}
              onFocus={() => setShowItemSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && itemSearch.trim()) {
                  const match = searchBuildCatalog(itemSearch, 1)[0];
                  if (match) {
                    setItemFilter(match);
                    setItemSearch("");
                    setTypeFilter(match.type);
                    setShowItemSuggestions(false);
                    syncUrl({ itemFilter: match, typeFilter: match.type, searchQuery: "" });
                  }
                }
              }}
              placeholder="Filter by weapon, warframe, companion…"
              className="min-w-0 truncate border-border/60 bg-background/50 pl-10 pr-9"
            />
            {(itemFilter || itemSearch) && (
              <button
                type="button"
                onClick={() => {
                  setItemFilter(null);
                  setItemSearch("");
                  setShowItemSuggestions(false);
                  syncUrl({ itemFilter: null });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {showItemSuggestions && itemSuggestions.length > 0 && !itemFilter && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border/70 bg-card/95 shadow-xl backdrop-blur-md">
                {itemSuggestions.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => {
                      setItemFilter(item);
                      setItemSearch("");
                      setTypeFilter(item.type);
                      setShowItemSuggestions(false);
                      syncUrl({ itemFilter: item, typeFilter: item.type, searchQuery: "" });
                    }}
                    className="flex w-full justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary/5"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs capitalize text-muted-foreground">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</p>
            <div className="flex flex-wrap gap-2">
            {BUILD_TYPES.map((t) => (
              <FilterChip
                key={t.id}
                active={typeFilter === t.id}
                onClick={() => {
                  setTypeFilter(t.id);
                  if (t.id !== "all") setItemFilter(null);
                  syncUrl({ typeFilter: t.id, itemFilter: t.id !== "all" ? null : itemFilter });
                }}
              >
                {t.label}
              </FilterChip>
            ))}
            </div>
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
            title={itemFilter ? `No builds for ${itemFilter.name} yet` : "No community builds yet"}
            description={
              itemFilter
                ? `Be the first to share a ${itemFilter.name} build — save in the builder and enable “List in Community Builds”.`
                : 'Save a build in any builder and check "List in Community Builds" to share it here.'
            }
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
                  className="rounded-lg border border-border/70 bg-card/50 px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
                >
                  {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </PageMain>
    </PageShell>
  );
}
