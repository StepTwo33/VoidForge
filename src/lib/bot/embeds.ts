/**
 * Discord embed payloads as plain JSON (compatible with discord.js EmbedBuilder raw data).
 * Shared by the bot process and the web test-ping API.
 */

import type {
  AlertData,
  ArbitrationData,
  ArchimedeaData,
  ArchonHuntData,
  BaroData,
  ConstructionProgressData,
  CycleData,
  DailyDeal,
  EventGoalData,
  FissureData,
  InvasionData,
  NewsData,
  NightwaveData,
  SentientOutpostData,
  SimarisData,
  SortieData,
  SteelPathData,
  VaultTraderData,
  WorldstateReward,
  WorldstateSnapshot,
} from "./worldstate-client";
import { activeInvasions, datedNews, openWorldBounties } from "./worldstate-client";

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedPayload {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  footer?: { text: string };
  timestamp?: string;
  url?: string;
}

const COLORS = {
  sortie: 0xe74c3c,
  archon: 0x9b59b6,
  arbitration: 0xf1c40f,
  baro: 0x3498db,
  varzia: 0xe67e22,
  darvo: 0x2ecc71,
  teshin: 0xc0392b,
  nightwave: 0x8e44ad,
  bounties: 0x16a085,
  simaris: 0x2980b9,
  cycle: 0x1abc9c,
  worldstate: 0x5865f2,
  test: 0x95a5a6,
  alerts: 0xd35400,
  invasions: 0x7f8c8d,
  fissures: 0x00bcd4,
  events: 0xf39c12,
  news: 0x34495e,
  archimedea: 0x6c5ce7,
  outpost: 0xb71540,
  construction: 0x636e72,
};

function missionLines(missions?: { node?: string; missionType?: string; modifier?: string }[]): string {
  if (!missions?.length) return "_No mission data_";
  return missions
    .map((m, i) => {
      const type = m.missionType ?? "Mission";
      const node = m.node ?? "?";
      const mod = m.modifier ? ` — ${m.modifier}` : "";
      return `**${i + 1}.** ${type} @ ${node}${mod}`;
    })
    .join("\n");
}

function fmtTime(iso?: string): string {
  if (!iso) return "unknown";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  // Discord relative timestamp
  return `<t:${Math.floor(t / 1000)}:R>`;
}

export function embedSortie(s: SortieData | null): EmbedPayload {
  if (!s) {
    return { title: "Sortie", description: "No sortie data available.", color: COLORS.sortie };
  }
  const missions = s.missions ?? s.variants ?? [];
  return {
    title: `Sortie — ${s.boss ?? "Unknown"}`,
    description: s.faction ? `Faction: **${s.faction}**` : undefined,
    color: COLORS.sortie,
    fields: [
      { name: "Missions", value: missionLines(missions) },
      { name: "Expires", value: fmtTime(s.expiry), inline: true },
    ],
    footer: { text: "Voidforge Bot · Sortie" },
    timestamp: new Date().toISOString(),
  };
}

export function embedArchon(a: ArchonHuntData | null): EmbedPayload {
  if (!a) {
    return { title: "Archon Hunt", description: "No Archon Hunt data available.", color: COLORS.archon };
  }
  return {
    title: `Archon Hunt — ${a.boss ?? "Unknown"}`,
    description: a.faction ? `Faction: **${a.faction}**` : undefined,
    color: COLORS.archon,
    fields: [
      { name: "Missions", value: missionLines(a.missions) },
      { name: "Expires", value: fmtTime(a.expiry), inline: true },
    ],
    footer: { text: "Voidforge Bot · Archon Hunt" },
    timestamp: new Date().toISOString(),
  };
}

export function embedArbitration(a: ArbitrationData | null): EmbedPayload {
  if (!a) {
    return { title: "Arbitration", description: "No arbitration data available.", color: COLORS.arbitration };
  }
  return {
    title: "Arbitration",
    color: COLORS.arbitration,
    fields: [
      { name: "Node", value: a.node ?? "?", inline: true },
      { name: "Type", value: a.type ?? "?", inline: true },
      { name: "Enemy", value: a.enemy ?? "?", inline: true },
      { name: "Expires", value: fmtTime(a.expiry), inline: true },
    ],
    footer: { text: "Voidforge Bot · Arbitration" },
    timestamp: new Date().toISOString(),
  };
}

