"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatKeyAddRow } from "@/components/stat-key-picker";
import {
  ABILITY_DAMAGE_TYPE_OPTIONS,
  ABILITY_FIELD_DEFS,
  ABILITY_FIELD_GROUPS,
  type AbilityDraft,
  getAbilityMiscStatLabel,
  getAbilityMiscStatPickerOptions,
  getAddableAbilityFields,
} from "@/lib/overrides/ability-override-fields";

export type { AbilityDraft };

function OptionalNumberInput({
  label,
  value,
  onChange,
  placeholder = "—",
  step = "any",
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  step?: string;
}) {
  return (
    <label className="block text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        placeholder={placeholder}
        className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm"
      />
    </label>
  );
}

export function AbilitiesEditor({
  abilities,
  onChange,
  allowAddAbility = false,
  allowRemoveAbility = false,
  allowRename = false,
}: {
  abilities: AbilityDraft[];
  onChange: (abilities: AbilityDraft[]) => void;
  allowAddAbility?: boolean;
  allowRemoveAbility?: boolean;
  allowRename?: boolean;
}) {
  const update = (index: number, patch: Partial<AbilityDraft>) => {
    onChange(abilities.map((ab, i) => (i === index ? { ...ab, ...patch } : ab)));
  };

  const addField = (index: number, fieldKey: string) => {
    const draft = abilities[index];
    if (!draft || draft.visibleFields.includes(fieldKey)) return;
    update(index, { visibleFields: [...draft.visibleFields, fieldKey] });
  };

  const removeField = (index: number, fieldKey: string) => {
    const draft = abilities[index];
    if (!draft) return;
    const visibleFields = draft.visibleFields.filter((k) => k !== fieldKey);
    const { [fieldKey as keyof AbilityDraft]: _removed, ...rest } = {
      ...draft,
      visibleFields,
    };
    update(index, rest as AbilityDraft);
  };

  const addAbility = () => {
    onChange([
      ...abilities,
      {
        name: "",
        energyCost: 25,
        description: "",
        visibleFields: [],
      },
    ]);
  };

  const removeAbility = (index: number) => {
    onChange(abilities.filter((_, i) => i !== index));
  };

  const miscStatOptions = getAbilityMiscStatPickerOptions();

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-foreground">Abilities</p>
        <p className="text-[11px] text-muted-foreground">
          Edit ability numbers used in build math and TTK. Add only the fields this ability needs — same idea as mod stat pickers.
        </p>
      </div>
      {abilities.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No abilities on this item yet.</p>
      )}
      {abilities.map((ability, index) => {
        const addable = getAddableAbilityFields(ability);
        return (
          <div key={index} className="rounded-lg border border-border bg-muted/10 p-3 space-y-3">
            <div className="flex items-start justify-between gap-2">
              {(allowRename || !ability.name.trim()) ? (
                <label className="block min-w-0 flex-1 text-[11px]">
                  <span className="text-muted-foreground">Ability name</span>
                  <input
                    value={ability.name}
                    onChange={(e) => update(index, { name: e.target.value })}
                    placeholder="e.g. Slash Dash"
                    className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm font-medium"
                  />
                </label>
              ) : (
                <p className="text-sm font-medium">{ability.name || `Ability ${index + 1}`}</p>
              )}
              {allowRemoveAbility && (
                <button
                  type="button"
                  onClick={() => removeAbility(index)}
                  className="shrink-0 text-red-400/70 hover:text-red-400"
                  aria-label="Remove ability"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <label className="block text-[11px]">
              <span className="text-muted-foreground">Description</span>
              <textarea
                value={ability.description}
                onChange={(e) => update(index, { description: e.target.value })}
                rows={2}
                className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1.5 text-sm resize-y"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block text-[11px]">
                <span className="text-muted-foreground">Energy cost</span>
                <input
                  type="number"
                  value={ability.energyCost ?? ""}
                  onChange={(e) => update(index, { energyCost: Number(e.target.value) })}
                  className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm"
                />
              </label>
            </div>

            {ABILITY_FIELD_GROUPS.map((group) => {
              const groupFields = ABILITY_FIELD_DEFS.filter(
                (d) => d.group === group && ability.visibleFields.includes(d.key),
              );
              if (!groupFields.length) return null;
              return (
                <div key={group} className="space-y-2 rounded-md border border-border/60 bg-background/40 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupFields.map((def) => {
                      if (def.key === "miscStats") return null;
                      if (def.kind === "damageType") {
                        return (
                          <label key={def.key} className="block text-[11px] sm:col-span-2">
                            <span className="text-muted-foreground">{def.label}</span>
                            <select
                              value={ability.damageType ?? ""}
                              onChange={(e) =>
                                update(index, { damageType: e.target.value || undefined })
                              }
                              className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm"
                            >
                              <option value="">—</option>
                              {ABILITY_DAMAGE_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        );
                      }
                      if (def.kind === "subAbilities") {
                        return (
                          <label key={def.key} className="block text-[11px] sm:col-span-2">
                            <span className="text-muted-foreground">{def.label}</span>
                            <input
                              value={ability.subAbilities?.join(", ") ?? ""}
                              onChange={(e) =>
                                update(index, {
                                  subAbilities: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                              placeholder={def.placeholder}
                              className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm"
                            />
                          </label>
                        );
                      }
                      const val = ability[def.key as keyof AbilityDraft] as number | undefined;
                      return (
                        <div key={def.key} className="relative">
                          <OptionalNumberInput
                            label={def.label}
                            value={val}
                            onChange={(v) => update(index, { [def.key]: v } as Partial<AbilityDraft>)}
                            placeholder={def.placeholder}
                            step={def.kind === "percent" ? "0.01" : "any"}
                          />
                          <button
                            type="button"
                            onClick={() => removeField(index, def.key)}
                            className="absolute right-0 top-0 text-[10px] text-muted-foreground hover:text-red-400"
                          >
                            remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {ability.visibleFields.includes("miscStats") && (
              <div className="space-y-2 rounded-md border border-border/60 bg-background/40 p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Extra stats (miscStats)
                  </p>
                  <button
                    type="button"
                    onClick={() => removeField(index, "miscStats")}
                    className="text-[10px] text-muted-foreground hover:text-red-400"
                  >
                    remove section
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Shield strip, decoy radius, etc. — used by ability scaling where verified.
                </p>
                {Object.entries(ability.miscStats ?? {}).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                    <span className="text-xs">{getAbilityMiscStatLabel(key)}</span>
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) =>
                        update(index, {
                          miscStats: {
                            ...(ability.miscStats ?? {}),
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                      className="h-8 w-24 rounded border border-border bg-background px-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...(ability.miscStats ?? {}) };
                        delete next[key];
                        update(index, { miscStats: next });
                      }}
                      className="text-red-400/70 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <StatKeyAddRow
                  options={miscStatOptions}
                  usedKeys={new Set(Object.keys(ability.miscStats ?? {}))}
                  onAdd={(key) =>
                    update(index, {
                      miscStats: { ...(ability.miscStats ?? {}), [key]: 0 },
                    })
                  }
                />
              </div>
            )}

            {addable.length > 0 && (
              <label className="block text-[11px]">
                <span className="text-muted-foreground">Add calculable field</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const key = e.target.value;
                    if (!key) return;
                    addField(index, key);
                    e.target.value = "";
                  }}
                  className="mt-0.5 h-8 w-full rounded border border-border bg-background px-2 text-sm"
                >
                  <option value="">Choose field to add…</option>
                  {addable.map((def) => (
                    <option key={def.key} value={def.key}>
                      {def.group}: {def.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        );
      })}
      {allowAddAbility && (
        <button
          type="button"
          onClick={addAbility}
          className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-purple-500/40 hover:text-purple-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add ability
        </button>
      )}
    </div>
  );
}
