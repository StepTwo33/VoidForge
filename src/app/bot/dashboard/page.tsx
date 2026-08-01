"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, ExternalLink, Loader2, Unplug, Save, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BOT_EVENT_TYPES,
  CATEGORY_LABELS,
  type BotEventCategory,
  type BotEventTypeDef,
} from "@/lib/bot/alert-types";
import { toast } from "sonner";

interface StatusPayload {
  configured: boolean;
  inviteUrl: string | null;
  authenticated: boolean;
  discordLink: { discordId: string; username: string | null; avatar: string | null } | null;
}

interface GuildSummary {
  id: string;
  name: string;
  iconUrl: string | null;
  botInstalled: boolean;
  inviteUrl: string | null;
}

interface Channel {
  id: string;
  name: string;
}

interface RouteRow {
  channelId: string;
  eventType: string;
  enabled: boolean;
  mentionRoleId?: string | null;
}

interface GuildDetail {
  guild: GuildSummary & { inviteUrl: string | null };
  config: { platform: string; timezone: string };
  channels: Channel[];
  routes: RouteRow[];
  eventTypes: BotEventTypeDef[];
}

const NONE = "__none__";

export default function BotDashboardPage() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [guilds, setGuilds] = useState<GuildSummary[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [detail, setDetail] = useState<GuildDetail | null>(null);
  /** eventType → channelId or NONE */
  const [channelByEvent, setChannelByEvent] = useState<Record<string, string>>({});
  const [platform, setPlatform] = useState("pc");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/bot/status");
    const data = (await res.json()) as StatusPayload;
    setStatus(data);
    return data;
  }, []);

  const loadGuilds = useCallback(async () => {
    const res = await fetch("/api/bot/guilds");
    if (!res.ok) {
      setGuilds([]);
      return;
    }
    const data = (await res.json()) as { guilds: GuildSummary[] };
    setGuilds(data.guilds ?? []);
  }, []);

  const loadGuildDetail = useCallback(async (guildId: string) => {
    setDetail(null);
    const res = await fetch(`/api/bot/guilds/${guildId}`);
    if (!res.ok) {
      toast.error("Could not load server config");
      return;
    }
    const data = (await res.json()) as GuildDetail;
    setDetail(data);
    setPlatform(data.config.platform || "pc");
    const map: Record<string, string> = {};
    for (const e of BOT_EVENT_TYPES) map[e.id] = NONE;
    // Prefer first enabled route per event
    for (const r of data.routes) {
      if (r.enabled && r.channelId) map[r.eventType] = r.channelId;
    }
    setChannelByEvent(map);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const s = await loadStatus();
      if (s.authenticated && s.discordLink) {
        await loadGuilds();
      }
      setLoading(false);
    })();
  }, [loadStatus, loadGuilds]);

  useEffect(() => {
    if (selectedGuildId) void loadGuildDetail(selectedGuildId);
  }, [selectedGuildId, loadGuildDetail]);

  const eventsByCategory = useMemo(() => {
    const out: Record<BotEventCategory, BotEventTypeDef[]> = {
      missions: [],
      vendors: [],
      cycles: [],
      other: [],
    };
    for (const e of BOT_EVENT_TYPES) out[e.category].push(e);
    return out;
  }, []);

  const handleSave = async () => {
    if (!selectedGuildId) return;
    setSaving(true);
    try {
      await fetch(`/api/bot/guilds/${selectedGuildId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      const routes: RouteRow[] = [];
      for (const [eventType, channelId] of Object.entries(channelByEvent)) {
        if (!channelId || channelId === NONE) continue;
        routes.push({ eventType, channelId, enabled: true });
      }

      const res = await fetch(`/api/bot/guilds/${selectedGuildId}/routes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      toast.success("Alert routes saved");
      await loadGuildDetail(selectedGuildId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTestPing = async () => {
    if (!selectedGuildId || !detail) return;
    // Prefer a channel that has at least one route, else first channel
    const used = Object.values(channelByEvent).find((c) => c && c !== NONE);
    const channelId = used || detail.channels[0]?.id;
    if (!channelId) {
      toast.error("Pick a text channel first");
      return;
    }
    setTesting(true);
    try {
      const res = await fetch(`/api/bot/guilds/${selectedGuildId}/test-ping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Test ping failed");
      }
      toast.success("Test embed sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Test ping failed");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <PageMain className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </PageMain>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageMain maxWidth="lg" className="py-8 sm:py-12">
        <PageHero
          title="Bot dashboard"
          description="Link Discord and route world-state, vendor, and cycle alerts to channels."
        />

        {!status?.authenticated && (
          <Panel>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to Voidforge to configure the bot for your servers.
            </p>
            <Button asChild>
              <Link href="/signin?callbackUrl=/bot/dashboard">Sign in</Link>
            </Button>
          </Panel>
        )}

        {status?.authenticated && !status.configured && (
          <Panel className="border-amber-500/30 bg-amber-500/5">
            <p className="text-sm">
              Discord app credentials are not configured on this server. Set{" "}
              <code className="text-xs bg-secondary px-1 rounded">DISCORD_BOT_TOKEN</code>,{" "}
              <code className="text-xs bg-secondary px-1 rounded">DISCORD_CLIENT_ID</code>, and{" "}
              <code className="text-xs bg-secondary px-1 rounded">DISCORD_CLIENT_SECRET</code>, then
              run <code className="text-xs bg-secondary px-1 rounded">npm run bot</code>.
            </p>
          </Panel>
        )}

        {status?.authenticated && status.configured && !status.discordLink && (
          <Panel>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h2 className="font-medium flex items-center gap-2">
                  <Unplug className="h-4 w-4" /> Link Discord
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect the Discord account that manages your clan or community servers.
                </p>
              </div>
              <Button asChild>
                <a href="/api/bot/discord/link">Link Discord account</a>
              </Button>
            </div>
          </Panel>
        )}

        {status?.discordLink && (
          <>
            <Panel>
              <div className="flex items-center gap-3">
                {status.discordLink.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={status.discordLink.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{status.discordLink.username}</p>
                  <p className="text-xs text-muted-foreground">Discord linked</p>
                </div>
                {status.inviteUrl && (
                  <Button asChild variant="outline" size="sm" className="ml-auto">
                    <a href={status.inviteUrl} target="_blank" rel="noreferrer">
                      Invite bot
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </Panel>

            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">Server</label>
              <Select
                value={selectedGuildId ?? undefined}
                onValueChange={(v) => setSelectedGuildId(v)}
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select a server you manage" />
                </SelectTrigger>
                <SelectContent>
                  {guilds.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                      {!g.botInstalled ? " (bot not installed)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {guilds.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  No manageable servers found. Re-link Discord with the guilds scope, or create a
                  server.
                </p>
              )}
            </div>
          </>
        )}

        {detail && selectedGuildId && (
          <div className="mt-8 space-y-6">
            {!detail.guild.botInstalled && (
              <Panel className="border-amber-500/30">
                <p className="text-sm mb-3">
                  The bot is not in <strong>{detail.guild.name}</strong> yet.
                </p>
                {detail.guild.inviteUrl && (
                  <Button asChild>
                    <a href={detail.guild.inviteUrl} target="_blank" rel="noreferrer">
                      Install bot in this server
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </Panel>
            )}

            {detail.guild.botInstalled && (
              <>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pc">PC</SelectItem>
                        <SelectItem value="ps4">PlayStation</SelectItem>
                        <SelectItem value="xb1">Xbox</SelectItem>
                        <SelectItem value="swi">Switch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" onClick={handleTestPing} disabled={testing}>
                      {testing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1.5" />
                          Test ping
                        </>
                      )}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1.5" />
                          Save routes
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {(Object.keys(eventsByCategory) as BotEventCategory[]).map((cat) => {
                  const events = eventsByCategory[cat];
                  if (!events.length) return null;
                  return (
                    <div key={cat}>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">
                        {CATEGORY_LABELS[cat]}
                      </h3>
                      <div className="rounded-xl border border-border/50 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-secondary/40 text-left text-xs text-muted-foreground">
                              <th className="px-3 py-2 font-medium">Event</th>
                              <th className="px-3 py-2 font-medium">Post to channel</th>
                            </tr>
                          </thead>
                          <tbody>
                            {events.map((ev) => (
                              <tr key={ev.id} className="border-t border-border/40">
                                <td className="px-3 py-2.5 align-top">
                                  <div className="font-medium">{ev.label}</div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {ev.description}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5">
                                  <Select
                                    value={channelByEvent[ev.id] ?? NONE}
                                    onValueChange={(v) =>
                                      setChannelByEvent((prev) => ({ ...prev, [ev.id]: v }))
                                    }
                                  >
                                    <SelectTrigger className="max-w-xs">
                                      <SelectValue placeholder="No channel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={NONE}>— Off —</SelectItem>
                                      {detail.channels.map((ch) => (
                                        <SelectItem key={ch.id} value={ch.id}>
                                          #{ch.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {detail.channels.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No text channels visible. Ensure the bot can view channels in this server.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          <Link href="/bot" className="underline underline-offset-2 hover:text-foreground">
            ← About Voidforge Bot
          </Link>
        </p>
      </PageMain>
    </PageShell>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 rounded-xl border border-border/60 bg-card/30 p-5", className)}>
      {children}
    </div>
  );
}