function baroIsActive(b: BaroData): boolean {
  if (typeof b.active === "boolean") return b.active;
  // Derive from schedule when API omits `active`
  const now = Date.now();
  const start = b.activation ? Date.parse(b.activation) : NaN;
  const end = b.expiry ? Date.parse(b.expiry) : NaN;
  if (!Number.isNaN(start) && !Number.isNaN(end)) return now >= start && now < end;
  return (b.inventory?.length ?? 0) > 0;
}

export function embedBaro(b: BaroData | null): EmbedPayload {
  if (!b) {
    return { title: "Baro Ki'Teer", description: "No Void Trader data available.", color: COLORS.baro };
  }
  const active = baroIsActive(b);
  const status = active
    ? `**Docked** at ${b.location ?? "?"}`
    : `**In transit** — next stop ${b.location ?? "?"}`;
  const inv = b.inventory ?? [];
  const invText =
    inv.length === 0
      ? active
        ? "_Inventory empty or unavailable_"
        : "_Inventory shown when docked_"
      : inv
          .slice(0, 25)
          .map((i) => `• ${i.item ?? "?"} — ${i.ducats ?? "?"}d / ${i.credits ?? "?"}c`)
          .join("\n") + (inv.length > 25 ? `\n_…and ${inv.length - 25} more_` : "");

  return {
    title: "Baro Ki'Teer",
    description: status,
    color: COLORS.baro,
    fields: [
      { name: active ? "Leaves" : "Arrives", value: fmtTime(active ? b.expiry : b.activation), inline: true },
      { name: "Inventory", value: invText.slice(0, 1024) || "_none_" },
    ],
    footer: { text: "Voidforge Bot · Void Trader" },
    timestamp: new Date().toISOString(),
  };
}

function cycleField(label: string, c: CycleData | null): EmbedField {
  if (!c) return { name: label, value: "_unknown_", inline: true };
  const state = c.state ?? c.active ?? (c.isDay != null ? (c.isDay ? "day" : "night") : c.isWarm != null ? (c.isWarm ? "warm" : "cold") : "?");
  const left = c.timeLeft ? ` (${c.timeLeft})` : c.expiry ? ` · ends ${fmtTime(c.expiry)}` : "";
  return { name: label, value: `**${state}**${left}`, inline: true };
}

export function embedCycles(snap: WorldstateSnapshot): EmbedPayload {
  return {
    title: "Open-world cycles",
    color: COLORS.cycle,
    fields: [
      cycleField("Cetus", snap.cetusCycle),
      cycleField("Orb Vallis", snap.vallisCycle),
      cycleField("Cambion Drift", snap.cambionCycle),
      cycleField("Duviri", snap.duviriCycle),
      cycleField("Earth", snap.earthCycle),
      cycleField("Zariman", snap.zarimanCycle),
    ],
    footer: { text: `Voidforge Bot · ${snap.platform.toUpperCase()}` },
    timestamp: new Date().toISOString(),
  };
}

export function embedVarzia(v: VaultTraderData | null): EmbedPayload {
  if (!v) {
    return {
      title: "Varzia — Prime Resurgence",
      description: "No Prime Vault trader data available.",
      color: COLORS.varzia,
    };
  }
  const inv = v.inventory ?? [];
  const invText =
    inv.length === 0
      ? "_No inventory listed_"
      : inv
          .slice(0, 20)
          .map((i) => `• ${i.item ?? "?"}${i.ducats != null ? ` — ${i.ducats} Aya` : ""}`)
          .join("\n") + (inv.length > 20 ? `\n_…and ${inv.length - 20} more_` : "");

  return {
    title: `${v.character ?? "Varzia"} — Prime Resurgence`,
    description: v.location ? `Location: **${v.location}**` : undefined,
    color: COLORS.varzia,
    fields: [
      { name: "Active until", value: fmtTime(v.expiry), inline: true },
      { name: "Offerings", value: invText.slice(0, 1024) },
    ],
    footer: { text: "Voidforge Bot · Varzia" },
    timestamp: new Date().toISOString(),
  };
}

