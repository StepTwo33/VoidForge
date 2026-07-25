/**
 * Client-safe newsletter HTML builders (no Node/crypto/Resend).
 * Shared by the admin preview and the send API.
 */

export const NEWSLETTER_DEFAULT_EYEBROW = "News & updates";

export type NewsletterCompose = {
  subject: string;
  body: string;
  eyebrow?: string;
  preheader?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSafeHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** Inline markdown: **bold**, *italic*, [text](url), bare https?:// URLs. */
function formatInline(text: string): string {
  const placeholders: string[] = [];
  const stash = (html: string) => {
    const i = placeholders.length;
    placeholders.push(html);
    return `\u0000${i}\u0000`;
  };

  let s = text;

  // [label](url)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_m, label: string, url: string) => {
    if (!isSafeHttpUrl(url)) return escapeHtml(`[${label}](${url})`);
    return stash(
      `<a href="${escapeHtml(url)}" style="color: #22d3ee; text-decoration: underline;">${escapeHtml(label)}</a>`,
    );
  });

  // Bare URLs
  s = s.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)'\]])/g, (url) => {
    if (!isSafeHttpUrl(url)) return escapeHtml(url);
    return stash(
      `<a href="${escapeHtml(url)}" style="color: #22d3ee; text-decoration: underline;">${escapeHtml(url)}</a>`,
    );
  });

  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, (_m, inner: string) =>
    stash(`<strong style="color: #f1f5f9; font-weight: 600;">${escapeHtml(inner)}</strong>`),
  );

  // *italic* (after **bold** so double-stars are already stashed)
  s = s.replace(/\*([^*\n]+)\*/g, (_m, inner: string) =>
    stash(`<em>${escapeHtml(inner)}</em>`),
  );

  s = escapeHtml(s);
  s = s.replace(/\u0000(\d+)\u0000/g, (_m, i) => placeholders[Number(i)] ?? "");
  return s;
}

/**
 * Markdown subset → email-safe HTML.
 * Supports paragraphs, line breaks, ## / ### headings, - lists,
 * **bold**, *italic*, [text](url), and bare URLs.
 */
export function markdownToNewsletterHtml(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return "";

  const blocks = trimmed.split(/\n{2,}/);
  const parts: string[] = [];

  for (const raw of blocks) {
    const block = raw.trimEnd();
    if (!block.trim()) continue;

    const lines = block.split("\n");
    const headingMatch = lines[0].match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch && lines.length === 1) {
      const level = headingMatch[1].length;
      const size = level === 2 ? "16px" : "15px";
      parts.push(
        `<p style="color: #f1f5f9; font-size: ${size}; font-weight: 600; margin: 0 0 12px;">${formatInline(headingMatch[2].trim())}</p>`,
      );
      continue;
    }

    const listItems = lines.map((l) => l.match(/^-\s+(.+)$/));
    if (listItems.every(Boolean)) {
      const items = listItems
        .map((m) => `<li style="margin: 0 0 6px;">${formatInline(m![1])}</li>`)
        .join("");
      parts.push(
        `<ul style="margin: 0 0 14px; padding-left: 20px; color: #cbd5e1;">${items}</ul>`,
      );
      continue;
    }

    const html = lines.map((line) => formatInline(line)).join("<br/>");
    parts.push(`<p style="margin: 0 0 14px;">${html}</p>`);
  }

  return parts.join("");
}

/** @deprecated Prefer markdownToNewsletterHtml — kept for callers expecting plain paragraphs. */
export function plainTextToNewsletterHtml(body: string): string {
  return markdownToNewsletterHtml(body);
}

export type BuildNewsletterHtmlParams = {
  subject: string;
  bodyHtml: string;
  unsubscribeUrl: string;
  profileUrl: string;
  eyebrow?: string;
  preheader?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export function buildNewsletterHtml(params: BuildNewsletterHtmlParams): string {
  const eyebrow = (params.eyebrow?.trim() || NEWSLETTER_DEFAULT_EYEBROW).slice(0, 80);
  const preheader = params.preheader?.trim() ?? "";
  const ctaLabel = params.ctaLabel?.trim() ?? "";
  const ctaUrl = params.ctaUrl?.trim() ?? "";
  const showCta = Boolean(ctaLabel && ctaUrl && isSafeHttpsUrl(ctaUrl));

  const preheaderBlock = preheader
    ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${escapeHtml(preheader)}</div>`
    : "";

  const ctaBlock = showCta
    ? `
        <p style="margin: 22px 0 0;">
          <a href="${escapeHtml(ctaUrl)}" style="display: inline-block; background: #0ea5e9; color: #0f172a; text-decoration: none; font-size: 13px; font-weight: 600; padding: 11px 20px; border-radius: 8px;">${escapeHtml(ctaLabel)}</a>
        </p>`
    : "";

  return `
    ${preheaderBlock}
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; padding: 32px 16px;">
      <div style="max-width: 560px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 28px;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.02em; color: #e2e8f0;">
            <span style="color: #22d3ee;">Frame</span><span style="color: #94a3b8;">Hub</span>
          </h1>
          <p style="color: #64748b; font-size: 12px; margin: 10px 0 0; letter-spacing: 0.04em; text-transform: uppercase;">${escapeHtml(eyebrow)}</p>
          <div style="width: 40px; height: 3px; background: #22d3ee; border-radius: 2px; margin: 16px auto 0;"></div>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 28px 24px;">
          <p style="color: #f1f5f9; font-size: 20px; font-weight: 600; margin: 0 0 18px; line-height: 1.35;">${escapeHtml(params.subject)}</p>
          <div style="color: #cbd5e1; font-size: 14px; line-height: 1.65;">
            ${params.bodyHtml}
          </div>
          ${ctaBlock}
        </div>
        <p style="color: #475569; font-size: 11px; text-align: center; margin: 28px 0 0; line-height: 1.55;">
          You are receiving this because you opted in to FrameHub newsletters.<br/>
          <a href="${escapeHtml(params.unsubscribeUrl)}" style="color: #64748b;">Unsubscribe</a>
          · Manage preferences in your
          <a href="${escapeHtml(params.profileUrl)}" style="color: #64748b;">profile settings</a>
        </p>
      </div>
    </div>
  `;
}

/** Build final newsletter HTML from compose fields. */
export function renderNewsletterEmail(
  compose: NewsletterCompose,
  urls: { unsubscribeUrl: string; profileUrl: string },
): string {
  return buildNewsletterHtml({
    subject: compose.subject,
    bodyHtml: markdownToNewsletterHtml(compose.body),
    unsubscribeUrl: urls.unsubscribeUrl,
    profileUrl: urls.profileUrl,
    eyebrow: compose.eyebrow,
    preheader: compose.preheader,
    ctaLabel: compose.ctaLabel,
    ctaUrl: compose.ctaUrl,
  });
}

/** Full HTML document for the admin live preview iframe. */
export function buildNewsletterPreviewDocument(
  compose: NewsletterCompose,
  urls: { unsubscribeUrl: string; profileUrl: string },
): string {
  const inner = renderNewsletterEmail(compose, urls);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>html,body{margin:0;padding:0;background:#0f172a;}</style></head><body>${inner}</body></html>`;
}
