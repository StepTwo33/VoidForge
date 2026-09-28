import { GameAssetImage } from "@/components/game-asset-image";
import { getArcaneImage, getModImage } from "@/lib/display/images";
import type { BuildPreviewChip, BuildPreviewData, LoadoutSlotPreview } from "@/lib/builds/build-preview";
import { summarizeLoadoutSlots } from "@/lib/builds/build-preview";
import { cn } from "@/lib/utils";

function GearTile({
  chip,
  accent,
}: {
  chip: BuildPreviewChip;
  accent?: "arcane";
}) {
  const src = accent === "arcane" ? getArcaneImage(chip.label) : getModImage(chip.label);
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2 py-1.5",
        accent === "arcane"
          ? "border-purple-500/30 bg-purple-500/10"
          : "border-border/50 bg-card/70",
      )}
      title={chip.sublabel ? `${chip.label} ${chip.sublabel}` : chip.label}
    >
      <GameAssetImage
        src={src}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded object-contain bg-muted/30"
        hideOnError
      />
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-medium leading-tight text-foreground">
          {chip.label}
        </span>
        {chip.sublabel && (
          <span className="block text-[9px] text-muted-foreground">{chip.sublabel}</span>
        )}
      </span>
    </div>
  );
}

function SlotCard({ slot, featured }: { slot: LoadoutSlotPreview; featured?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border/60 bg-muted/15 p-4",
        featured && "md:col-span-2 lg:col-span-3",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        {slot.itemImage ? (
          <GameAssetImage
            src={slot.itemImage}
            alt={slot.itemName}
            width={featured ? 72 : 56}
            height={featured ? 72 : 56}
            className={cn(
              "shrink-0 rounded-lg bg-muted/40 object-contain p-1 dark:bg-black/20",
              featured ? "h-[4.5rem] w-[4.5rem]" : "h-14 w-14",
            )}
            hideOnError
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-medium text-muted-foreground",
              featured ? "h-[4.5rem] w-[4.5rem]" : "h-14 w-14",
            )}
          >
            {slot.label.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {slot.label}
          </p>
          <p
            className={cn(
              "font-semibold text-foreground break-words [overflow-wrap:anywhere]",
              featured ? "text-lg" : "text-sm",
            )}
          >
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

      <div className="mt-auto space-y-3">
        {slot.modChips.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mods
            </p>
            <div
              className={cn(
                "grid gap-1.5",
                featured
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {slot.modChips.map((chip, i) => (
                <GearTile key={`${chip.label}-${i}`} chip={chip} />
              ))}
            </div>
          </div>
        )}

        {slot.arcaneChips.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Arcanes
            </p>
            <div
              className={cn(
                "grid gap-1.5",
                featured ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {slot.arcaneChips.map((chip, i) => (
                <GearTile key={`${chip.label}-${i}`} chip={chip} accent="arcane" />
              ))}
            </div>
          </div>
        )}

        {slot.extraLines.length > 0 && (
          <div className="space-y-1 border-t border-border/40 pt-2">
            {slot.extraLines.map((line) => (
              <p key={line} className="text-xs text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
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
  const warframe = slots.find((s) => s.id === "warframe");
  const others = slots.filter((s) => s.id !== "warframe");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        {summary.itemImage ? (
          <GameAssetImage
            src={summary.itemImage}
            alt={summary.itemName}
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 rounded-xl bg-muted/50 object-contain p-1.5 dark:bg-black/20 sm:h-24 sm:w-24"
            hideOnError
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-medium text-muted-foreground sm:h-24 sm:w-24">
            LO
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Loadout
          </p>
          <p className="text-xl font-bold tracking-tight text-foreground break-words [overflow-wrap:anywhere] sm:text-2xl">
            {summary.itemName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{summary.modSummary}</p>
          {slots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 py-0.5 pl-0.5 pr-2.5 text-[11px] text-muted-foreground"
                >
                  {s.itemImage ? (
                    <GameAssetImage
                      src={s.itemImage}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full object-contain bg-muted/40"
                      hideOnError
                    />
                  ) : null}
                  <span className="font-medium text-foreground/90">{s.label}</span>
                  <span className="text-muted-foreground/80">· {s.itemName}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground">No slots filled in this loadout yet.</p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Kit slots
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {warframe && <SlotCard slot={warframe} featured />}
            {others.map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