export function embedDarvo(deals: DailyDeal[]): EmbedPayload {
  if (!deals.length) {
    return {
      title: "Darvo's Daily Deal",
      description: "No daily deal data available.",
      color: COLORS.darvo,
    };
  }
  const fields: EmbedField[] = deals.map((d) => {
    const left =
      d.total != null && d.sold != null ? Math.max(0, d.total - d.sold) : undefined;
    const stock =
      left != null && d.total != null
        ? `${left}/${d.total} left`
        : d.sold != null
          ? `${d.sold} sold`
          : "stock unknown";
    const price =
      d.salePrice != null
        ? `**${d.salePrice}p**` +
          (d.originalPrice != null ? ` ~~${d.originalPrice}p~~` : "") +
          (d.discount != null ? ` (−${d.discount}%)` : "")
        : "price unknown";
    return {
      name: d.item ?? "Unknown item",
      value: `${price}\n${stock}\nEnds ${fmtTime(d.expiry)}`,
    };
  });

  return {
    title: "Darvo's Daily Deal",
    color: COLORS.darvo,
    fields,
    footer: { text: "Voidforge Bot · Darvo" },
    timestamp: new Date().toISOString(),
  };
}

export function embedTeshin(sp: SteelPathData | null): EmbedPayload {
  if (!sp) {
    return {
      title: "Teshin — Steel Path Honors",
      description: "No Steel Path vendor data available.",
      color: COLORS.teshin,
    };
  }
  const reward = sp.currentReward;
  const rewardLine =
    reward?.name != null
      ? `**${reward.name}**${reward.cost != null ? ` — ${reward.cost} Steel Essence` : ""}`
      : "_unknown reward_";

  return {
    title: "Teshin — Steel Path Honors",
    color: COLORS.teshin,
    fields: [
      { name: "This week's offering", value: rewardLine },
      {
        name: "Rotates",
        value: sp.remaining ? `${sp.remaining} left` : fmtTime(sp.expiry),
        inline: true,
      },
      {
        name: "Daily incursions",
        value: sp.incursions?.id
          ? `Reset ${fmtTime(sp.incursions.expiry)}`
          : "_unavailable_",
        inline: true,
      },
    ],
    footer: { text: "Voidforge Bot · Steel Path" },
    timestamp: new Date().toISOString(),
  };
}

export function embedNightwave(nw: NightwaveData | null): EmbedPayload {
  if (!nw) {
    return {
      title: "Nightwave",
      description: "No Nightwave data available.",
      color: COLORS.nightwave,
    };
  }
  const acts = nw.activeChallenges ?? [];
  const dailies = acts.filter((a) => a.isDaily);
  const weeklies = acts.filter((a) => !a.isDaily && !a.isElite);
  const elites = acts.filter((a) => a.isElite);

  const fmtActs = (list: typeof acts, empty: string) =>
    list.length === 0
      ? empty
      : list
          .slice(0, 8)
          .map(
            (a) =>
              `• **${a.title ?? "Act"}**${a.reputation != null ? ` (+${a.reputation})` : ""}${a.desc ? `\n  _${a.desc}_` : ""}`,
          )
          .join("\n");

  return {
    title: `Nightwave — Season ${nw.season ?? "?"}`,
    description: nw.tag ? `_${nw.tag}_` : undefined,
    color: COLORS.nightwave,
    fields: [
      { name: "Daily acts", value: fmtActs(dailies, "_none_").slice(0, 1024) },
      { name: "Weekly acts", value: fmtActs(weeklies, "_none_").slice(0, 1024) },
      ...(elites.length
        ? [{ name: "Elite acts", value: fmtActs(elites, "_none_").slice(0, 1024) }]
        : []),
      { name: "Season ends", value: fmtTime(nw.expiry), inline: true },
    ],
    footer: { text: "Voidforge Bot · Nora Night" },
    timestamp: new Date().toISOString(),
  };
}

