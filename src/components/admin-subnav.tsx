"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Flag, Users, Megaphone, Wrench, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminLink = {
  href: string;
  label: string;
  icon: typeof Flag;
  fullAdminOnly?: boolean;
};

const ADMIN_LINKS: AdminLink[] = [
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/data-fixes", label: "Data Fixes", icon: Wrench },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/updates", label: "Site Updates", icon: Megaphone, fullAdminOnly: true },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, fullAdminOnly: true },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSubnav({ isFullAdmin }: { isFullAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-14 z-40 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center gap-1 px-4 py-2 overflow-x-auto min-w-0">
        <Link
          href="/"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 min-h-11 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>

        <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />

        {ADMIN_LINKS.filter((link) => !link.fullAdminOnly || isFullAdmin).map((link) => {
          const Icon = link.icon;
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 min-h-11 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
