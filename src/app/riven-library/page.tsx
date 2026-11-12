"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { PageShell, PageMain, PageHero, FilterChip, EmptyState } from "@/components/page-shell";
import { Sparkles, Plus, Search, RefreshCw, Flame, ArrowUpDown, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RivenCard } from "@/components/rivens/riven-card";
import { RivenDialog } from "@/components/rivens/riven-dialog";
import { getSavedRivens, rivenDisplayStats, type SavedRiven } from "@/lib/rivens/riven-storage";
import { hasClientSession } from "@/lib/auth/client-session";
import { deleteLibraryRiven, mergeCloudRivens, saveLibraryRiven } from "@/lib/rivens/riven-library-sync";
import { getSavedRivens as getCloudRivens } from "@/lib/riven/saved-rivens";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import { PolarityIcon } from "@/components/polarity-icon";
import { cn } from "@/lib/utils";

const WEAPON_TYPES = ["All", "Rifle", "Shotgun", "Pistol", "Melee", "Kitgun", "Zaw", "Companion", "Archgun"];
const GRADES = ["All", "God Roll", "Excellent", "Good", "Average", "Reroll"];
const POLARITIES = ["All", "madurai", "vazarin", "naramon"];

type SortOption = "updated" | "name" | "score" | "rerolls";

export default function RivenLibraryPage() {
  const [rivens, setRivens] = useState<SavedRiven[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedPolarity, setSelectedPolarity] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRiven, setEditingRiven] = useState<SavedRiven | null>(null);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { confirm } = useConfirmDialog();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  // Load from local storage and cloud if signed in
  const refreshRivens = useCallback(async () => {
    const local = getSavedRivens();
    try {
      const ok = await hasClientSession();
      setSignedIn(ok);
      if (ok) {
        const cloud = await getCloudRivens();
        if (cloud.length > 0) {
          setRivens(mergeCloudRivens(local, cloud));
          return;
        }
      }
    } catch {
      // Fallback to local
    }
    setRivens(local);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshRivens();
    });
  }, [refreshRivens]);

  // Actions
  const handleSaveRiven = async (riven: SavedRiven) => {
    await saveLibraryRiven(riven);
    refreshRivens();
    toast.success(`Saved “${riven.name}”. It shows up in the weapon mod picker.`);
  };

  const handleDeleteRiven = async (id: string) => {
    const riven = rivens.find((r) => r.id === id);
    const ok = await confirm({
      title: "Delete riven?",
      description: `“${riven?.name ?? "This riven"}” will be removed from your saved rivens. Builds that already use it keep their stats.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await deleteLibraryRiven(id);
    refreshRivens();
    toast.success("Riven deleted");
  };

  const openNewRiven = () => {
    setEditingRiven(null);
    setScanFile(null);
    setDialogOpen(true);
  };

  const handleEditRiven = (riven: SavedRiven) => {
    setScanFile(null);
    setEditingRiven(riven);
    setDialogOpen(true);
  };

  // Filtered & Sorted Rivens
  const filteredRivens = useMemo(() => {
    let result = [...rivens];

    if (selectedType !== "All") {
      result = result.filter((r) => r.weaponType.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedGrade !== "All") {
      result = result.filter((r) => r.grade?.toLowerCase() === selectedGrade.toLowerCase());
    }

    if (selectedPolarity !== "All") {
      result = result.filter((r) => r.polarity.toLowerCase() === selectedPolarity.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.weaponName.toLowerCase().includes(q) ||
          rivenDisplayStats(r).some((s) => (s.label ?? "").toLowerCase().includes(q)) ||
          r.grade?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.weaponName.localeCompare(b.weaponName);
      if (sortBy === "score") return (b.score ?? 0) - (a.score ?? 0);
      if (sortBy === "rerolls") return (b.rerolls ?? 0) - (a.rerolls ?? 0);
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });

    return result;
  }, [rivens, selectedType, selectedGrade, selectedPolarity, search, sortBy]);

  const godRollsCount = useMemo(
    () => rivens.filter((r) => r.grade === "God Roll").length,
    [rivens],
  );

  return (
    <PageShell>
      <PageMain maxWidth="xl" className="py-6">
        {/* Page Hero */}
        <PageHero
          icon={Sparkles}
          accent="purple"
          title="Riven Library"
          description={`Your Warframe riven collection. Grade rolls, then equip a riven straight into the build you have open.${signedIn === false ? " Saved on this device; sign in to sync them to your account." : ""}`}
        />

        {/* Top Action Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openNewRiven}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" /> New riven
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              data-testid="riven-import-file"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                e.target.value = "";
                if (!file) return;
                setEditingRiven(null);
                setScanFile(file);
                setDialogOpen(true);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Pick a riven screenshot; its stats are read into a new riven for you to check"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-3 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-900/60 hover:text-white"
            >
              <Camera className="h-3.5 w-3.5 text-purple-400" />
              <span>Import Screenshot</span>
            </button>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-purple-300">
              Total: <strong className="text-white">{rivens.length}</strong>
            </span>
            {godRollsCount > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/20 px-2.5 py-1 text-amber-300">
                <Flame className="h-3 w-3 text-amber-400" />
                God Rolls: <strong className="text-amber-200">{godRollsCount}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search rivens"
              aria-label="Search rivens by weapon, name, stats, or grade"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-border/60 bg-card/40 pl-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 rounded-lg border border-border/60 bg-card/40 px-3 text-xs text-foreground focus:outline-none"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Weapon Name (A–Z)</option>
              <option value="score">Grade Score (High to Low)</option>
              <option value="rerolls">Rerolls (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Filter Chips: Weapon Type */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Type:
          </span>
          {WEAPON_TYPES.map((t) => (
            <FilterChip
              key={t}
              active={selectedType === t}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </FilterChip>
          ))}
        </div>

        {/* Filter Chips: Polarity */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Polarity:
          </span>
          {POLARITIES.map((p) => (
            <FilterChip
              key={p}
              active={selectedPolarity === p}
              onClick={() => setSelectedPolarity(p)}
            >
              <span className="inline-flex items-center gap-1 capitalize">
                {p !== "All" && <PolarityIcon polarity={p} size={12} />}
                {p}
              </span>
            </FilterChip>
          ))}
        </div>

        {/* Filter Chips: Grade */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Grade:
          </span>
          {GRADES.map((g) => (
            <FilterChip
              key={g}
              active={selectedGrade === g}
              onClick={() => setSelectedGrade(g)}
            >
              {g}
            </FilterChip>
          ))}
        </div>

        {/* Riven Cards Grid */}
        {filteredRivens.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={rivens.length === 0 ? "Your Riven Library is Empty" : "No Matching Rivens Found"}
            description={
              rivens.length === 0
                ? "Start your collection with New riven, or import an in-game screenshot."
                : "Try adjusting your search query or filter chips above."
            }
            action={
              rivens.length === 0
                ? {
                    label: "New riven",
                    icon: Plus,
                    onClick: openNewRiven,
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredRivens.map((r) => (
              <RivenCard
                key={r.id}
                riven={r}
                onDelete={handleDeleteRiven}
                onEdit={handleEditRiven}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <RivenDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingRiven(null);
            setScanFile(null);
          }}
          onSave={handleSaveRiven}
          initialRiven={editingRiven}
          initialScanFile={scanFile}
        />
      </PageMain>
    </PageShell>
  );
}