export function embedBounties(snap: WorldstateSnapshot): EmbedPayload {
  const boards = openWorldBounties(snap);
  if (!boards.length) {
    return {
      title: "Open-world bounties",
      description: "No open-world syndicate boards available.",
      color: COLORS.bounties,
    };
  }

  const fields: EmbedField[] = boards
    .slice(0, 12)
    .map((b) => {
      const jobs = b.jobs ?? [];
      const jobLines =
        jobs.length === 0
          ? "_no jobs_"
          : jobs
              .slice(0, 6)
              .map((j, i) => {
                const lvl =
                  j.minEnemyLevel != null && j.maxEnemyLevel != null
                    ? ` Lv${j.minEnemyLevel}–${j.maxEnemyLevel}`
                    : j.enemyLevels?.length
                      ? ` Lv${j.enemyLevels[0]}–${j.enemyLevels[j.enemyLevels.length - 1]}`
                      : "";
                const stand = j.standingStages?.length
                  ? ` · ${j.standingStages.reduce((a, b) => a + b, 0)} standing`
                  : "";
                return `${i + 1}.${lvl}${stand}`;
              })
              .join("\n");
      return {
        name: b.syndicate ?? "Syndicate",
        value: `${jobLines}\nResets ${fmtTime(b.expiry)}`.slice(0, 1024),
        inline: true,
      };
    });

  return {
    title: "Open-world bounties",
    description: "Syndicate bounty boards just rotated (or were refreshed).",
    color: COLORS.bounties,
    fields,
    footer: { text: "Voidforge Bot · Bounties" },
    timestamp: new Date().toISOString(),
  };
}

function rewardText(r?: WorldstateReward | null): string {
  if (!r) return "";
  const parts: string[] = [];
  for (const item of r.items ?? []) parts.push(item);
  for (const ci of r.countedItems ?? []) {
    if (!ci.type) continue;
    parts.push(ci.count && ci.count > 1 ? `${ci.count}× ${ci.type}` : ci.type);
  }
  if (r.credits) parts.push(`${r.credits.toLocaleString()}cr`);
  return parts.join(", ");
}

/** Keep only the given ids when provided (used to highlight new items in alerts). */
function onlyIds<T extends { id?: string }>(list: T[], ids?: string[]): T[] {
  if (!ids?.length) return list;
  const set = new Set(ids);
  const filtered = list.filter((x) => x.id && set.has(x.id));
  return filtered.length > 0 ? filtered : list;
}

export function embedAlerts(alerts: AlertData[], newIds?: string[]): EmbedPayload {
  const list = onlyIds(alerts, newIds);
  if (!list.length) {
    return { title: "Alerts", description: "No active alerts.", color: COLORS.alerts };
  }
  const fields: EmbedField[] = list.slice(0, 10).map((a) => {
    const m = a.mission ?? {};
    const lvl =
      m.minEnemyLevel != null && m.maxEnemyLevel != null
        ? ` · Lv${m.minEnemyLevel}–${m.maxEnemyLevel}`
        : "";
    const reward = rewardText(m.reward);
    return {
      name: `${m.type ?? "Mission"} @ ${m.node ?? "?"}`,
      value: [
        m.description ? `_${m.description}_` : "",
        `${m.faction ?? "?"}${lvl}${m.nightmare ? " · Nightmare" : ""}${m.archwingRequired ? " · Archwing" : ""}`,
        reward ? `**Reward:** ${reward}` : "",
        `Ends ${fmtTime(a.expiry)}`,
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 1024),
    };
  });
  return {
    title: newIds?.length ? "New alert" + (list.length > 1 ? "s" : "") : "Alerts",
    color: COLORS.alerts,
    fields,
    footer: { text: "Voidforge Bot · Alerts" },
    timestamp: new Date().toISOString(),
  };
}

