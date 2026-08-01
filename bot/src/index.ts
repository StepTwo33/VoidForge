/**
 * Voidforge Discord bot — standalone process.
 *
 * Env: DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DATABASE_URL (shared with Next app)
 *
 * Run: npm run bot
 */

import path from "path";
import { config as loadEnv } from "dotenv";
import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  type ChatInputCommandInteraction,
  type APIEmbed,
} from "discord.js";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { BOT_EVENT_TYPE_IDS } from "../../src/lib/bot/alert-types";
import {
  addedFingerprintIds,
  allEventFingerprints,
  datedNews,
  fetchWorldstateSnapshot,
  LIST_EVENT_TYPES,
  type WorldstatePlatform,
} from "../../src/lib/bot/worldstate-client";
import {
  embedAlerts,
  embedArchimedea,
  embedArchon,
  embedArbitration,
  embedBaro,
  embedBounties,
  embedConstruction,
  embedCycles,
  embedDarvo,
  embedEvents,
  embedFissures,
  embedForEventType,
  embedInvasions,
  embedNews,
  embedNightwave,
  embedSentientOutpost,
  embedSimaris,
  embedSortie,
  embedTeshin,
  embedVarzia,
  embedWorldstate,
  type EmbedPayload,
} from "../../src/lib/bot/embeds";

// Run from repo root (`npm run bot`).
const ROOT = process.cwd();
loadEnv({ path: path.join(ROOT, ".env") });
loadEnv({ path: path.join(ROOT, ".env.local") });

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  if (url.startsWith("file:")) {
    const rel = url.slice("file:".length);
    return path.isAbsolute(rel) ? rel : path.resolve(ROOT, rel);
  }
  return path.resolve(ROOT, "dev.db");
}

function createPrisma(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: resolveDbPath() });
  return new PrismaClient({ adapter });
}

const prisma = createPrisma();

const TOKEN = process.env.DISCORD_BOT_TOKEN?.trim();
const CLIENT_ID = process.env.DISCORD_CLIENT_ID?.trim();

if (!TOKEN) {
  console.error("[bot] DISCORD_BOT_TOKEN is required");
  process.exit(1);
}

function toApiEmbed(payload: EmbedPayload): APIEmbed {
  return {
    title: payload.title,
    description: payload.description,
    color: payload.color,
    fields: payload.fields?.map((f) => ({
      name: f.name,
      value: f.value,
      inline: f.inline ?? false,
    })),
    footer: payload.footer,
    timestamp: payload.timestamp,
    url: payload.url,
  };
}

function embedBuilder(payload: EmbedPayload): EmbedBuilder {
  return EmbedBuilder.from(toApiEmbed(payload));
}

async function platformForGuild(guildId: string | null): Promise<WorldstatePlatform> {
  if (!guildId) return "pc";
  const cfg = await prisma.discordGuildConfig.findUnique({ where: { guildId } });
  const p = cfg?.platform;
  if (p === "ps4" || p === "xb1" || p === "swi" || p === "pc") return p;
  return "pc";
}

async function handleWorldstate(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedWorldstate(snap))] });
}

async function handleSortie(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedSortie(snap.sortie))] });
}

async function handleArchon(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedArchon(snap.archonHunt))] });
}

async function handleArbitration(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedArbitration(snap.arbitration))] });
}

async function handleBaro(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedBaro(snap.voidTrader))] });
}

async function handleVarzia(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedVarzia(snap.vaultTrader))] });
}

async function handleDarvo(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedDarvo(snap.dailyDeals))] });
}

async function handleTeshin(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedTeshin(snap.steelPath))] });
}

async function handleNightwave(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedNightwave(snap.nightwave))] });
}

async function handleBounties(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedBounties(snap))] });
}

async function handleSimaris(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedSimaris(snap.simaris))] });
}

async function handleCycles(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedCycles(snap))] });
}

async function handleAlerts(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedAlerts(snap.alerts))] });
}

async function handleInvasions(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedInvasions(snap.invasions))] });
}

async function handleFissures(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  const steelPath = interaction.options.getBoolean("steel_path");
  const storms = interaction.options.getBoolean("void_storms");
  let fissures = snap.fissures;
  if (steelPath != null) fissures = fissures.filter((f) => !!f.isHard === steelPath);
  if (storms != null) fissures = fissures.filter((f) => !!f.isStorm === storms);
  await interaction.editReply({ embeds: [embedBuilder(embedFissures(fissures))] });
}

async function handleEvents(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedEvents(snap.events))] });
}

