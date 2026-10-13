"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Save, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ADD_ITEM_TEMPLATES,
  HIDDEN_OVERRIDE_FIELDS,
  OVERRIDE_ACTION_LABELS,
  OVERRIDE_CATEGORY_LABELS,
  formatOverrideFieldLabel,
  getNestedRecordFields,
  getStructuredOverrideFields,
  getSelectOptions,
  groupScalarFieldsForCategory,
  sortFieldsForCategory,
  STAT_RECORD_HELP,
  OVERRIDE_EDITOR_CATEGORIES,
} from "@/lib/overrides/override-schemas";
import {
  buildNestedPatch,
  deepMergeOverrideFields,
  flattenRecordFields,
  OVERRIDE_DELETE,
} from "@/lib/overrides/override-merge";
import {
  DataOverride,
  OverrideCategory,
  generateOverrideId,
  saveOverride,
} from "@/lib/overrides/data-overrides";
import { toEffectDrafts, draftsToEffectsPayload } from "@/lib/overrides/arcane-effect-drafts";
import {
  AbilitiesEditor,
  ArcaneEffectLineDraft,
  ArcaneEffectsEditor,
  ArcaneTriggerPicker,
  RadialAttackDraft,
  RadialAttacksEditor,
  StatRowsEditor,
  STAT_ROW_DELETE_MARKER,
  draftToRadialAttack,
  toRadialAttackDrafts,
} from "@/components/override-field-editors";
import type { AbilityDraft } from "@/lib/overrides/ability-override-fields";
import { abilitiesToDrafts, draftsToAbilitiesPayload } from "@/lib/overrides/ability-override-fields";
import {
  getAllItems,
  getItemData,
  getArcaneEffectDef,
  findExistingOverrideId,
  splitArcaneSaveFields,
  valuesEqual,
  getOriginalAtPath,
  inferInputType,
  parseScalarValue,
} from "@/lib/overrides/override-editor-helpers";
import {
  getArcaneCatalogStatPickerOptions,
  getModStatPickerOptions,
  getShardStatPickerOptions,
} from "@/lib/overrides/override-stat-catalog";
import { toast } from "sonner";

const CATEGORY_LABELS = OVERRIDE_CATEGORY_LABELS;

function toAbilityDrafts(raw: unknown): AbilityDraft[] {
  return abilitiesToDrafts(raw);
}

function abilitiesChanged(original: unknown, draft: AbilityDraft[]): boolean {
  return JSON.stringify(abilitiesToDrafts(original)) !== JSON.stringify(draft);
}

function effectsChanged(original: unknown, draft: ArcaneEffectLineDraft[]): boolean {
  return JSON.stringify(toEffectDrafts(original)) !== JSON.stringify(draft);
}

function radialAttacksChanged(original: unknown, draft: RadialAttackDraft[]): boolean {
  return JSON.stringify(toRadialAttackDrafts(original)) !== JSON.stringify(draft);
}

interface OverrideEditorProps {
  onSave: () => void;
  onCancel: () => void;
  backLink?: { href: string; label: string };
  prefill?: {
    existingOverrideId?: string;
    category?: OverrideCategory;
    itemId?: string;
    note?: string;
    action?: "modify" | "add" | "remove";
    fields?: Record<string, unknown>;
  };
}

