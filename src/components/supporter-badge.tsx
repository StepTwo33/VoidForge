import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupporterBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function SupporterBadge({ className, size = "sm" }: SupporterBadgeProps) {
  return (
    <span
      title="Thank you for supporting Voidforge"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-rose-500/10 font-semibold uppercase text-rose-400 ring-1 ring-rose-500/25",
        size === "sm" ? "px-2 py-0.5 text-[10px] tracking-wide" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <Heart className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      Supporter
    </span>
  );
}