async function handleNews(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedNews(datedNews(snap)))] });
}

async function handleArchimedea(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedArchimedea(snap.archimedeas))] });
}

async function handleOutpost(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedSentientOutpost(snap.sentientOutposts))] });
}

async function handleConstruction(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const platform = await platformForGuild(interaction.guildId);
  const snap = await fetchWorldstateSnapshot(platform);
  await interaction.editReply({ embeds: [embedBuilder(embedConstruction(snap.constructionProgress))] });
}

const commands = [
  new SlashCommandBuilder().setName("worldstate").setDescription("Warframe worldstate snapshot"),
  new SlashCommandBuilder().setName("alerts").setDescription("Active alert missions"),
  new SlashCommandBuilder().setName("invasions").setDescription("Active invasions and rewards"),
  new SlashCommandBuilder()
    .setName("fissures")
    .setDescription("Active void fissures")
    .addBooleanOption((o) =>
      o.setName("steel_path").setDescription("Only Steel Path fissures (false = only normal)"),
    )
    .addBooleanOption((o) =>
      o.setName("void_storms").setDescription("Only Railjack void storms (false = exclude)"),
    ),
  new SlashCommandBuilder().setName("events").setDescription("Active events and community goals"),
  new SlashCommandBuilder().setName("news").setDescription("Latest Warframe news"),
  new SlashCommandBuilder().setName("archimedea").setDescription("Weekly Archimedea rotation"),
  new SlashCommandBuilder().setName("outpost").setDescription("Sentient anomaly status (Veil Proxima)"),
  new SlashCommandBuilder().setName("construction").setDescription("Fomorian / Razorback construction progress"),
  new SlashCommandBuilder().setName("sortie").setDescription("Current Sortie"),
  new SlashCommandBuilder().setName("archon").setDescription("Current Archon Hunt"),
  new SlashCommandBuilder().setName("arbitration").setDescription("Current Arbitration"),
  new SlashCommandBuilder().setName("baro").setDescription("Baro Ki'Teer status and inventory"),
  new SlashCommandBuilder().setName("varzia").setDescription("Varzia Prime Resurgence offerings"),
  new SlashCommandBuilder().setName("darvo").setDescription("Darvo's daily deal"),
  new SlashCommandBuilder().setName("teshin").setDescription("Steel Path Honors weekly reward"),
  new SlashCommandBuilder().setName("nightwave").setDescription("Nightwave season and acts"),
  new SlashCommandBuilder().setName("bounties").setDescription("Open-world syndicate bounty boards"),
  new SlashCommandBuilder().setName("simaris").setDescription("Cephalon Simaris synthesis target"),
  new SlashCommandBuilder().setName("cycles").setDescription("Open-world cycle timers"),
  new SlashCommandBuilder().setName("ping").setDescription("Check that Voidforge Bot is online"),
].map((c) => c.toJSON());

async function registerCommands() {
  if (!CLIENT_ID) {
    console.warn("[bot] DISCORD_CLIENT_ID missing — skip command registration");
    return;
  }
  const rest = new REST({ version: "10" }).setToken(TOKEN!);
  console.log("[bot] Registering slash commands…");
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  console.log("[bot] Slash commands registered");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (c) => {
  console.log(`[bot] Logged in as ${c.user.tag}`);
  startPoller(c);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    switch (interaction.commandName) {
      case "worldstate":
        await handleWorldstate(interaction);
        break;
      case "alerts":
        await handleAlerts(interaction);
        break;
      case "invasions":
        await handleInvasions(interaction);
        break;
      case "fissures":
        await handleFissures(interaction);
        break;
      case "events":
        await handleEvents(interaction);
        break;
      case "news":
        await handleNews(interaction);
        break;
      case "archimedea":
        await handleArchimedea(interaction);
        break;
      case "outpost":
        await handleOutpost(interaction);
        break;
      case "construction":
        await handleConstruction(interaction);
        break;
      case "sortie":
        await handleSortie(interaction);
        break;
      case "archon":
        await handleArchon(interaction);
        break;
      case "arbitration":
        await handleArbitration(interaction);
        break;
      case "baro":
        await handleBaro(interaction);
        break;
      case "varzia":
        await handleVarzia(interaction);
        break;
      case "darvo":
        await handleDarvo(interaction);
        break;
      case "teshin":
        await handleTeshin(interaction);
        break;
      case "nightwave":
        await handleNightwave(interaction);
        break;
      case "bounties":
        await handleBounties(interaction);
        break;
      case "simaris":
        await handleSimaris(interaction);
        break;
      case "cycles":
        await handleCycles(interaction);
        break;
      case "ping":
        await interaction.reply({ content: "Voidforge Bot online.", ephemeral: true });
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[bot] command error", interaction.commandName, err);
    const msg = "Something went wrong running that command.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: msg }).catch(() => {});
    } else {
      await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
    }
  }
});