export function embedInvasions(invasions: InvasionData[], newIds?: string[]): EmbedPayload {
  const list = onlyIds(invasions.filter((i) => !i.completed), newIds);
  if (!list.length) {
    return { title: "Invasions", description: "No active invasions.", color: COLORS.invasions };
  }
  const fields: EmbedField[] = list.slice(0, 12).map((inv) => {
    const atk = rewardText(inv.attacker?.reward);
    const def = rewardText(inv.defender?.reward);
    const pct =
      inv.completion != null ? `${Math.round(Math.min(100, Math.max(-100, inv.completion)))}%` : "?";
    const sides = inv.vsInfestation
      ? `${inv.defender?.faction ?? "?"} vs Infestation`
      : `${inv.attacker?.faction ?? "?"} vs ${inv.defender?.faction ?? "?"}`;
    return {
      name: `${inv.node ?? "?"} — ${inv.desc ?? sides}`,
      value: [
        sides,
        atk ? `**${inv.attacker?.faction ?? "Attacker"}:** ${atk}` : "",
        def ? `**${inv.defender?.faction ?? "Defender"}:** ${def}` : "",
        `Progress: ${pct}${inv.eta ? ` · ETA ${inv.eta}` : ""}`,
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 1024),
    };
  });
  return {
    title: newIds?.length ? "New invasion" + (list.length > 1 ? "s" : "") : "Invasions",
    color: COLORS.invasions,
    fields,
    footer: { text: "Voidforge Bot · Invasions" },
    timestamp: new Date().toISOString(),
  };
}

const FISSURE_TIER_ORDER = ["Lith", "Meso", "Neo", "Axi", "Requiem", "Omnia"];

export function embedFissures(fissures: FissureData[], newIds?: string[]): EmbedPayload {
  const list = onlyIds(fissures, newIds);
  if (!list.length) {
    return { title: "Void Fissures", description: "No active fissures.", color: COLORS.fissures };
  }
  const sorted = [...list].sort(
    (a, b) =>
      (a.tierNum ?? FISSURE_TIER_ORDER.indexOf(a.tier ?? "") + 1) -
      (b.tierNum ?? FISSURE_TIER_ORDER.indexOf(b.tier ?? "") + 1),
  );
  const line = (f: FissureData) => {
    const tags = [f.isHard ? "Steel Path" : "", f.isStorm ? "Void Storm" : ""].filter(Boolean).join(", ");
    return `**${f.tier ?? "?"}** — ${f.missionType ?? "?"} @ ${f.node ?? "?"}${tags ? ` _(${tags})_` : ""} · ends ${fmtTime(f.expiry)}`;
  };
  const lines = sorted.slice(0, 25).map(line);
  return {
    title: newIds?.length ? "New void fissure" + (list.length > 1 ? "s" : "") : "Void Fissures",
    description: lines.join("\n").slice(0, 4096),
    color: COLORS.fissures,
    footer: { text: "Voidforge Bot · Fissures" },
    timestamp: new Date().toISOString(),
  };
}

