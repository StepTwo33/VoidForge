import { GameAssetImage } from "@/components/game-asset-image";
import type { BuildPreviewChip, BuildPreviewData, LoadoutSlotPreview } from "@/lib/builds/build-preview";
import { summarizeLoadoutSlots } from "@/lib/builds/build-preview";

function ChipRow({ chips, accent }: { chips: BuildPreviewChip[]; accent?: "arcane" }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <span
          key={`${chip.label}-${i}`}
          className={
            accent === "arcane"
              ? "inline-flex rounded-md border border-purple-500/25 bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-900 dark:text-purple-300"
              : "inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/80 px-2 py-1 text-xs"
          }
        >
          <span className="font-medium text-foreground">{chip.label}</span>
          {chip.sublabel && (
            <span className="text-[10px] text-muted-foreground">{chip.sublabel}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function SlotCard({ slot }: { slot: LoadoutSlotPreview }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
      <div className="flex items-center gap-3">
        {slot.itemImage ? (
          <GameAssetImage
            src={slot.itemImage}
            alt={slot.itemName}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-lg bg-muted/50 dark:bg-black/20 object-contain p-0.5"
            hideOnError
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-medium text-muted-foreground">
            {slot.label.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {slot.label}
          </p>
          <p className="text-sm font-semibold text-foreground break-words [overflow-wrap:anywhere]">
            {slot.itemName}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {slot.modChips.length === 0
              ? "No mods"
              : `${slot.modChips.length} mod${slot.modChips.length === 1 ? "" : "s"}`}
            {slot.arcaneChips.length > 0
              ? ` · ${slot.arcaneChips.length} arcane${slot.arcaneChips.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
      </div>

      {slot.modChips.length > 0 && (
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mods
          </p>
          <ChipRow chips={slot.modChips} />
        </div>
      )}

      {slot.arcaneChips.length > 0 && (
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Arcanes
          </p>
          <ChipRow chips={slot.arcaneChips} accent="arcane" />
        </div>
      )}

      {slot.extraLines.length > 0 && (
        <div className="space-y-1">
          {slot.extraLines.map((line) => (
            <p key={line} className="text-xs text-muted-foreground">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function LoadoutBuildPreview({
  data,
  summary,
}: {
  data: unknown;
  summary: BuildPreviewData;
}) {
  const slots = summarizeLoadoutSlots(data);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
        {summary.itemImage ? (
          <GameAssetImage
            src={summary.itemImage}
            alt={summary.itemName}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-lg bg-muted/50 dark:bg-black/20 object-contain p-1"
            hideOnError
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            LO
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Loadout
          </p>
          <p className="text-lg font-semibold text-foreground break-words [overflow-wrap:anywhere]">
            {summary.itemName}
          </p>
          <p className="text-xs text-muted-foreground">{summary.modSummary}</p>
        </div>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No slots filled in this loadout yet.
        </p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Kit slots
          </h2>
          {slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}
