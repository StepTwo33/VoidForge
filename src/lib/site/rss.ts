export type RssItem = {
  title: string;
  /** Short plain-text blurb for Discord bots and list UIs (keep under ~1500 chars). */
  description: string;
  /** Full body for feed readers that support content:encoded. */
  contentEncoded?: string;
  link: string;
  guid: string;
  pubDate: Date;
  author?: string;
};

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Word-aware plain excerpt for RSS <description> (Discord-safe). */
export function rssExcerpt(text: string, maxChars = 400): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
  return `${base}…`;
}

/** Discord / aggregator-friendly description: short blurb + link to full post. */
export function rssDescriptionWithLink(body: string, link: string, maxChars = 400): string {
  return `${rssExcerpt(body, maxChars)}\n\nRead the full update: ${link}`;
}

/** Full post as simple HTML for content:encoded. */
export function rssContentHtml(body: string): string {
  const escaped = escapeXml(body);
  return `<p>${escaped.replace(/\n/g, "<br/>")}</p>`;
}

function formatRssDate(d: Date): string {
  return d.toUTCString();
}

export function buildRssDocument(opts: {
  title: string;
  description: string;
  link: string;
  items: RssItem[];
}): string {
  const channelLink = opts.link.replace(/\/+$/, "");
  const itemsXml = opts.items
    .map((item) => {
      const author = item.author
        ? `\n      <author>${escapeXml(item.author)}</author>`
        : "";
      const encoded = item.contentEncoded
        ? `\n      <content:encoded><![CDATA[${item.contentEncoded}]]></content:encoded>`
        : "";
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${formatRssDate(item.pubDate)}</pubDate>
      <description>${escapeXml(item.description)}</description>${encoded}${author}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(opts.title)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(opts.description)}</description>
    <language>en-us</language>
${itemsXml}
  </channel>
</rss>
`;
}

export const RSS_RESPONSE_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
} as const;
