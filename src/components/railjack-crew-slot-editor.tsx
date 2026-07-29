"use client";

import { useMemo, useState } from "react";
import {
  adversaryCrewProfiles,
  commandCompetencyBonusPoints,
  competencyTotal,
  CREW_ROLE_LABELS,
  eliteCrewUnlocked,
  eliteTraitsForCompetency,
  emptyCompetency,
  findEliteTrait,
  findNamedEliteCrew,
  findTickerTemplate,
  highestCompetencyKey,
  namedEliteCrew,
  namedEliteFixedTraitId,
  tickerCrewTemplates,
  unusualCrewUnlocked,
  type CrewCompetency,
  type CrewRole,
  type CrewSource,
  type CrewWeaponLoadout,
  type RailjackCrewSlot,
} from "@/data/railjack-crew";
import {
  clampProgenitorBonusPercent,
  emptyCrewWeaponLoadout,
  filterAdversaryWeapons,
  filterCrewAssignableWeapons,
  isCrewWeaponTakenByOtherSlot,
} from "@/data/railjack-crew-weapons";
import { ModSlotCard } from "@/components/mod-slot";
import { ModPicker } from "@/components/mod-picker";
import { ProgenitorControls } from "@/app/weapon-builder/progenitor-controls";
import { computeCrewBoardingDps } from "@/lib/calc/railjack-crew-boarding";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import {
  PROGENITOR_BONUS_DEFAULT,
  weaponSupportsProgenitor,
} from "@/lib/weapons/weapon-progenitor";
import type { EquippedMod, Mod, Weapon } from "@/lib/types";
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
  slotIndex: number;
  allSlots: (RailjackCrewSlot | null)[];
  commandRank: number;
  defaultRole: CrewRole;
  weapons: Weapon[];
  mods: Mod[];
  modsMap: Map<string, Mod>;
  onChange: (next: RailjackCrewSlot | null) => void;
}

