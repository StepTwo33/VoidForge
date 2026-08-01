"use client";

import { PageShell, PageMain, PageHero, ProsePanel } from "@/components/page-shell";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero icon={AlertTriangle} accent="amber" title="Disclaimer" description="Last updated: July 5, 2026" />
        <ProsePanel>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Fan-Made Tool</h2>
              <p>
                Voidforge is an independent, fan-made tool created for the Warframe community.
                It is not produced, endorsed, supported, or affiliated with Digital Extremes Ltd.
                in any way. All game-related content, including but not limited to weapon names,
                mod names, warframe names, ability descriptions, and stat values, are the intellectual
                property of Digital Extremes Ltd.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Accuracy of Data</h2>
              <p>
                While we strive to keep all game data accurate and up-to-date, Voidforge relies on
                community-sourced information primarily from the{" "}
                <a href="https://wiki.warframe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Official Warframe Wiki
                </a>.
                Game updates, hotfixes, and balance changes may cause data to become temporarily outdated.
                We make no guarantees about the accuracy or completeness of any information displayed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Calculation Accuracy</h2>
              <p>
                Damage calculations, DPS estimates, time-to-kill simulations, and status effect breakdowns
                are approximations based on known game formulas. Actual in-game results may vary due to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Rounding differences in the game engine</li>
                <li>Undocumented game mechanics or hidden multipliers</li>
                <li>Enemy-specific damage resistances or vulnerabilities not modeled</li>
                <li>Environmental factors, warframe abilities, or team buffs</li>
                <li>Changes introduced by game updates after our last data refresh</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Trademarks</h2>
              <p>
                Warframe&reg;, the Warframe logo, and all associated game content are registered trademarks
                and copyrights of Digital Extremes Ltd. Use of these names and images on Voidforge is for
                identification and informational purposes only and does not imply endorsement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Community Content</h2>
              <p>
                User-submitted build names, descriptions, profile bios, usernames, and avatar images are provided
                by community members. Voidforge does not endorse user-generated content and may remove or restrict
                content that violates our Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Community Builds</h2>
              <p>
                Builds shared through Discover or public profile pages reflect individual players&apos; choices and
                opinions. They are not recommendations from Voidforge or Digital Extremes. Always verify a build
                suits your own goals, mastery, and in-game resources before investing forma, catalysts, or rivens.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">No Warranty</h2>
              <p>
                Voidforge is provided &quot;as is&quot; without warranty of any kind. The authors and
                contributors of Voidforge shall not be held liable for any damages arising from
                the use of this tool, including but not limited to incorrect build advice,
                wasted in-game resources, or any other consequences of relying on the
                information provided by this Service.
              </p>
            </section>
          </div>
        </ProsePanel>
      </PageMain>
    </PageShell>
  );
}
