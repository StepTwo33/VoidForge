import { Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: "admin" | "moderator";
  className?: string;
  size?: "sm" | "md";
}

export function RoleBadge({ role, className, size = "sm" }: RoleBadgeProps) {
  const isAdmin = role === "admin";
  return (
    <span
      title={isAdmin ? "Voidforge administrator" : "Voidforge moderator"}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase ring-1",
        isAdmin
          ? "bg-red-500/10 text-red-400 ring-red-500/25"
          : "bg-amber-500/10 text-amber-400 ring-amber-500/25",
        size === "sm" ? "px-2 py-0.5 text-[10px] tracking-wide" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {isAdmin ? (
        <Shield className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      ) : (
        <ShieldCheck className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      )}
      {isAdmin ? "Admin" : "Mod"}
    </span>
  );
}
