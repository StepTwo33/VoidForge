"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export type PromptOptions = ConfirmOptions & {
  defaultValue?: string;
  placeholder?: string;
  inputLabel?: string;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
type PromptFn = (options: PromptOptions) => Promise<string | null>;

const ConfirmDialogContext = createContext<{ confirm: ConfirmFn; prompt: PromptFn } | null>(null);

type PendingDialog =
  | { kind: "confirm"; options: ConfirmOptions; resolve: (value: boolean) => void }
  | { kind: "prompt"; options: PromptOptions; resolve: (value: string | null) => void };

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingDialog | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const pendingRef = useRef<PendingDialog | null>(null);
  pendingRef.current = pending;

  const finish = useCallback((value: boolean | string | null) => {
    const current = pendingRef.current;
    if (!current) return;
    if (current.kind === "confirm") {
      current.resolve(value === true);
    } else {
      current.resolve(typeof value === "string" ? value : null);
    }
    setPending(null);
  }, []);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ kind: "confirm", options, resolve });
    });
  }, []);

  const prompt = useCallback<PromptFn>((options) => {
    return new Promise<string | null>((resolve) => {
      setPromptValue(options.defaultValue ?? "");
      setPending({ kind: "prompt", options, resolve });
    });
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) finish(pending?.kind === "prompt" ? null : false);
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm, prompt }}>
      {children}
      <Dialog open={pending != null} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className="max-w-[calc(100%-2rem)] sm:max-w-md">
          {pending && (
            <>
              <DialogHeader>
                <DialogTitle>{pending.options.title}</DialogTitle>
                {pending.options.description ? (
                  <DialogDescription>{pending.options.description}</DialogDescription>
                ) : null}
              </DialogHeader>
              {pending.kind === "prompt" && (
                <div className="space-y-2">
                  {pending.options.inputLabel ? (
                    <label className="text-sm font-medium">{pending.options.inputLabel}</label>
                  ) : null}
                  <Input
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={pending.options.placeholder}
                    className="min-h-11 text-base sm:text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finish(promptValue);
                    }}
                  />
                </div>
              )}
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => finish(pending.kind === "prompt" ? null : false)}
                >
                  {pending.options.cancelLabel ?? "Cancel"}
                </Button>
                <Button
                  type="button"
                  variant={pending.options.destructive ? "destructive" : "default"}
                  className="min-h-11"
                  onClick={() => finish(pending.kind === "prompt" ? promptValue : true)}
                >
                  {pending.options.confirmLabel ??
                    (pending.kind === "prompt" ? "Continue" : "Confirm")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  }
  return ctx;
}