export function OverrideEditor({ onSave, onCancel, backLink, prefill }: OverrideEditorProps) {
  const [category, setCategory] = useState<OverrideCategory>(prefill?.category ?? "mod");
  const [action, setAction] = useState<"modify" | "add" | "remove">(prefill?.action ?? "modify");
  const [selectedItemId, setSelectedItemId] = useState<string>(prefill?.itemId ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [note, setNote] = useState(prefill?.note ?? "");
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, string>>({});
  const [effectLines, setEffectLines] = useState<ArcaneEffectLineDraft[]>([]);
  const [radialAttacks, setRadialAttacks] = useState<RadialAttackDraft[]>([]);
  const [abilities, setAbilities] = useState<AbilityDraft[]>([]);
  const [structuredTouched, setStructuredTouched] = useState({
    effects: false,
    abilities: false,
    radialAttacks: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const nestedRecordFields = useMemo(() => getNestedRecordFields(category), [category]);
  const structuredFields = useMemo(() => new Set(getStructuredOverrideFields(category)), [category]);

  const items = useMemo(() => getAllItems(category), [category]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const itemData = useMemo(() => {
    if (action === "add") return ADD_ITEM_TEMPLATES[category] ?? null;
    if (!selectedItemId) return null;
    return getItemData(category, selectedItemId);
  }, [category, selectedItemId, action]);

  const scalarFields = useMemo(() => {
    if (!itemData) return [];
    const nested = new Set(nestedRecordFields);
    const keys = Object.entries(itemData)
      .filter(([key, value]) => {
        if (HIDDEN_OVERRIDE_FIELDS.has(key) || nested.has(key) || structuredFields.has(key)) return false;
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) return false;
        return true;
      })
      .map(([key]) => key);
    const ordered = sortFieldsForCategory(category, keys).filter(
      (key) => !((category === "arcane" || category === "arcane_effect") && key === "trigger"),
    );
    return ordered.map((key) => ({
      key,
      currentValue: itemData[key],
      inputType: inferInputType(key, itemData[key], category),
    }));
  }, [itemData, nestedRecordFields, structuredFields, category]);

  const scalarFieldSections = useMemo(
    () => groupScalarFieldsForCategory(category, scalarFields),
    [category, scalarFields],
  );

  const nestedStatRows = useMemo(() => {
    if (!itemData) return [];
    const rows: { recordField: string; key: string; path: string; value: unknown }[] = [];
    for (const recordField of nestedRecordFields) {
      const record = itemData[recordField] as Record<string, unknown> | undefined;
      for (const row of flattenRecordFields(recordField, record)) {
        rows.push({ recordField, ...row });
      }
    }
    return rows;
  }, [itemData, nestedRecordFields]);

  useEffect(() => {
    if (!itemData) return;
    queueMicrotask(() => {
      setEffectLines(toEffectDrafts(itemData.effects));
      setAbilities(toAbilityDrafts(itemData.abilities));
      setRadialAttacks(toRadialAttackDrafts(itemData.radialAttacks));
      setStructuredTouched({ effects: false, abilities: false, radialAttacks: false });
    });
  }, [itemData, selectedItemId, category]);

  useEffect(() => {
    const prefillFields = prefill?.fields;
    if (!prefillFields || Object.keys(prefillFields).length === 0) return;
    queueMicrotask(() => {
      const flat: Record<string, string> = {};
      const walk = (obj: Record<string, unknown>, prefix = "") => {
        for (const [key, value] of Object.entries(obj)) {
          const path = prefix ? `${prefix}.${key}` : key;
          if (value === null || value === OVERRIDE_DELETE) {
            flat[path] = STAT_ROW_DELETE_MARKER;
            continue;
          }
          if (nestedRecordFields.includes(prefix ? prefix.split(".")[0] : key) && typeof value === "object" && !Array.isArray(value)) {
            walk(value as Record<string, unknown>, path);
          } else if (key === "effects" && Array.isArray(value)) {
            setEffectLines(toEffectDrafts(value));
            setStructuredTouched((s) => ({ ...s, effects: true }));
          } else if (key === "abilities" && Array.isArray(value)) {
            setAbilities(toAbilityDrafts(value));
            setStructuredTouched((s) => ({ ...s, abilities: true }));
          } else if (key === "radialAttacks" && Array.isArray(value)) {
            setRadialAttacks(toRadialAttackDrafts(value));
            setStructuredTouched((s) => ({ ...s, radialAttacks: true }));
          } else if (typeof value !== "object") {
            flat[path] = String(value);
          }
        }
      };
      walk(prefillFields);
      setFieldOverrides(flat);
    });
  }, [prefill?.fields, nestedRecordFields]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const resetEditorState = () => {
    setFieldOverrides({});
    setStructuredTouched({ effects: false, abilities: false, radialAttacks: false });
  };

  const handleCategoryChange = (cat: OverrideCategory) => {
    setCategory(cat);
    setSelectedItemId("");
    setSearchQuery("");
    resetEditorState();
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    setShowDropdown(false);
    setSearchQuery("");
    if (!prefill?.existingOverrideId) resetEditorState();
  };

  const handleFieldChange = (path: string, value: string) => {
    setFieldOverrides((prev) => {
      const next = { ...prev };
      if (value === "") delete next[path];
      else next[path] = value;
      return next;
    });
  };

  const seedFieldOnFocus = (path: string, current: unknown) => {
    if (fieldOverrides[path] !== undefined) return;
    if (current == null || current === "") return;
    handleFieldChange(path, String(current));
  };

  const handleAddStatKey = (recordField: string, key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    handleFieldChange(`${recordField}.${trimmed}`, fieldOverrides[`${recordField}.${trimmed}`] ?? "0");
  };

  const handleRemoveStatKey = (path: string) => {
    handleFieldChange(path, STAT_ROW_DELETE_MARKER);
  };

  const statPickerOptions = useMemo(() => {
    if (category === "mod") return getModStatPickerOptions();
    if (category === "arcane") return getArcaneCatalogStatPickerOptions();
    if (category === "archon_shard") return getShardStatPickerOptions();
    return [];
  }, [category]);

  const buildFields = (): Record<string, unknown> => {
    const flat: Record<string, unknown> = {};
    for (const [path, rawValue] of Object.entries(fieldOverrides)) {
      if (rawValue === "") continue;
      // Strip bogus nested stats (and top-level fields) from mass wiki parse.
      if (rawValue === STAT_ROW_DELETE_MARKER) {
        flat[path] = OVERRIDE_DELETE;
        continue;
      }
      const original = getOriginalAtPath(itemData, path);
      const parsed = parseScalarValue(rawValue, original);
      if (valuesEqual(parsed, original)) continue;
      flat[path] = parsed;
    }
    const fields = buildNestedPatch(flat);

    if (structuredFields.has("effects") || category === "arcane" || category === "arcane_effect") {
      if (structuredTouched.effects || effectsChanged(itemData?.effects, effectLines)) {
        fields.effects = draftsToEffectsPayload(effectLines);
      }
    }
    if (structuredFields.has("abilities") && (structuredTouched.abilities || abilitiesChanged(itemData?.abilities, abilities))) {
      fields.abilities = draftsToAbilitiesPayload(abilities);
    }
    if (
      structuredFields.has("radialAttacks")
      && (structuredTouched.radialAttacks || radialAttacksChanged(itemData?.radialAttacks, radialAttacks))
    ) {
      fields.radialAttacks = radialAttacks
        .map(draftToRadialAttack)
        .filter((a): a is NonNullable<typeof a> => a != null);
    }
    return fields;
  };

  const handleSave = async () => {
    const targetId = action === "add" ? selectedItemId.trim() : selectedItemId;
    if (!targetId?.trim()) {
      toast.error("Please select an item first.");
      return;
    }

    try {
      if (action === "remove") {
        await saveOverride({
          id: prefill?.existingOverrideId ?? findExistingOverrideId(category, targetId.trim()) ?? generateOverrideId(),
          targetType: category,
          targetId: targetId.trim(),
          action,
          fields: {},
          note: note.trim(),
          timestamp: Date.now(),
        });
        onSave();
        return;
      }

      const timestamp = Date.now();
      const trimmedNote = note.trim();
      const trimmedId = targetId.trim();

      if (action === "add") {
        const template = { ...(ADD_ITEM_TEMPLATES[category] ?? {}), id: trimmedId };
        const patch = buildFields();
        const fields = deepMergeOverrideFields(template, patch);
        fields.id = trimmedId;
        if (Object.keys(fields).length <= 1) {
          toast.error("Fill in at least one field for the new item.");
          return;
        }
        await saveOverride({
          id: prefill?.existingOverrideId ?? findExistingOverrideId(category, trimmedId) ?? generateOverrideId(),
          targetType: category,
          targetId: trimmedId,
          action: "add",
          fields,
          note: trimmedNote,
          timestamp,
        });
        onSave();
        return;
      }

      const fields = buildFields();
      if (Object.keys(fields).length === 0) {
        toast.error("Change at least one field before saving.");
        return;
      }

      const persist = async (
        targetType: OverrideCategory,
        patch: Record<string, unknown>,
        existingOverrideId?: string,
        saveAction: DataOverride["action"] = action,
      ) => {
        await saveOverride({
          id: existingOverrideId ?? findExistingOverrideId(targetType, trimmedId) ?? generateOverrideId(),
          targetType,
          targetId: trimmedId,
          action: saveAction,
          fields: patch,
          note: trimmedNote,
          timestamp,
        });
      };

      if (category === "arcane") {
        const { catalog, effectDef } = splitArcaneSaveFields(fields);
        if (Object.keys(catalog).length === 0 && Object.keys(effectDef).length === 0) {
          toast.error("Change at least one field before saving.");
          return;
        }
        if (Object.keys(catalog).length > 0) {
          await persist("arcane", catalog, prefill?.category === "arcane" ? prefill.existingOverrideId : findExistingOverrideId("arcane", trimmedId));
        }
        if (Object.keys(effectDef).length > 0) {
          const catalogArcane = getItemData("arcane", trimmedId);
          const baseEffect = getArcaneEffectDef(trimmedId);
          const enriched: Record<string, unknown> = {
            name: baseEffect?.name ?? (catalogArcane?.name as string | undefined) ?? trimmedId,
            trigger: effectDef.trigger ?? baseEffect?.trigger ?? "passive",
            maxRank: effectDef.maxRank ?? baseEffect?.maxRank ?? catalogArcane?.maxRank ?? 5,
            ...effectDef,
          };
          if (baseEffect?.stackCap != null && enriched.stackCap === undefined) {
            enriched.stackCap = baseEffect.stackCap;
          }
          await persist(
            "arcane_effect",
            enriched,
            prefill?.category === "arcane_effect" ? prefill.existingOverrideId : findExistingOverrideId("arcane_effect", trimmedId),
          );
        }
      } else {
        await persist(category, fields, prefill?.existingOverrideId);
      }

      onSave();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save override");
    }
  };

  const selectedItemName = items.find((i) => i.id === selectedItemId)?.name ?? "";
  const scalarChangeCount = useMemo(() => {
    let count = 0;
    for (const [path, rawValue] of Object.entries(fieldOverrides)) {
      if (rawValue === "") continue;
      const original = getOriginalAtPath(itemData, path);
      const parsed = parseScalarValue(rawValue, original);
      if (!valuesEqual(parsed, original)) count++;
    }
    return count;
  }, [fieldOverrides, itemData]);
  const structuredChangeCount =
    ((category === "arcane" || category === "arcane_effect" || structuredFields.has("effects"))
      && (structuredTouched.effects || effectsChanged(itemData?.effects, effectLines)) ? 1 : 0)
    + (structuredFields.has("abilities") && (structuredTouched.abilities || abilitiesChanged(itemData?.abilities, abilities)) ? 1 : 0)
    + (structuredFields.has("radialAttacks") && (structuredTouched.radialAttacks || radialAttacksChanged(itemData?.radialAttacks, radialAttacks)) ? 1 : 0);
  const changedCount = scalarChangeCount + structuredChangeCount;

  const isFieldChanged = (path: string, current: unknown) => {
    const raw = fieldOverrides[path];
    if (raw === undefined || raw === "") return false;
    if (raw === STAT_ROW_DELETE_MARKER) return true;
    return !valuesEqual(parseScalarValue(raw, current), current);
  };
  const canEditFields = Boolean(selectedItemId && action !== "remove") || action === "add";

  return (
    <div className="mb-6 rounded-xl border border-purple-500/30 bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {backLink && (
            <Link
              href={backLink.href}
              className="mb-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              {backLink.label}
            </Link>
          )}
          <h2 className="text-sm font-semibold text-purple-800 dark:text-purple-400">
            {prefill?.existingOverrideId ? "Edit data fix" : action === "remove" ? "Hide item from site" : action === "add" ? "Add new item" : "Fix item data"}
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Pick an item, click a field to edit its current value, then save.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Close editor">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs text-muted-foreground">What do you want to do?</label>
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "modify" as const, label: OVERRIDE_ACTION_LABELS.modify },
            { id: "add" as const, label: OVERRIDE_ACTION_LABELS.add },
            { id: "remove" as const, label: OVERRIDE_ACTION_LABELS.remove },
          ]).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAction(id)}
              className={cn(
                "rounded-lg border px-3 min-h-11 text-xs transition-colors",
                action === id ? "border-purple-600 bg-purple-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs text-muted-foreground">Item type</label>
        <div className="flex flex-wrap gap-1.5">
          {OVERRIDE_EDITOR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "rounded-lg border px-2.5 min-h-11 text-xs transition-colors",
                category === cat ? "border-purple-600 bg-purple-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {action === "add" && (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs text-muted-foreground">New item ID (internal name, no spaces)</label>
          <input
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            placeholder="e.g. augment_hildryn_pillage"
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      )}

      {action !== "add" && (
        <div className="mb-4" ref={dropdownRef}>
          <label className="mb-1.5 block text-xs text-muted-foreground">Find item</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm hover:border-purple-500/50"
            >
              <span className={selectedItemName ? "text-foreground" : "text-muted-foreground"}>
                {selectedItemName || "Search and select..."}
              </span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showDropdown && "rotate-180")} />
            </button>
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <div className="border-b border-border p-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type to search..."
                      className="min-h-11 h-11 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item.id)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/50",
                        selectedItemId === item.id && "bg-purple-500/10 text-purple-800 dark:text-purple-400",
                        item.hidden && "opacity-70 italic",
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                      {item.hidden && (
                        <span className="ml-2 shrink-0 text-[10px] text-red-700 dark:text-red-400">hidden</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {canEditFields && (
        <div className="mb-4 space-y-5">
          {(category === "arcane" || category === "arcane_effect") && (
            <>
              {selectedItemName && (
                <p className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-[11px] text-muted-foreground">
                  Edit the numbers below for <strong className="text-foreground">{selectedItemName}</strong>.
                  Most arcanes only need <strong className="text-foreground">Effect base values</strong> — e.g. Ammo Efficiency for Akimbo Slip Shot.
                </p>
              )}
              <ArcaneTriggerPicker
                value={fieldOverrides.trigger ?? ""}
                currentValue={String(itemData?.trigger ?? "")}
                onChange={(trigger) => handleFieldChange("trigger", trigger)}
              />
              <ArcaneEffectsEditor
                lines={effectLines}
                maxRank={Number(itemData?.maxRank ?? 5)}
                onChange={(lines) => {
                  setEffectLines(lines);
                  setStructuredTouched((s) => ({ ...s, effects: true }));
                }}
              />
            </>
          )}

          {scalarFieldSections.some((s) => s.fields.length > 0) && (
            <div className="space-y-5">
              {scalarFieldSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-xs font-medium text-foreground">{section.title}</p>
                  {section.fields.map(({ key, currentValue, inputType }) => {
                    const overrideValue = fieldOverrides[key] ?? "";
                    const selectOptions = getSelectOptions(key, category);
                    return (
                      <label key={key} className="block text-[11px]">
                        <span className="text-muted-foreground">{formatOverrideFieldLabel(key)}</span>
                        {inputType === "select" && selectOptions ? (
                          <select
                            value={overrideValue}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="mt-0.5 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                          >
                            <option value="">Leave as-is ({String(currentValue ?? "—")})</option>
                            {selectOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : inputType === "textarea" ? (
                          <textarea
                            value={overrideValue}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            onFocus={() => seedFieldOnFocus(key, currentValue)}
                            placeholder={String(currentValue ?? "Leave as-is")}
                            rows={3}
                            className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm resize-y"
                          />
                        ) : inputType === "boolean" ? (
                          <select
                            value={overrideValue}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="mt-0.5 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                          >
                            <option value="">Leave as-is ({String(currentValue)})</option>
                            <option value="true">Yes / True</option>
                            <option value="false">No / False</option>
                          </select>
                        ) : (
                          <input
                            type={inputType === "number" ? "number" : "text"}
                            step={inputType === "number" ? "any" : undefined}
                            value={overrideValue}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            onFocus={() => seedFieldOnFocus(key, currentValue)}
                            placeholder={`Current: ${String(currentValue ?? "—")}`}
                            className="mt-0.5 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {nestedRecordFields.map((recordField) => (
            <StatRowsEditor
              key={recordField}
              title={formatOverrideFieldLabel(recordField)}
              helperText={STAT_RECORD_HELP[category]}
              rows={nestedStatRows.filter((r) => r.recordField === recordField)}
              overrideValues={fieldOverrides}
              onChange={handleFieldChange}
              onFocusField={seedFieldOnFocus}
              isFieldChanged={isFieldChanged}
              onAddKey={(key) => handleAddStatKey(recordField, key)}
              onRemoveKey={handleRemoveStatKey}
              statOptions={statPickerOptions}
              maxRank={
                category === "mod" && itemData?.maxRank != null
                  ? Number(itemData.maxRank)
                  : undefined
              }
            />
          ))}

          {structuredFields.has("abilities") && (
            <AbilitiesEditor
              abilities={abilities}
              allowAddAbility={category === "warframe"}
              allowRemoveAbility={action === "add" && category === "warframe"}
              allowRename={action === "add" && category === "warframe"}
              onChange={(draft) => {
                setAbilities(draft);
                setStructuredTouched((s) => ({ ...s, abilities: true }));
              }}
            />
          )}

          {structuredFields.has("radialAttacks") && (
            <RadialAttacksEditor
              attacks={radialAttacks}
              onChange={(draft) => {
                setRadialAttacks(draft);
                setStructuredTouched((s) => ({ ...s, radialAttacks: true }));
              }}
            />
          )}
        </div>
      )}

      {selectedItemId && action === "remove" && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-700 dark:text-red-400">
            <strong>{selectedItemName || selectedItemId}</strong> will be hidden on the site until this fix is removed.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-xs text-muted-foreground">Note (why you&apos;re changing this)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Wiki says drain should be -2 at rank 0"
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-purple-500/50 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={action !== "add" && !selectedItemId}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {action === "remove" ? "Save hide" : prefill?.existingOverrideId ? "Update fix" : `Save fix${changedCount > 0 ? ` (${changedCount} change${changedCount === 1 ? "" : "s"})` : ""}`}
      </button>
    </div>
  );
}
