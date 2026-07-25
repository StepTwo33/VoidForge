"use client";

import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { HowToModSectionNav } from "@/components/guides/how-to-mod-ui";
import {
  HOW_TO_MOD_HERO_ICON,
  HOW_TO_MOD_SLOGAN,
} from "@/lib/guides/how-to-mod-sections";

export default function HowToModLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={HOW_TO_MOD_HERO_ICON}
          accent="amber"
          title="How to"
          highlight="Mod"
          description={HOW_TO_MOD_SLOGAN}
        />
        <HowToModSectionNav />
        <div className="space-y-6">{children}</div>
      </PageMain>
    </PageShell>
  );
}