export function embedEvents(events: EventGoalData[], newIds?: string[]): EmbedPayload {
  const list = onlyIds(events, newIds);
  if (!list.length) {
    return { title: "Events", description: "No active events.", color: COLORS.events };
  }
  const fields: EmbedField[] = list.slice(0, 8).map((e) => {
    const progress =
      e.maximumScore != null && e.currentScore != null
        ? `Progress: ${e.currentScore}/${e.maximumScore}`
        : "";
    const rewards = (e.rewards ?? []).map((r) => rewardText(r)).filter(Boolean).join("; ");
    return {
      name: e.description ?? "Event",
      value: [
        e.tooltip ? `_${e.tooltip}_` : "",
        e.node ? `Location: ${e.node}` : "",
        progress,
        rewards ? `**Rewards:** ${rewards}` : "",
        e.expiry ? `Ends ${fmtTime(e.expiry)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 1024),
    };
  });
  return {
    title: newIds?.length ? "New event" + (list.length > 1 ? "s" : "") : "Events & goals",
    color: COLORS.events,
    fields,
    footer: { text: "Voidforge Bot · Events" },
    timestamp: new Date().toISOString(),
  };
}

export function embedNews(news: NewsData[], newIds?: string[]): EmbedPayload {
  const list = onlyIds(news, newIds);
  if (!list.length) {
    return { title: "Warframe news", description: "No recent news.", color: COLORS.news };
  }
  const lines = list.slice(0, 10).map((n) => {
    const tag = n.update ? "[Update] " : n.primeAccess ? "[Prime Access] " : n.stream ? "[Stream] " : "";
    const when = n.date ? ` · ${fmtTime(n.date)}` : "";
    return n.link
      ? `• ${tag}[${n.message ?? "News"}](${n.link})${when}`
      : `• ${tag}${n.message ?? "News"}${when}`;
  });
  return {
    title: newIds?.length ? "Warframe news" : "Latest Warframe news",
    description: lines.join("\n").slice(0, 4096),
    color: COLORS.news,
    footer: { text: "Voidforge Bot · News" },
    timestamp: new Date().toISOString(),
  };
}

export function embedArchimedea(archimedeas: ArchimedeaData[]): EmbedPayload {
  if (!archimedeas.length) {
    return {
      title: "Archimedea",
      description: "No Archimedea data available.",
      color: COLORS.archimedea,
    };
  }
  const fields: EmbedField[] = [];
  for (const a of archimedeas.slice(0, 2)) {
    const label = (a.type ?? "Archimedea").replace(/_/g, " ").replace(/\s+/g, " ").trim();
    const missions = (a.missions ?? [])
      .map((m, i) => {
        const risks = (m.risks ?? []).map((r) => r.name).filter(Boolean).join(", ");
        return `**${i + 1}. ${m.missionType ?? "Mission"}**${m.deviation?.name ? ` — ${m.deviation.name}` : ""}${risks ? `\n  Risks: ${risks}` : ""}`;
      })
      .join("\n");
    fields.push({
      name: `${label} · resets ${fmtTime(a.expiry)}`,
      value: (missions || "_no mission data_").slice(0, 1024),
    });
  }
  return {
    title: "Archimedea — weekly rotation",
    color: COLORS.archimedea,
    fields,
    footer: { text: "Voidforge Bot · Archimedea" },
    timestamp: new Date().toISOString(),
  };
}

export function embedSentientOutpost(o: SentientOutpostData | null): EmbedPayload {
  if (!o || !o.active || !o.mission?.node) {
    return {
      title: "Sentient Anomaly",
      description: "No sentient anomaly currently active.",
      color: COLORS.outpost,
    };
  }
  return {
    title: "Sentient Anomaly detected",
    color: COLORS.outpost,
    fields: [
      { name: "Location", value: o.mission.node, inline: true },
      { name: "Mission", value: o.mission.type ?? "Skirmish", inline: true },
      ...(o.expiry ? [{ name: "Despawns", value: fmtTime(o.expiry), inline: true }] : []),
    ],
    footer: { text: "Voidforge Bot · Veil Proxima" },
    timestamp: new Date().toISOString(),
  };
}

export function embedConstruction(c: ConstructionProgressData | null): EmbedPayload {
  if (!c) {
    return {
      title: "Fomorian / Razorback",
      description: "No construction data available.",
      color: COLORS.construction,
    };
  }
  return {
    title: "Enemy construction progress",
    color: COLORS.construction,
    fields: [
      { name: "Balor Fomorian", value: `${c.fomorianProgress ?? "?"}%`, inline: true },
      { name: "Razorback Armada", value: `${c.razorbackProgress ?? "?"}%`, inline: true },
    ],
    footer: { text: "Voidforge Bot · Construction" },
    timestamp: new Date().toISOString(),
  };
}

export function embedSimaris(s: SimarisData | null): EmbedPayload {
  if (!s) {
    return {
      title: "Cephalon Simaris",
      description: "No synthesis target data available.",
      color: COLORS.simaris,
    };
  }
  return {
    title: "Cephalon Simaris",
    color: COLORS.simaris,
    fields: [
      {
        name: "Synthesis target",
        value: s.target
          ? `**${s.target}**${s.isTargetActive === false ? " _(inactive)_" : ""}`
          : "_none_",
      },
    ],
    footer: { text: "Voidforge Bot · Simaris" },
    timestamp: new Date().toISOString(),
  };
}

export function embedWorldstate(snap: WorldstateSnapshot): EmbedPayload {
  const fields: EmbedField[] = [];
  if (snap.sortie?.boss) {
    fields.push({ name: "Sortie", value: `${snap.sortie.boss} · ends ${fmtTime(snap.sortie.expiry)}`, inline: false });
  }
  if (snap.archonHunt?.boss) {
    fields.push({
      name: "Archon Hunt",
      value: `${snap.archonHunt.boss} · ends ${fmtTime(snap.archonHunt.expiry)}`,
      inline: false,
    });
  }
  if (snap.arbitration?.node) {
    fields.push({
      name: "Arbitration",
      value: `${snap.arbitration.node} (${snap.arbitration.type ?? "?"})`,
      inline: false,
    });
  }
  if (snap.voidTrader) {
    const b = snap.voidTrader;
    const active = typeof b.active === "boolean" ? b.active : baroIsActive(b);
    fields.push({
      name: "Baro",
      value: active
        ? `Docked @ ${b.location ?? "?"} · leaves ${fmtTime(b.expiry)}`
        : `Next: ${b.location ?? "?"} · ${fmtTime(b.activation)}`,
      inline: false,
    });
  }
  if (snap.vaultTrader?.character) {
    fields.push({
      name: snap.vaultTrader.character,
      value: `${snap.vaultTrader.location ?? "?"} · until ${fmtTime(snap.vaultTrader.expiry)}`,
      inline: false,
    });
  }
  if (snap.dailyDeals[0]?.item) {
    const d = snap.dailyDeals[0];
    fields.push({
      name: "Darvo",
      value: `${d.item} @ ${d.salePrice ?? "?"}p (−${d.discount ?? "?"}%) · ${fmtTime(d.expiry)}`,
      inline: false,
    });
  }
  if (snap.steelPath?.currentReward?.name) {
    fields.push({
      name: "Teshin (SP)",
      value: `${snap.steelPath.currentReward.name} · ${snap.steelPath.remaining ?? fmtTime(snap.steelPath.expiry)}`,
      inline: false,
    });
  }
  fields.push(cycleField("Cetus", snap.cetusCycle));
  fields.push(cycleField("Vallis", snap.vallisCycle));
  fields.push(cycleField("Cambion", snap.cambionCycle));

  return {
    title: `Worldstate (${snap.platform.toUpperCase()})`,
    color: COLORS.worldstate,
    fields,
    footer: { text: "Voidforge Bot · /worldstate" },
    timestamp: new Date().toISOString(),
  };
}

export function embedForEventType(
  eventType: string,
  snap: WorldstateSnapshot,
  /** For list-type events: only show these newly-appeared ids. */
  newIds?: string[],
): EmbedPayload {
  switch (eventType) {
    case "alerts":
      return embedAlerts(snap.alerts, newIds);
    case "invasions":
      return embedInvasions(snap.invasions, newIds);
    case "fissures":
      return embedFissures(snap.fissures, newIds);
    case "events":
      return embedEvents(snap.events, newIds);
    case "news":
      return embedNews(datedNews(snap), newIds);
    case "archimedea":
      return embedArchimedea(snap.archimedeas);
    case "sentient_outpost":
      return embedSentientOutpost(snap.sentientOutposts);
    case "construction":
      return embedConstruction(snap.constructionProgress);
    case "sortie":
      return embedSortie(snap.sortie);
    case "archon":
      return embedArchon(snap.archonHunt);
    case "arbitration":
      return embedArbitration(snap.arbitration);
    case "baro":
      return embedBaro(snap.voidTrader);
    case "varzia":
      return embedVarzia(snap.vaultTrader);
    case "darvo":
      return embedDarvo(snap.dailyDeals);
    case "teshin":
      return embedTeshin(snap.steelPath);
    case "nightwave":
      return embedNightwave(snap.nightwave);
    case "bounties":
      return embedBounties(snap);
    case "simaris":
      return embedSimaris(snap.simaris);
    case "cetus":
    case "vallis":
    case "cambion":
    case "duviri":
    case "earth":
    case "zariman":
      return {
        ...embedCycles(snap),
        title: `Cycle update — ${eventType}`,
        description: "A cycle transition was detected.",
      };
    default:
      return embedWorldstate(snap);
  }
}

export function embedTestPing(channelLabel: string): EmbedPayload {
  return {
    title: "Test ping",
    description: `Voidforge Bot can post to **${channelLabel}**. Alerts configured for this channel will appear here.`,
    color: COLORS.test,
    footer: { text: "Voidforge Bot · Dashboard test" },
    timestamp: new Date().toISOString(),
  };
}
