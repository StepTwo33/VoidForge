import { GameAssetImage } from "@/components/game-asset-image";
import type { BuildPreviewData } from "@/lib/builds/build-preview";
import { cn } from "@/lib/utils";

export function BuildPreviewSummary({ preview }: { preview: BuildPreviewData }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
        {preview.itemImage ? (
          <GameAssetImage
            src={preview.itemImage}
            alt={preview.itemName}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-lg bg-muted/50 dark:bg-black/20 object-contain p-1"
            hideOnError
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
            {preview.typeLabel.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {preview.typeLabel}
          </p>
          <p className="text-lg font-semibold text-foreground break-words [overflow-wrap:anywhere]">{preview.itemName}</p>
          <p className="text-xs text-muted-foreground">{preview.modSummary}</p>
        </div>
      </div>

      {preview.modChips.length > 0 && (
        <section>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mods
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {preview.modChips.map((chip, i) => (
              <span
                key={`${chip.label}-${i}`}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/80 px-2 py-1 text-xs"
              >
                <span className="font-medium text-foreground">{chip.label}</span>
                {chip.sublabel && (
                  <span className="text-[10px] text-muted-foreground">{chip.sublabel}</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {preview.arcaneChips.length > 0 && (
        <section>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Arcanes
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {preview.arcaneChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex rounded-md border border-purple-500/25 bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-900 dark:text-purple-300"
              >
                {chip.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {preview.extraLines.length > 0 && (
        <section className="space-y-1.5">
          {preview.extraLines.map((line) => (
            <p key={line} className="text-xs text-muted-foreground">
              {line}
            </p>
          ))}
        </section>
      )}

      {preview.modChips.length === 0 && preview.arcaneChips.length === 0 && preview.extraLines.length === 0 && (
        <p className={cn("text-sm text-muted-foreground")}>
          No equipped mods to preview yet. Open this build in the builder to review the full setup.
        </p>
      )}
    </div>
  );
}
