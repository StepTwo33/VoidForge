"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, User, Menu, X, ChevronDown, Swords, Wrench, LayoutGrid, Flag, Shield, Github, Users, Heart, Search, BookOpen } from "lucide-react";
import { useEffect, useState, useRef, useCallback, useMemo, type FormEvent } from "react";
import { ThemePicker } from "@/components/theme-picker";
import { BrandMark } from "@/components/brand-mark";
import { AvatarImage } from "@/components/game-asset-image";
import { Input } from "@/components/ui/input";
import { FRAME_HUB_GITHUB_URL } from "@/lib/site/site-links";
import { bestBuildCatalogMatch, buildDiscoverUrl, searchBuildCatalog, type BuildSearchItem } from "@/lib/builds/build-search";
import type { PublicBuildSummary } from "@/lib/builds/build-types";

interface SessionUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  image: string | null;
  role: string;
}

type NavLink = {
  href: string;
  label: string;
  desc: string;
  /** Hidden from public nav until the feature is ready for release. */
  staffOnly?: boolean;
};

type NavGroup = {
  label: string;
  icon: typeof Swords;
  links: NavLink[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Arsenal",
    icon: Swords,
    links: [
      { href: "/weapon-builder", label: "Weapons", desc: "Build & optimize weapons" },
      { href: "/warframe-builder", label: "Warframes", desc: "Warframe modding" },
      { href: "/companion-builder", label: "Companions", desc: "Companion loadouts" },
      { href: "/modular-builder", label: "Modular", desc: "Kitguns, Zaws & more" },
      { href: "/archwing-builder", label: "Archwing", desc: "Archwing & Necramech" },
      { href: "/railjack-builder", label: "Railjack", desc: "Ship components & Plexus" },
      { href: "/loadouts", label: "Saved Builds", desc: "Local & cloud builds" },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    links: [
      { href: "/codex", label: "Codex", desc: "Browse mods, arcanes, and shards" },
      { href: "/riven-calculator", label: "Riven Calculator", desc: "Riven stat ranges" },
      { href: "/damage-simulator", label: "Damage Simulator", desc: "Simulate damage output" },
      { href: "/bot", label: "Discord Bot", desc: "World-state alerts & channel config", staffOnly: true },
    ],
  },
  {
    label: "Builds",
    icon: LayoutGrid,
    links: [
      { href: "/loadouts", label: "Loadouts", desc: "Full loadout slots" },
      { href: "/player-sync", label: "Player Sync", desc: "Import from Warframe account" },
      { href: "/compare", label: "Compare", desc: "Compare items side-by-side" },
      { href: "/import-export", label: "Import / Export", desc: "Share build codes" },
    ],
  },
];

function filterNavGroups(groups: NavGroup[], isStaff: boolean): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => !link.staffOnly || isStaff),
    }))
    .filter((group) => group.links.length > 0);
}

const DISCORD_SVG = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" /></svg>
);