export function CrewSlotEditor({
  slot,
  slotIndex,
  allSlots,
  commandRank,
  defaultRole,
  weapons,
  mods,
  modsMap,
  onChange,
}: CrewSlotEditorProps) {
  const [weaponSearch, setWeaponSearch] = useState("");
  const [showWeaponPicker, setShowWeaponPicker] = useState(false);
  const [showMods, setShowMods] = useState(false);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeModSlot, setActiveModSlot] = useState(0);

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
    let competency = partial.competency !== undefined ? partial.competency : slot?.competency;
    let eliteTraitId =
      partial.eliteTraitId !== undefined ? partial.eliteTraitId : slot?.eliteTraitId;
    let weaponLoadout = "weaponLoadout" in partial ? partial.weaponLoadout : slot?.weaponLoadout;

    if (partial.source && partial.source !== slot?.source) {
      if (partial.source === "ticker") {
        nextProfile = tickerCrewTemplates[0]!.id;
        competency = { ...tickerCrewTemplates[0]!.defaultCompetency };
        eliteTraitId = undefined;
        weaponLoadout = undefined;
      } else if (partial.source === "elite") {
        const elite = namedEliteCrew[0]!;
        nextProfile = elite.id;
        competency = { ...elite.competency };
        eliteTraitId = elite.defaultTraitId;
        weaponLoadout = undefined;
      } else {
        nextProfile = adversaryCrewProfiles[0]!.id;
        competency = undefined;
        eliteTraitId = undefined;
        nextRole = "defender";
        weaponLoadout = undefined;
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
        weaponLoadout = undefined;
      }
    }

    if (nextSource === "elite") {
      eliteTraitId = namedEliteFixedTraitId(nextProfile) ?? eliteTraitId;
    }

    return {
      role: nextRole,
      source: nextSource,
      profileId: nextProfile,
      competency,
      eliteTraitId,
      weaponLoadout,
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

  const fixedNamedTrait =
    working.source === "elite" ? findEliteTrait(namedEliteFixedTraitId(working.profileId) ?? "") : undefined;

  const traitOptions =
    working.source === "ticker" && eliteCrewUnlocked(commandRank)
      ? eliteTraitsForCompetency(highestCompetencyKey(competency))
      : [];

  const weaponList = useMemo(() => {
    if (working.source === "adversary") {
      return filterAdversaryWeapons(working.profileId, weapons);
    }
    return filterCrewAssignableWeapons(weapons);
  }, [working.source, working.profileId, weapons]);

  const filteredWeapons = useMemo(() => {
    const q = weaponSearch.trim().toLowerCase();
    return weaponList
      .filter((w) => !q || w.name.toLowerCase().includes(q) || w.id.includes(q))
      .slice(0, 80);
  }, [weaponList, weaponSearch]);

  const selectedWeapon = useMemo(() => {
    const id = working.weaponLoadout?.weaponId;
    if (!id) return null;
    return weapons.find((w) => w.id === id) ?? null;
  }, [working.weaponLoadout?.weaponId, weapons]);

  const boarding = useMemo(() => {
    if (!selectedWeapon || !working.weaponLoadout) return null;
    return computeCrewBoardingDps(working, selectedWeapon, modsMap);
  }, [selectedWeapon, working, modsMap]);

  const setCompetency = (key: keyof CrewCompetency, value: number) => {
    const next = { ...competency, [key]: Math.max(0, Math.min(5, value)) };
    if (competencyTotal(next) > maxPoints) return;
    onChange(ensureSlot({ competency: next }));
  };

  const updateLoadout = (patch: Partial<CrewWeaponLoadout> | null) => {
    if (patch === null) {
      onChange(ensureSlot({ weaponLoadout: undefined }));
      return;
    }
    const base = working.weaponLoadout ?? emptyCrewWeaponLoadout(patch.weaponId ?? "");
    onChange(
      ensureSlot({
        weaponLoadout: {
          ...base,
          ...patch,
          mods: patch.mods ?? base.mods,
        },
      }),
    );
  };

  const selectWeapon = (weapon: Weapon) => {
    if (isCrewWeaponTakenByOtherSlot(allSlots, weapon.id, slotIndex)) return;
    const loadout = emptyCrewWeaponLoadout(weapon.id);
    if (weaponSupportsProgenitor(weapon) || working.source === "adversary") {
      loadout.progenitorElement = "heat";
      loadout.progenitorBonusPercent = PROGENITOR_BONUS_DEFAULT;
    }
    onChange(ensureSlot({ weaponLoadout: loadout }));
    setShowWeaponPicker(false);
    setShowMods(true);
  };

  const weaponMods: EquippedMod[] = (working.weaponLoadout?.mods ?? []).map((m) => {
    const mod = modsMap.get(m.modId);
    return {
      ...m,
      modName: mod?.name ?? m.modId,
      polarity: mod?.polarity,
      drain: mod?.drain,
    };
  });

  const modCategory = selectedWeapon ? getModCategory(selectedWeapon.category) : "primary";

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
          Defender only — Kuva / Tenet / Coda weapon + progenitor %. No competencies or ship systems.
        </p>
      )}

      {fixedNamedTrait && (
        <div className="rounded border border-violet-500/30 bg-violet-500/5 px-2 py-1.5">
          <p className="text-[10px] font-medium text-violet-300">Fixed elite trait</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{fixedNamedTrait.text}</p>
        </div>
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

      {/* Weapon */}
      <div className="rounded border border-border/60 p-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
            WEAPON
          </span>
          <div className="flex gap-2">
            {selectedWeapon && (
              <button
                type="button"
                className="text-[10px] text-muted-foreground hover:text-foreground"
                onClick={() => setShowMods((v) => !v)}
              >
                {showMods ? "Hide mods" : "Mods"}
              </button>
            )}
            {selectedWeapon && (
              <button
                type="button"
                className="text-[10px] text-muted-foreground hover:text-red-400"
                onClick={() => updateLoadout(null)}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowWeaponPicker((v) => !v)}
          className={cn(
            "w-full rounded border p-2 text-left text-xs transition-all",
            selectedWeapon
              ? "border-orange-500/40 bg-orange-500/5"
              : "border-dashed border-border hover:border-orange-500/30",
          )}
        >
          {selectedWeapon ? (
            <>
              <span className="font-medium">{selectedWeapon.name}</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5 capitalize">
                {selectedWeapon.category}
                {boarding && (
                  <> · Boarding DPS {Math.round(boarding.boardingDps).toLocaleString()}</>
                )}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              {source === "adversary"
                ? "Select Kuva / Tenet / Coda weapon"
                : "Select rifle / shotgun / secondary"}
            </span>
          )}
        </button>

        {boarding && boarding.combatDamageBonus > 0 && (
          <p className="text-[10px] text-cyan-600 dark:text-cyan-400">
            Combat +{(boarding.combatDamageBonus * 100).toFixed(0)}% vs raiders applied
          </p>
        )}

        {showWeaponPicker && (
          <div className="space-y-1.5">
            <input
              type="search"
              value={weaponSearch}
              onChange={(e) => setWeaponSearch(e.target.value)}
              placeholder="Search weapons…"
              className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
            />
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredWeapons.map((w) => {
                const taken = isCrewWeaponTakenByOtherSlot(allSlots, w.id, slotIndex);
                return (
                  <button
                    key={w.id}
                    type="button"
                    disabled={taken}
                    onClick={() => selectWeapon(w)}
                    className={cn(
                      "w-full rounded border p-1.5 text-left text-[11px]",
                      selectedWeapon?.id === w.id
                        ? "border-orange-500/50 bg-orange-500/10"
                        : "border-border hover:border-orange-500/30",
                      taken && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    <span className="font-medium">{w.name}</span>
                    {taken && (
                      <span className="ml-1 text-[10px] text-muted-foreground">(in use)</span>
                    )}
                  </button>
                );
              })}
              {filteredWeapons.length === 0 && (
                <p className="text-[10px] text-muted-foreground px-1">No matching weapons</p>
              )}
            </div>
          </div>
        )}

        {selectedWeapon &&
          (weaponSupportsProgenitor(selectedWeapon) || source === "adversary") && (
            <ProgenitorControls
              progenitorElement={working.weaponLoadout?.progenitorElement ?? "heat"}
              progenitorBonusPercent={clampProgenitorBonusPercent(
                working.weaponLoadout?.progenitorBonusPercent,
              )}
              onElementChange={(element) =>
                updateLoadout({ progenitorElement: element })
              }
              onBonusChange={(percent) =>
                updateLoadout({ progenitorBonusPercent: clampProgenitorBonusPercent(percent) })
              }
            />
          )}

        {selectedWeapon && showMods && (
          <div>
            <p className="text-[10px] text-muted-foreground mb-1.5">Weapon mods (8 slots)</p>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }, (_, i) => {
                const equipped = weaponMods.find((m) => m.slotIndex === i);
                const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                return (
                  <ModSlotCard
                    key={`crew-wmod-${i}`}
                    mod={mod}
                    rank={equipped?.rank ?? 0}
                    slotIndex={i}
                    compact
                    slotPolarity={working.weaponLoadout?.slotPolarities?.[i]}
                    onAdd={() => {
                      setActiveModSlot(i);
                      setModPickerOpen(true);
                    }}
                    onRemove={() => {
                      const nextMods = (working.weaponLoadout?.mods ?? []).filter(
                        (m) => m.slotIndex !== i,
                      );
                      updateLoadout({ mods: nextMods });
                    }}
                    onPolarize={(p) => {
                      const next = { ...(working.weaponLoadout?.slotPolarities ?? {}) };
                      if (p) next[i] = p;
                      else delete next[i];
                      updateLoadout({ slotPolarities: next });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ModPicker
        open={modPickerOpen}
        onClose={() => setModPickerOpen(false)}
        mods={mods}
        category={modCategory}
        weaponCategory={selectedWeapon?.category}
        weapon={selectedWeapon ?? undefined}
        equippedModIds={weaponMods.map((m) => m.modId)}
        onSelect={(mod, rank) => {
          const nextMods = (working.weaponLoadout?.mods ?? []).filter(
            (m) => m.slotIndex !== activeModSlot,
          );
          nextMods.push({ modId: mod.id, rank, slotIndex: activeModSlot });
          updateLoadout({ mods: nextMods });
        }}
      />
    </div>
  );
}
