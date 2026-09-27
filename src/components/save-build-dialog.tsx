"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUILD_TAG_OPTIONS } from "@/lib/builds/build-tags";

export interface SaveBuildDialogValues {
  name: string;
  description: string;
  isPublic: boolean;
  tags: string[];
}

interface SaveBuildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  defaultDescription?: string;
  defaultIsPublic?: boolean;
  defaultTags?: string[];
  showDescription?: boolean;
  title?: string;
  onSave: (values: SaveBuildDialogValues) => Promise<void>;
}

export function SaveBuildDialog({
  open,
  onOpenChange,
  defaultName,
  defaultDescription = "",
  defaultIsPublic = false,
  defaultTags = [],
  showDescription = true,
  title = "Save Build",
  onSave,
}: SaveBuildDialogProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isPublic, setIsPublic] = useState(defaultIsPublic);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [saving, setSaving] = useState(false);

  // Snapshot defaults in a ref so the reset effect runs only when the dialog
  // opens. Inline props like `defaultTags={[]}` create a new reference every
  // render; depending on them directly caused an infinite setState loop
  // ("Maximum update depth exceeded") that crashed the page on open.
  const defaultsRef = useRef({ defaultName, defaultDescription, defaultIsPublic, defaultTags });
  defaultsRef.current = { defaultName, defaultDescription, defaultIsPublic, defaultTags };

  useEffect(() => {
    if (open) {
      const d = defaultsRef.current;
      setName(d.defaultName);
      setDescription(d.defaultDescription);
      setIsPublic(d.defaultIsPublic);
      setTags(d.defaultTags);
    }
  }, [open]);

  const toggleTag = (id: string) => {
    setTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim(), isPublic, tags });
      onOpenChange(false);
    } catch (err) {
      console.error("Save build dialog failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Save to your account. Optionally list it in Community Builds so others can find and upvote it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="build-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="build-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My build"
                maxLength={200}
                autoFocus
              />
            </div>

            {showDescription && (
              <div className="space-y-2">
                <label htmlFor="build-description" className="text-sm font-medium">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="build-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes about this build…"
                  maxLength={2000}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}

            <label
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                isPublic ? "border-primary/50 bg-primary/5" : "border-border hover:bg-secondary/30"
              )}
            >
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <div>
                <div className="text-sm font-medium">List in Community Builds</div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Public builds can be searched and upvoted by anyone. You can change this later in Profile.
                </p>
              </div>
            </label>

            {isPublic && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Meta tags</div>
                <p className="text-[11px] text-muted-foreground">
                  Help others find this build (Steel Path, budget, boss, …).
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {BUILD_TAG_OPTIONS.map((t) => {
                    const on = tags.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTag(t.id)}
                        className={cn(
                          "inline-flex min-h-11 items-center rounded-full border px-3 py-2 text-[11px] transition-colors sm:min-h-0 sm:px-2.5 sm:py-0.5",
                          on
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