client.on(Events.GuildCreate, async (guild) => {
  try {
    await prisma.discordGuild.upsert({
      where: { id: guild.id },
      create: { id: guild.id, name: guild.name, icon: guild.icon },
      update: { name: guild.name, icon: guild.icon },
    });
    await prisma.discordGuildConfig.upsert({
      where: { guildId: guild.id },
      create: { guildId: guild.id },
      update: {},
    });
    console.log(`[bot] Joined guild ${guild.name} (${guild.id})`);
  } catch (e) {
    console.error("[bot] GuildCreate persist failed", e);
  }
});

/** Poll worldstate and fan out to AlertRoute channels on transitions. */
function startPoller(c: Client) {
  const intervalMs = Number(process.env.BOT_WORLDSTATE_POLL_MS || 60_000);
  console.log(`[bot] Worldstate poller every ${intervalMs}ms`);

  const tick = async () => {
    try {
      // Platforms that have at least one enabled route (or default pc)
      const routes = await prisma.alertRoute.findMany({
        where: { enabled: true },
        select: { guildId: true, channelId: true, eventType: true, mentionRoleId: true },
      });
      if (routes.length === 0) return;

      const guildIds = [...new Set(routes.map((r) => r.guildId))];
      const configs = await prisma.discordGuildConfig.findMany({
        where: { guildId: { in: guildIds } },
      });
      const platformByGuild = new Map(configs.map((cfg) => [cfg.guildId, cfg.platform as WorldstatePlatform]));

      const platforms = new Set<WorldstatePlatform>();
      for (const gid of guildIds) {
        const p = platformByGuild.get(gid) ?? "pc";
        platforms.add(p === "ps4" || p === "xb1" || p === "swi" ? p : "pc");
      }

      for (const platform of platforms) {
        const snap = await fetchWorldstateSnapshot(platform);
        const fps = allEventFingerprints(snap, BOT_EVENT_TYPE_IDS);

        for (const { eventType, fingerprint } of fps) {
          const prev = await prisma.worldstateFingerprint.findUnique({
            where: { platform_eventType: { platform, eventType } },
          });

          if (prev?.fingerprint === fingerprint) continue;

          // First ever sighting: store without notifying (avoid spam on boot)
          const isFirst = !prev;
          await prisma.worldstateFingerprint.upsert({
            where: { platform_eventType: { platform, eventType } },
            create: { platform, eventType, fingerprint },
            update: { fingerprint },
          });
          if (isFirst) continue;

          // List events (alerts, invasions, fissures, …): only notify when NEW
          // items appear — expirations update the fingerprint silently.
          let newIds: string[] | undefined;
          if (LIST_EVENT_TYPES.has(eventType)) {
            newIds = addedFingerprintIds(prev!.fingerprint, fingerprint);
            if (newIds.length === 0) continue;
          }

          const matching = routes.filter((r) => {
            if (r.eventType !== eventType) return false;
            const gp = platformByGuild.get(r.guildId) ?? "pc";
            const norm = gp === "ps4" || gp === "xb1" || gp === "swi" ? gp : "pc";
            return norm === platform;
          });

          const embed = embedBuilder(embedForEventType(eventType, snap, newIds));
          for (const route of matching) {
            try {
              const channel = await c.channels.fetch(route.channelId).catch(() => null);
              if (!channel || !channel.isTextBased() || channel.isDMBased()) continue;
              const content = route.mentionRoleId ? `<@&${route.mentionRoleId}>` : undefined;
              await channel.send({ content, embeds: [embed] });
            } catch (err) {
              console.error(`[bot] Failed to post ${eventType} → ${route.channelId}`, err);
            }
          }
          if (matching.length > 0) {
            console.log(`[bot] ${eventType} transition → ${matching.length} channel(s) [${platform}]`);
          }
        }
      }
    } catch (err) {
      console.error("[bot] poller tick failed", err);
    }
  };

  // Initial delay so client is fully ready
  setTimeout(() => {
    void tick();
    setInterval(() => void tick(), intervalMs);
  }, 5_000);
}

async function main() {
  await registerCommands();
  await client.login(TOKEN);
}

main().catch((err) => {
  console.error("[bot] fatal", err);
  process.exit(1);
});
