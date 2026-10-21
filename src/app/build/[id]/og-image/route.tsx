import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getBuildPageRecord } from "@/lib/builds/build-page-record";
import { publicBuildCard } from "@/lib/builds/build-page-metadata";
import { OG_IMAGE_URL } from "@/lib/site/page-metadata";

/**
 * Dynamic social image for a public build: build name, item, author and the item's image.
 * One primary-key lookup; the image is read from /public (no network fetch). Private or missing
 * builds redirect to the generic image, so nothing about them is rendered.
 */
export const runtime = "nodejs";

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");

/** Local item image as a data URL, only for PNG/JPEG files inside public/images. */
async function localImageDataUrl(src: string | null): Promise<string | null> {
  if (!src || !src.startsWith("/images/")) return null;
  const ext = path.extname(src.split("?")[0]).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : null;
  if (!mime) return null;
  const file = path.normalize(path.join(process.cwd(), "public", decodeURIComponent(src.split("?")[0])));
  if (!file.startsWith(PUBLIC_IMAGES + path.sep)) return null;
  try {
    const buf = await readFile(file);
    if (buf.byteLength > 1_500_000) return null;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = publicBuildCard(await getBuildPageRecord(id));
  if (!card) return Response.redirect(new URL(OG_IMAGE_URL, request.url), 302);

  const image = await localImageDataUrl(card.itemImage);
  const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "64px",
          background: "linear-gradient(135deg, #0b1020 0%, #111a33 60%, #1b1440 100%)",
          color: "#e6ecff",
          fontFamily: "sans-serif",
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} width={360} height={360} style={{ objectFit: "contain", marginRight: 56 }} alt="" />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 28, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: 4 }}>
            {`${card.typeLabel} build`}
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginTop: 16 }}>{clip(card.name, 60)}</div>
          <div style={{ fontSize: 40, color: "#c7d2fe", marginTop: 20 }}>{clip(card.itemName, 40)}</div>
          <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 28 }}>{`by ${clip(card.author, 32)}`}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#a78bfa", marginTop: "auto" }}>Voidforge</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
    },
  );
}
