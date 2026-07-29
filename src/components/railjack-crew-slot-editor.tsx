"use client";

import {
  adversaryCrewProfiles,
  commandCompetencyBonusPoints,
  competencyTotal,
  CREW_ROLE_LABELS,
  eliteCrewUnlocked,
  eliteTraitsForCompetency,
  emptyCompetency,
  findNamedEliteCrew,
  findTickerTemplate,
  highestCompetencyKey,
  namedEliteCrew,
  tickerCrewTemplates,
  unusualCrewUnlocked,
  type CrewCompetency,
  type CrewRole,
  type CrewSource,
  type RailjackCrewSlot,
} from "@/data/railjack-crew";
import { cn } from "@/lib/utils";

const ROLES: CrewRole[] = ["pilot", "gunner", "engineer", "defender"];
const SOURCES: { id: CrewSource; label: string }[] = [
  { id: "ticker", label: "Ticker" },
  { id: "elite", label: "Elite" },
  { id: "adversary", label: "Adversary" },
];
const COMP_KEYS: (keyof CrewCompetency)[] = [
  "piloting",
  "gunnery",
  "repair",
  "combat",
  "endurance",
];

interface CrewSlotEditorProps {
  slot: RailjackCrewSlot | null;
  commandRank: number;
  defaultRole: CrewRole;
  onChange: (next: RailjackCrewSlot | null) => void;
}

export function CrewSlotEditor({
  slot,
  commandRank,
  defaultRole,
  onChange,
}: CrewSlotEditorProps) {
  const source: CrewSource = slot?.source ?? "ticker";
  const role: CrewRole = slot?.source === "adversary" ? "defender" : (slot?.role ?? defaultRole);
  const profileId =
    slot?.profileId ??
    (source === "ticker"
      ? tickerCrewTemplates[0]!.id
      : source === "elite"
        ? namedEliteCrew[0]!.id
        : adversaryCrewProfiles[0]!.id);

  const ensureSlot = (partial: Partial<RailjackCrewSlot>): RailjackCrewSlot => {
    const nextSource = partial.source ?? source;
    let nextRole = partial.role ?? role;
    if (nextSource === "adversary") nextRole = "defender";

    let nextProfile = partial.profileId ?? profileId;
    let competency = partial.competency ?? slot?.competency;
    let eliteTraitId = partial.eliteTraitId ?? slot?.eliteTraitId;

    if (partial.source && partial.source !== slot?.source) {
      if (partial.source === "ticker") {
        nextProfile = tickerCrewTemplates[0]!.id;
        competency = { ...tickerCrewTemplates[0]!.defaultCompetency };
        eliteTraitId = undefined;
      } else if (partial.source === "elite") {
        const elite = namedEliteCrew[0]!;
        nextProfile = elite.id;
        competency = { ...elite.competency };
        eliteTraitId = elite.defaultTraitId;
      } else {
        nextProfile = adversaryCrewProfiles[0]!.id;
        competency = undefined;
        eliteTraitId = undefined;
        nextRole = "defender";
      }
    }

    if (partial.profileId && partial.profileId !== slot?.profileId) {
      if (nextSource === "ticker") {
        const t = findTickerTemplate(partial.profileId);
        if (t) competency = { ...t.defaultCompetency };
        eliteTraitId = undefined;
      } else if (nextSource === "elite") {
        const e = findNamedEliteCrew(partial.profileId);
        if (e) {
          competency = { ...e.competency };
          eliteTraitId = e.defaultTraitId;
        }
      } else {
        competency = undefined;
        eliteTraitId = undefined;
      }
    }

    return {
      role: nextRole,
      source: nextSource,
      profileId: nextProfile,
      competency,
      eliteTraitId,
    };
  };

  const working = ensureSlot({});
  const competency = working.competency ?? emptyCompetency();
  const template = working.source === "ticker" ? findTickerTemplate(working.profileId) : undefined;
  const elite = working.source === "elite" ? findNamedEliteCrew(working.profileId) : undefined;
  const basePoints =
    working.source === "ticker"
      ? (template?.basePoints ?? 10)
      : working.source === "elite"
        ? 12
        : 0;
  const maxPoints = basePoints + commandCompetencyBonusPoints(commandRank);
  const usedPoints = competencyTotal(competency);
  const traitOptions =
    working.source === "elite" || (working.source === "ticker" && eliteCrewUnlocked(commandRank))
      ? eliteTraitsForCompetency(highestCompetencyKey(competency))
      : [];

  const setCompetency = (key: keyof CrewCompetency, value: number) => {
    const next = { ...competency, [key]: Math.max(0, Math.min(5, value)) };
    if (competencyTotal(next) > maxPoints) return;
    onChange(ensureSlot({ competency: next }));
  };

  return (
    <div className="mt-2 pt-2 border-t border-border/50 space-y-2 text-xs">
      <div className="flex flex-wrap gap-1">
        {SOURCES.map((s) => {
          const locked =
            (s.id === "adversary" && !unusualCrewUnlocked(commandRank)) ||
            (s.id === "elite" && !eliteCrewUnlocked(commandRank));
          return (
            <button
              key={s.id}
              type="button"
              disabled={locked}
              onClick={() => onChange(ensureSlot({ source: s.id }))}
              className={cn(
                "px-2 py-1 rounded border text-[10px]",
                source === s.id
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-border text-muted-foreground",
                locked && "opacity-40 cursor-not-allowed",
              )}
              title={
                locked
                  ? s.id === "adversary"
                    ? "Requires Command 8"
                    : "Requires Command 10"
                  : undefined
              }
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="text-[10px] text-muted-foreground">Role</span>
        <select
          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs"
          value={role}
          disabled={source === "adversary"}
          onChange={(e) => onChange(ensureSlot({ role: e.target.value as CrewRole }))}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {CREW_ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-[10px] text-muted-foreground">Profile</span>
        <select
          className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs"
          value={profileId}
          onChange={(e) => onChange(ensureSlot({ profileId: e.target.value }))}
        >
          {source === "ticker" &&
            tickerCrewTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.basePoints} pts)
              </option>
            ))}
          {source === "elite" &&
            namedEliteCrew.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          {source === "adversary" &&
            adversaryCrewProfiles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </select>
      </label>

      {source !== "adversary" && (
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Competency</span>
            <span className={cn(usedPoints > maxPoints && "text-red-400")}>
              {usedPoints} / {maxPoints}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {COMP_KEYS.map((key) => (
              <label key={key} className="text-center">
                <span className="text-[9px] uppercase text-muted-foreground">{key.slice(0, 1)}</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={competency[key]}
                  onChange={(e) => setCompetency(key, Number(e.target.value))}
                  className="mt-0.5 w-full rounded border border-border bg-background px-1 py-0.5 text-center text-[11px] font-mono"
                />
              </label>
            ))}
          </div>
          {elite && (
            <p className="text-[10px] text-muted-foreground mt-1">{elite.description}</p>
          )}
          {template && (
            <p className="text-[10px] text-muted-foreground mt-1">{template.description}</p>
          )}
        </div>
      )}

      {source === "adversary" && (
        <p className="text-[10px] text-muted-foreground">
          Defender only — no competencies or Railjack systems. High HP/shields vs boarding parties.
        </p>
      )}

      {traitOptions.length > 0 && (
        <label className="block">
          <span className="text-[10px] text-muted-foreground">Elite trait</span>
          <select
            className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={working.eliteTraitId ?? ""}
            onChange={(e) =>
              onChange(ensureSlot({ eliteTraitId: e.target.value || undefined }))
            }
          >
            <option value="">None</option>
            {traitOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.text}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
