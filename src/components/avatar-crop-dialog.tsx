"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AVATAR_CROP_VIEWPORT,
  clampCropOffset,
  loadImageElement,
  minCoverScale,
  renderCroppedAvatarBlob,
  type AvatarCropTransform,
} from "@/lib/display/avatar-crop";
import { cn } from "@/lib/utils";

type AvatarCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
  uploading?: boolean;
};

const DEFAULT_TRANSFORM: AvatarCropTransform = { zoom: 1, offsetX: 0, offsetY: 0 };

export function AvatarCropDialog({
  open,
  imageSrc,
  onOpenChange,
  onConfirm,
  uploading = false,
}: AvatarCropDialogProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<AvatarCropTransform>(DEFAULT_TRANSFORM);
  const [saving, setSaving] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  useEffect(() => {
    if (!open || !imageSrc) {
      setImage(null);
      setTransform(DEFAULT_TRANSFORM);
      return;
    }
    let cancelled = false;
    loadImageElement(imageSrc)
      .then((img) => {
        if (!cancelled) {
          setImage(img);
          setTransform(DEFAULT_TRANSFORM);
        }
      })
      .catch(() => {
        if (!cancelled) onOpenChange(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, imageSrc, onOpenChange]);

  const applyTransform = useCallback(
    (next: AvatarCropTransform) => {
      if (!image) {
        setTransform(next);
        return;
      }
      const scale = minCoverScale(image.naturalWidth, image.naturalHeight) * next.zoom;
      const clamped = clampCropOffset(
        next.offsetX,
        next.offsetY,
        scale,
        image.naturalWidth,
        image.naturalHeight,
      );
      setTransform({ zoom: next.zoom, ...clamped });
    },
    [image],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!image || saving || uploading) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: transform.offsetX,
      baseY: transform.offsetY,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !image) return;
    setTransform((prev) => {
      const scale = minCoverScale(image.naturalWidth, image.naturalHeight) * prev.zoom;
      return {
        zoom: prev.zoom,
        ...clampCropOffset(
          drag.baseX + (e.clientX - drag.startX),
          drag.baseY + (e.clientY - drag.startY),
          scale,
          image.naturalWidth,
          image.naturalHeight,
        ),
      };
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleConfirm = async () => {
    if (!image) return;
    setSaving(true);
    try {
      const blob = await renderCroppedAvatarBlob(image, transform);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await onConfirm(file);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const scale = image
    ? minCoverScale(image.naturalWidth, image.naturalHeight) * transform.zoom
    : 1;
  const displayW = image ? image.naturalWidth * scale : 0;
  const displayH = image ? image.naturalHeight * scale : 0;

  const busy = saving || uploading;

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md" showCloseButton={!busy}>
        <DialogHeader>
          <DialogTitle>Adjust profile picture</DialogTitle>
          <DialogDescription>
            Drag to reposition and use the slider to zoom. The circle shows how your avatar will appear.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "relative mx-auto max-w-full overflow-hidden rounded-xl border border-border bg-muted/30 touch-none select-none",
            !image && "animate-pulse",
          )}
          style={{ width: AVATAR_CROP_VIEWPORT, height: AVATAR_CROP_VIEWPORT }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {image && (
            <img
              src={image.src}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: displayW,
                height: displayH,
                transform: `translate(calc(-50% + ${transform.offsetX}px), calc(-50% + ${transform.offsetY}px))`,
              }}
            />
          )}

          {/* Circular preview mask */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle ${AVATAR_CROP_VIEWPORT / 2}px at center, transparent ${AVATAR_CROP_VIEWPORT / 2 - 1}px, rgb(0 0 0 / 0.55) ${AVATAR_CROP_VIEWPORT / 2}px)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full border-2 border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
              style={{ width: AVATAR_CROP_VIEWPORT - 4, height: AVATAR_CROP_VIEWPORT - 4 }}
            />
          </div>
        </div>

        <label className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
          <ZoomIn className="h-4 w-4 shrink-0" />
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={transform.zoom}
            disabled={!image || busy}
            onChange={(e) => applyTransform({ ...transform, zoom: Number(e.target.value) })}
            className="h-11 w-full min-w-0 cursor-pointer accent-primary touch-manipulation"
          />
        </label>

        <DialogFooter>
          <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" disabled={busy} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="min-h-11 w-full sm:w-auto" disabled={!image || busy} onClick={() => void handleConfirm()}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save picture"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