function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const Icon = group.icon;

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
        onClick={() => setOpen(!open)}
      >
        <Icon className="h-3.5 w-3.5" />
        {group.label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-1 z-50" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <div className="w-56 bg-popover backdrop-blur-xl border border-border/60 rounded-xl shadow-elevation p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 px-3 py-2 rounded-lg hover:bg-secondary/70 transition-colors group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {link.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOpenReportsBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  return (
    <span
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm shadow-red-500/40"
      aria-label={`${count} open reports`}
    >
      {label}
    </span>
  );
}

const BUILD_TYPE_LABELS: Record<string, string> = {
  weapon: "Weapon",
  warframe: "Warframe",
  companion: "Companion",
  modular: "Modular",
  archwing: "Archwing",
  railjack: "Railjack",
  loadout: "Loadout",
};

function HeaderBuildSearch({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [communityBuilds, setCommunityBuilds] = useState<PublicBuildSummary[]>([]);
  const [loadingBuilds, setLoadingBuilds] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const catalogMatches = searchBuildCatalog(query, 5);
  const trimmed = query.trim();
  const showSuggestions = open && trimmed.length >= 2;

  const suggestions = useMemo(() => {
    const rows: Array<
      | { kind: "catalog"; item: BuildSearchItem }
      | { kind: "build"; build: PublicBuildSummary }
      | { kind: "action"; label: string; href: string }
    > = [];

    for (const item of catalogMatches) {
      rows.push({ kind: "catalog", item });
    }
    for (const build of communityBuilds) {
      rows.push({ kind: "build", build });
    }
    if (trimmed.length >= 2) {
      rows.push({
        kind: "action",
        label: `Search all builds for “${trimmed}”`,
        href: buildDiscoverUrl({ q: trimmed }),
      });
    }

    return rows;
  }, [catalogMatches, communityBuilds, trimmed]);

  useEffect(() => {
    if (trimmed.length < 2) {
      setCommunityBuilds([]);
      setLoadingBuilds(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingBuilds(true);
      try {
        const params = new URLSearchParams({ q: trimmed, limit: "5", sort: "popular" });
        const res = await fetch(`/api/builds/public?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { builds?: PublicBuildSummary[] };
        setCommunityBuilds(data.builds ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setCommunityBuilds([]);
      } finally {
        if (!controller.signal.aborted) setLoadingBuilds(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, communityBuilds.length, catalogMatches.length]);

  useEffect(() => {
    if (!showSuggestions) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [showSuggestions]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const selectSuggestion = useCallback(
    (index: number) => {
      const row = suggestions[index];
      if (!row) return;
      if (row.kind === "catalog") {
        navigate(buildDiscoverUrl({ type: row.item.type, itemId: row.item.id }));
      } else if (row.kind === "build") {
        navigate(`/build/${row.build.id}`);
      } else {
        navigate(row.href);
      }
    },
    [navigate, suggestions],
  );

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (showSuggestions && suggestions.length > 0) {
      selectSuggestion(activeIndex);
      return;
    }
    const q = trimmed;
    if (!q) {
      navigate("/discover");
      return;
    }
    const match = bestBuildCatalogMatch(q);
    navigate(
      match
        ? buildDiscoverUrl({ type: match.type, itemId: match.id })
        : buildDiscoverUrl({ q }),
    );
  };

  return (
    <form onSubmit={submit} className={className}>
      <div ref={rootRef} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showSuggestions || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search builds by frame or weapon..."
          aria-label="Search community builds"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="header-build-search-listbox"
          role="combobox"
          className="h-9 border-border/60 bg-background/40 pl-9 pr-3 text-sm backdrop-blur-sm"
        />

        {showSuggestions && (
          <div
            id="header-build-search-listbox"
            role="listbox"
            className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border/60 bg-popover shadow-elevation backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {catalogMatches.length > 0 && (
              <div className="px-2 pt-2">
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Items
                </p>
                {catalogMatches.map((item) => {
                  const idx = suggestions.findIndex((s) => s.kind === "catalog" && s.item.id === item.id && s.item.type === item.type);
                  return (
                    <button
                      key={`${item.type}:${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => selectSuggestion(idx)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                        idx === activeIndex ? "bg-secondary/80 text-foreground" : "hover:bg-secondary/50"
                      }`}
                    >
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="shrink-0 text-[10px] capitalize text-muted-foreground">
                        {BUILD_TYPE_LABELS[item.type] ?? item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {(loadingBuilds || communityBuilds.length > 0) && (
              <div className="px-2 pt-2">
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Community builds
                </p>
                {loadingBuilds && communityBuilds.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">Searching…</p>
                ) : (
                  communityBuilds.map((build) => {
                    const idx = suggestions.findIndex((s) => s.kind === "build" && s.build.id === build.id);
                    return (
                      <button
                        key={build.id}
                        type="button"
                        role="option"
                        aria-selected={idx === activeIndex}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => selectSuggestion(idx)}
                        className={`flex w-full flex-col gap-0.5 rounded-lg px-2 py-2 text-left transition-colors ${
                          idx === activeIndex ? "bg-secondary/80" : "hover:bg-secondary/50"
                        }`}
                      >
                        <span className="truncate text-sm font-medium">{build.name}</span>
                        <span className="truncate text-[10px] text-muted-foreground">
                          by {build.author.username}
                          {" · "}
                          {BUILD_TYPE_LABELS[build.type] ?? build.type}
                          {build.upvoteCount > 0 ? ` · ${build.upvoteCount} upvotes` : ""}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {!loadingBuilds && catalogMatches.length === 0 && communityBuilds.length === 0 && (
              <p className="px-3 py-3 text-xs text-muted-foreground">No matches yet — press Enter to search Discover.</p>
            )}

            <div className="border-t border-border/50 p-2">
              {(() => {
                const idx = suggestions.findIndex((s) => s.kind === "action");
                if (idx < 0) return null;
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectSuggestion(idx)}
                    className={`w-full rounded-lg px-2 py-2 text-left text-xs text-muted-foreground transition-colors ${
                      idx === activeIndex ? "bg-secondary/80 text-foreground" : "hover:bg-secondary/50"
                    }`}
                  >
                    Search all builds for “{trimmed}”
                  </button>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openReportCount, setOpenReportCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => { setUser(data.user ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const refresh = () => {
      fetch("/api/auth/session")
        .then((r) => r.json())
        .then((data) => { setUser(data.user ?? null); })
        .catch(() => {});
    };
    window.addEventListener("framehub-profile-updated", refresh);
    return () => window.removeEventListener("framehub-profile-updated", refresh);
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "moderator";
  const navGroups = useMemo(() => filterNavGroups(NAV_GROUPS, isAdmin), [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      setOpenReportCount(0);
      return;
    }

    let cancelled = false;

    const fetchOpenReportCount = () => {
      fetch("/api/admin/reports/summary")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { open?: number } | null) => {
          if (!cancelled && data && typeof data.open === "number") {
            setOpenReportCount(data.open);
          }
        })
        .catch(() => {});
    };

    fetchOpenReportCount();
    const interval = setInterval(fetchOpenReportCount, 60_000);
    window.addEventListener("focus", fetchOpenReportCount);
    window.addEventListener("framehub-reports-updated", fetchOpenReportCount);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", fetchOpenReportCount);
      window.removeEventListener("framehub-reports-updated", fetchOpenReportCount);
    };
  }, [isAdmin]);

  return (
    <header className="page-ambient-ignore sticky top-0 z-50 border-b border-border/60 bg-card/70 shadow-sm shadow-[var(--shadow-color)] backdrop-blur-xl transition-colors duration-300">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="flex h-14 w-full items-center gap-2 px-4 sm:px-5 lg:gap-3 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight">
          <BrandMark size={28} className="ring-1 ring-primary/20" />
          <span>
            <span className="text-primary">Frame</span>
            <span className="text-muted-foreground">Hub</span>
          </span>
        </Link>

        {/* Desktop nav — sits left of center search */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          <Link
            href="/discover"
            className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-primary hover:text-primary/90 transition-colors rounded-lg hover:bg-primary/10"
          >
            <Users className="h-3.5 w-3.5" />
            Discover
          </Link>

          <Link
            href="/guides/how-to-mod"
            className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
          >
            <BookOpen className="h-3.5 w-3.5" />
            How to Mod
          </Link>

          {navGroups.map((group) => (
            <NavDropdown key={group.label} group={group} />
          ))}
        </nav>

        {/* Center search — grows on wide screens */}
        <HeaderBuildSearch className="hidden md:block min-w-0 flex-1 max-w-md lg:max-w-lg mx-auto" />

        {/* Right cluster — pinned to the right edge */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <nav className="hidden lg:flex items-center gap-1">
            <span className="w-px h-5 bg-border mx-1" />

            <Link
              href="/support"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-rose-800 hover:text-rose-700 transition-colors rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <Heart className="h-3.5 w-3.5" />
              Support
            </Link>

            <Link
              href="/report-issue"
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-amber-800/80 hover:text-amber-900 transition-colors rounded-lg hover:bg-amber-500/5 dark:text-amber-400/70 dark:hover:text-amber-400"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </Link>

            {isAdmin && (
              <Link
                href="/admin/reports"
                className="relative flex items-center gap-1.5 px-2 py-1.5 text-sm text-red-700/80 hover:text-red-800 transition-colors rounded-lg hover:bg-red-500/5 dark:text-red-400/70 dark:hover:text-red-400"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
                <AdminOpenReportsBadge count={openReportCount} />
              </Link>
            )}

            <a
              href={FRAME_HUB_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              title="Open source on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>

            <a
              href="https://discord.gg/bqQXaYdTjS"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-[#5865F2] transition-colors rounded-lg hover:bg-secondary/50"
              title="Join Discord"
            >
              {DISCORD_SVG}
            </a>

            <span className="w-px h-5 bg-border mx-1" />
          </nav>

          <ThemePicker />

          {loading ? (
            <span className="w-7 h-7 rounded-full bg-muted animate-pulse ml-1" />
          ) : user ? (
            <Link href="/profile" className="flex items-center gap-2 ml-1 hover:opacity-80 transition-opacity">
              {user.image ? (
                <AvatarImage src={user.image} alt="" size={28} className="w-7 h-7 rounded-full border border-border" />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="hidden xl:inline text-xs text-muted-foreground max-w-[100px] truncate">
                {user.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <a
              href="/signin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all ml-1"
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </a>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <HeaderBuildSearch className="pb-2 md:hidden" onNavigate={() => setMobileOpen(false)} />
          <Link
            href="/discover"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <Users className="h-4 w-4" />
            Discover
          </Link>

          <Link
            href="/guides/how-to-mod"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            How to Mod
          </Link>

          {navGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = mobileExpanded === group.label;
            return (
              <div key={group.label}>
                <button
                  onClick={() => setMobileExpanded(isExpanded ? null : group.label)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left font-medium">{group.label}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="ml-4 border-l border-border pl-2 space-y-0.5 py-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t border-border pt-1 mt-1">
            <Link
              href="/support"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-800 hover:text-rose-700 hover:bg-rose-500/10 transition-colors dark:text-rose-400 dark:hover:text-rose-300"
            >
              <Heart className="h-4 w-4" />
              Support
            </Link>
            <Link
              href="/report-issue"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-amber-800/80 hover:text-amber-900 hover:bg-secondary transition-colors dark:text-amber-400/70 dark:hover:text-amber-400"
            >
              <Flag className="h-4 w-4" />
              Report Issue
            </Link>
            {isAdmin && (
              <Link
                href="/admin/reports"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-700/80 hover:text-red-800 hover:bg-secondary transition-colors dark:text-red-400/70 dark:hover:text-red-400"
              >
                <Shield className="h-4 w-4" />
                Admin Reports
                <AdminOpenReportsBadge count={openReportCount} />
              </Link>
            )}
            <a
              href={FRAME_HUB_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub (open source)
            </a>
            <a
              href="https://discord.gg/bqQXaYdTjS"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-[#5865F2] hover:bg-secondary transition-colors"
            >
              {DISCORD_SVG}
              Discord
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
