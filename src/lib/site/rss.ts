export type RssItem = {
  title: string;
  description: string;
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
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${formatRssDate(item.pubDate)}</pubDate>
      <description>${escapeXml(item.description)}</description>${author}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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
